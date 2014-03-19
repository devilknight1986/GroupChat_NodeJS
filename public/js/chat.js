socket = io.connect(window.location.origin);
PLAYERID = null;
OPPONENTID = null;

socket.on('message', function(data) {
    console.log(data);

    if (data.msgType === 'PLAYERID_ACK') {
        console.log('PLAYERID_ACK');
        socket.emit('send', {msgType: 'PLAYERID_ACK', playerID: PLAYERID, opponentID: OPPONENTID});

        $('#selfId').attr('disabled', 'disabled').css({'background': '#c3c3c3'});
        $('#opponentId').attr('disabled', 'disabled').css({'background': '#c3c3c3'});
        $('#startGame').attr('disabled', 'disabled').css({'background': '#c3c3c3'});
        $('input[type=radio]').attr('disabled', 'disabled').css({'background': '#c3c3c3'}); 
        return;
    }

    if (data.msgType === 'PLAYERID_NOT_ACK') {
        alert(data.msgInfo);
        return;
    }

    if (data.msgType === 'SERVER_SAY_SHOOT') {
        alert("Shoot please");
        $('#send').removeAttr('disabled');
        return;
    }

    if (data.msgType === 'OPPONENT_QUIT') {
        alert("Server says your opponent has quit, please retry");
        $('#retry').trigger('click');
        return;
    }

    if (data.msgType === 'SHOOT') {
        if (gameAction.isOurPlaneHeadHit(data.i, data.j)) {
            gameAction.placeSignOnAirPort(data.i, data.j, '#ourAirPort', 'X');
            socket.emit('shoot', {msgType: 'SHOOT_ACK', i: data.i, j: data.j, status:'HIT'});

            alert("Shooting info recevied, it is your turn to shoot");
            $('#send').removeAttr('disabled');
            return;
        }

        if (gameAction.isOurPlaneBodiesHit(data.i, data.j)) {
            gameAction.placeSignOnAirPort(data.i, data.j, '#ourAirPort', '/');
            socket.emit('shoot', {msgType: 'SHOOT_ACK', i: data.i, j: data.j, status:'INJURED'});
        } else {
            gameAction.placeSignOnAirPort(data.i, data.j, '#ourAirPort', 'O');
            socket.emit('shoot', {msgType: 'SHOOT_ACK', i: data.i, j: data.j, status:'NOHITORINJURED'});
        }


        alert("Shooting info recevied, it is your turn to shoot");
        $('#send').removeAttr('disabled');
        return;
    }

    if (data.msgType === 'SHOOT_ACK') {
        if (data.status == "HIT") {
            gameAction.placeSignOnAirPort(data.i, data.j, '#enemyAirPort', 'X');
            if (gameAction.headsHited.length < 2) {
                gameAction.headsHited.push({i: data.i, j: data.j})
            } else {
                socket.emit('shoot', {msgType: 'YOULOST', msgInfo: 'You have lost game!'});
                alert('Your are the winner');
                $('#retry').trigger('click');
            }
        } else if (data.status == "INJURED") {
            gameAction.placeSignOnAirPort(data.i, data.j, '#enemyAirPort', '/');
        } else {
            gameAction.placeSignOnAirPort(data.i, data.j, '#enemyAirPort', 'O');
        }
    }

    if (data.msgType === 'YOULOST') {
        alert(data.msgInfo);
        $('#retry').trigger('click');
    }
});

socket.on('disconnect', function(data) {
    console.log('You have been kicked out by Game Server');
});

// socket.emit('send', {msgType: 'PLAYERID', playerID: PLAYERID, opponentID: OPPONENTID});
