(function(){
    console.log("Plane Shooting Game Begin!");
    ISMYTURN = 'false';

    // Draw AirPorts
    gameUI.initAirPort('#ourAirPort');
    gameUI.initAirPort('#enemyAirPort');
    gameUI.initPlaneModel('#airPlaneModel');

    //
    // Add listeners for Game Action
    //
    $('#airPlaneModel').on('click', function() {
        gameUI.initPlaneModel('#airPlaneModel');
    });

    $('body').on('keypress', function(e) {
        // add firefox complaining for keypress
        var keycode = (e.keyCode ? e.keyCode : e.which);

        // 32 means space
        if (keycode === 32) {
            console.log(e.keyCode);
            gameUI.initPlaneModel('#airPlaneModel');

            if (MOUSEENTEREVENT === '') return;

            var $target = $(MOUSEENTEREVENT.target);
            var airPortID = $target.closest('div').attr('id');
            
            var i = $target.data('i');
            var j = $target.data('j');
            var selector = '#' + airPortID + ' span[data-i=' + '\"' + i + '\"' + ']' +  '[data-j=' + '\"'+ j +  '\"' +']';

            $(selector).trigger('mouseleave');
            $(selector).trigger('mouseenter');
        }
    });

    // enemyAirPort listeners(click and dblclick)
    $('#enemyAirPort').on('mouseenter', 'span', gameAction.mouseEnterEnemyAirPortCallBack);
    $('#enemyAirPort').on('mouseleave', 'span', gameAction.mouseLeaveEnemyAirPortCallBack);
    // $('#enemyAirPort').on('click', 'span', gameAction.clickEnemyAirPortCallBack);

    var enemyAirPortClickTimer = null;
    $('#enemyAirPort').on('click', 'span', function(e) {
        enemyAirPortClickTimer && clearTimeout(enemyAirPortClickTimer);
        enemyAirPortClickTimer = setTimeout(function() {
            gameAction.clickEnemyAirPortCallBack(e);
        }, 300);
    })
    .on('dblclick', 'span', function(e) {
        enemyAirPortClickTimer && clearTimeout(enemyAirPortClickTimer);
        gameAction.dblclickEnemyAirPortCallBack(e);
        console.log('doubleclick');
    });

    // ourAirPort listeners
    $('#ourAirPort').on('mouseenter', 'span', gameAction.mouseEnterOurAirPortCallBack);
    $('#ourAirPort').on('mouseleave', 'span', gameAction.mouseLeaveOurAirPortCallBack);
    $('#ourAirPort').on('click', 'span', gameAction.clickOurAirPortCallBack);

    // control button actions
    $('#retry').on('click', function() {
        window.top.location=window.top.location;
    });

    $('#startGame').on('click', function() {
        if (gameAction.ourAirPortPlanePos.planePosHeads.length != 3) {
            alert('Sorry, game cannot start until there are 3 plane in ourAirPort');
            return;
        }

        PLAYERID = $('#selfId').val();
        OPPONENTID = $('#opponentId').val();
        if (PLAYERID == '' || OPPONENTID == '') {
            alert('Sorry, cannot input null id'); 
            return;
        }
        if (PLAYERID == OPPONENTID) {
            alert('People cannot play game with themselves');
            return;
        }

        if ($('input:radio:checked').val() == 1) {
            ISMYTURN = 'true';
        } else {
            ISMYTURN = 'false';
        }
        console.log(ISMYTURN);
        socket.emit('send', {msgType: 'PLAYERID', playerID: PLAYERID, opponentID: OPPONENTID, shootSeq: ISMYTURN});
        $('#ourAirPort').unbind();
    });

    $('#send').on('click', function() {
        var vPos = $('#vPos').val();
        var hPos = $('#vPos').val();
        var valid = (1 <= vPos && vPos <= 9 && 1 <= hPos && hPos <= 9);

        if (valid == false) {
            alert('Sorry, the shooting position is not valid');
            return;
        }
    });
    
})();
