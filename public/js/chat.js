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

});

socket.on('disconnect', function(data) {
    console.log('You have been kicked out by Game Server');
});

// socket.emit('send', {msgType: 'PLAYERID', playerID: PLAYERID, opponentID: OPPONENTID});
