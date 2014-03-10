(function(){
    console.log("Plane Shooting Game Begin!");

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
    var enemyAirPortClickTimer = null;
    $('#enemyAirPort').on('mouseenter', 'span', gameAction.mouseEnterEnemyAirPortCallBack);
    $('#enemyAirPort').on('mouseleave', 'span', gameAction.mouseLeaveEnemyAirPortCallBack);
    $('#enemyAirPort').on('click', 'span', gameAction.clickEnemyAirPortCallBack);

    /*$('#enemyAirPort').on('click', 'span', function(e) {
        enemyAirPortClickTimer && clearTimeout(enemyAirPortClickTimer);
        enemyAirPortClickTimer = setTimeout(function() {
            console.log('enemyAirPort Toggle' + ' i: ' + $(e.target).data('i') + ' j: ' 
            + $(e.target).data('j'));
        }, 300);
    })
    .on('dblclick', 'span', function(e) {
        enemyAirPortClickTimer && clearTimeout(enemyAirPortClickTimer);
        targetElem = e.target;
        console.log('doubleclick');
    });*/

    // ourAirPort listeners
    $('#ourAirPort').on('mouseenter', 'span', gameAction.mouseEnterOurAirPortCallBack);
    $('#ourAirPort').on('mouseleave', 'span', gameAction.mouseLeaveOurAirPortCallBack);
    $('#ourAirPort').on('click', 'span', gameAction.clickOurAirPortCallBack);

    // control button actions
    $('#retry').on('click', function() {
        window.top.location=window.top.location;
    });

    $('#startGame').on('click', function() {
        $('#ourAirPort').unbind();
    });

})();
