(function(){
    console.log('GameUI init');

    AIRPORTSIZE = 9;
    PLANEGRIDSNUM = 11;
    MOUSEENTEREVENT = {};

    gameUI =  {
        planeModelPos: {
            arrPositions: {
                3: [{j: 3, i: 1}, {j:3, i:2}, {j:3, i:3}, {j:3, i:4}, {j:3, i:5},
                {j: 1, i: 3}, {j:2, i:3},  {j:4, i:3}, {j:5, i:3},
                {j: 5, i: 2}, {j:5, i:4}],
                
                2: [{j: 3, i: 1}, {j:3, i:2}, {j:3, i:3}, {j:3, i:4}, {j:3, i:5},
                {j: 1, i: 3}, {j:2, i:3},  {j:4, i:3}, {j:5, i:3},
                {j: 2, i: 1}, {j:4, i:1}],
                
                1: [{j: 3, i: 1}, {j:3, i:2}, {j:3, i:3}, {j:3, i:4}, {j:3, i:5},
                {j: 1, i: 3}, {j:2, i:3},  {j:4, i:3}, {j:5, i:3},
                {j: 1, i: 2}, {j:1, i:4}],
                
                0: [{j: 3, i: 1}, {j:3, i:2}, {j:3, i:3}, {j:3, i:4}, {j:3, i:5},
                {j: 1, i: 3}, {j:2, i:3},  {j:4, i:3}, {j:5, i:3},
                {j: 2, i: 5}, {j:4, i:5}],
            },

            arrHeadPos: {
                0: {i: 1, j: 3},
                1: {i: 3, j: 5},
                2: {i: 5, j: 3},
                3: {i: 3, j: 1},
            },

            currentPosIndex: -1
        },

        initAirPort: function(airPort) {
            console.log('init airport Grid ' + airPort);

            for (var i = 1; i <= AIRPORTSIZE; i++) {
                for (var j = 1; j <= AIRPORTSIZE; j++) {
                   var $grid = $('<span></span>')
                                   .appendTo(airPort) 
                                   .addClass('airPortGrid');
                   $grid.attr('data-i', i);
                   $grid.attr('data-j', j);

                   /*if ( j == AIRPORTSIZE ) {
                       $grid.addClass('airPortGridWithPlane'); 
                   }
                   if ( j == 8 ) {
                       $grid.addClass('airPortGridWithPlaneAttacked'); 
                       $grid.text('X');
                   }*/
                }
            }
        },

        initPlaneModel: function(planeModel) {
            console.log('init airPlaneModel ' + planeModel);
            $(planeModel).html('');
            var positions = gameUI.planeModelPos;
            positions.currentPosIndex += 1;
            positions.currentPosIndex = positions.currentPosIndex % 4;

            for (var i = 1; i <= 5; i++) {
                for (var j = 1; j <= 5; j++) {
                   var $grid = $('<span></span>')
                                   .appendTo(planeModel) 
                                   .addClass('airPortGrid');

                   if (gameUI.containsInCurPlane(i, j)) {
                       $grid.addClass('airPortGridWithPlane'); 
                   }
                }
            }

        },

        // Helper methods
        containsInCurPlane: function (i, j) {
            var positions = gameUI.planeModelPos;
            var curPlanePos = positions.arrPositions[positions.currentPosIndex]; 

            for (var m = 0; m < curPlanePos.length; m++) {
               if (i == curPlanePos[m].i && j == curPlanePos[m].j) {
                   return true;
               }
            }

            return false;
        }
    };

    gameAction = {
        curPossiblePlanePos: {
            planePosBodies: [],
            planePosHeads: []
        },

        ourAirPortPlanePos: {
            planePosBodies: [],
            planePosHeads: []
        },

        enemyAirPortPlanePos: {
            planePosBodies: [],
            planePosHeads: []
        },

        mouseEnterOurAirPortCallBack: function(e) {
            MOUSEENTEREVENT = e;
            var $target = $(e.target);
            var i = $target.data('i');
            var j = $target.data('j');
            var selector = '#ourAirPort span[data-i=' + '\"' + i + '\"' + ']' +  '[data-j=' + '\"'+ j +  '\"' +']';

            gameAction.calcPossiblePlanePos(i, j);
            //$target.addClass('airPortGridWithPlaneOpac');
            gameAction.toggleClassForPossibleGrid('airPortGridWithPlaneOpac', true, '#ourAirPort');
        },

        mouseLeaveOurAirPortCallBack: function(e) {
            MOUSEENTEREVENT = '';
            var $target = $(e.target);
            //$target.removeClass('airPortGridWithPlaneOpac'); 
            gameAction.toggleClassForPossibleGrid('airPortGridWithPlaneOpac', false, '#ourAirPort');
        },

        mouseEnterEnemyAirPortCallBack: function(e) {
            MOUSEENTEREVENT = e;
            var $target = $(e.target);
            var i = $target.data('i');
            var j = $target.data('j');

            gameAction.calcPossiblePlanePos(i, j);
            gameAction.toggleClassForPossibleGrid('enemyAirPortGridWithPlaneOpac', true, '#enemyAirPort');
        },

        mouseLeaveEnemyAirPortCallBack: function(e) {
            MOUSEENTEREVENT = '';
            gameAction.toggleClassForPossibleGrid('enemyAirPortGridWithPlaneOpac', false, '#enemyAirPort');
        },


        clickOurAirPortCallBack: function(e) {
            if (gameAction.isPlaneHead(e.target, gameAction.ourAirPortPlanePos)) {
                console.log('revoke');
                if (gameAction.revokeCurPlaneSelection(e.target, gameAction.ourAirPortPlanePos) == false) {
                    alert('cannot revoke plane');
                    return;
                }
                console.log(gameAction.ourAirPortPlanePos.planePosBodies.length);
                console.log(gameAction.ourAirPortPlanePos.planePosHeads.length);
                gameAction.toggleClassForPossibleGrid('airPortGridWithPlane', false, '#ourAirPort');
                gameAction.toggleClassForPossibleGrid('airPortGridWithPlaneOpac', false, '#ourAirPort');
                return;
            }

            if (gameAction.collideCheck(gameAction.ourAirPortPlanePos)) {
                gameAction.toggleClassForPossibleGrid('airPortGridWithPlane', true, '#ourAirPort', '#ourAirPort');
                gameAction.toggleClassForPossibleGrid('airPortGridWithPlaneOpac', false, '#ourAirPort');
                var curPlanePosHead = gameAction.getPlaneHead(e.target);
                gameAction.ourAirPortPlanePos.planePosHeads.push(curPlanePosHead);
            } else {
                alert('Sorry, cannot place here!');
            }
            console.log(gameAction.ourAirPortPlanePos.planePosBodies.length);
            console.log(gameAction.ourAirPortPlanePos.planePosHeads.length);
        },

        //helper methods
        revokeCurPlaneSelection: function(target, airPortPlanePos) {
            $target = $(target);
            var i = $target.data('i');
            var j = $target.data('j');
            var planePosHeads = airPortPlanePos.planePosHeads;
            var planePosBodies = airPortPlanePos.planePosBodies;
            var m = 0;
            for (; m < planePosHeads.length; m++) {
                if ( planePosHeads[m].i == i && planePosHeads[m].j == j) {
                    break;
                }
            }

            if (gameAction.isSameDirection(i, j, airPortPlanePos, m) == false) {
                return false;
            }

            planePosHeads.splice(m, 1);
            planePosBodies.splice(m * PLANEGRIDSNUM, PLANEGRIDSNUM);
            return true;
        },

        clickEnemyAirPortCallBack: function(e) {
            if (gameAction.isPlaneHead(e.target, gameAction.enemyAirPortPlanePos)) {
                console.log('revoke');
                if (gameAction.revokeCurPlaneSelection(e.target, gameAction.enemyAirPortPlanePos) == false) {
                    alert('cannot revoke plane');
                    return;
                }
                console.log(gameAction.enemyAirPortPlanePos.planePosBodies.length);
                console.log(gameAction.enemyAirPortPlanePos.planePosHeads.length);
                gameAction.toggleClassForPossibleGrid('enemyAirPortGridWithPlane', false, '#enemyAirPort');
                gameAction.toggleClassForPossibleGrid('enemyAirPortGridWithPlaneOpac', false, '#enemyAirPort');
                return;
            }

            if (gameAction.collideCheck(gameAction.enemyAirPortPlanePos)) {
                gameAction.toggleClassForPossibleGrid('enemyAirPortGridWithPlane', true, '#enemyAirPort');
                gameAction.toggleClassForPossibleGrid('enemyAirPortGridWithPlaneOpac', false, '#enemyAirPort');
                var curPlanePosHead = gameAction.getPlaneHead(e.target);
                gameAction.enemyAirPortPlanePos.planePosHeads.push(curPlanePosHead);
            } else {
                alert('Sorry, cannot place here!');
            }
            console.log(gameAction.enemyAirPortPlanePos.planePosBodies.length);
            console.log(gameAction.enemyAirPortPlanePos.planePosHeads.length);
        },

        isSameDirection: function(i, j, airPortPlanePos, indexOfPlanePos) {
            console.log('isSameDirection called');
            var planePosBodies = airPortPlanePos.planePosBodies;
            var curPlaneIndexOfPlanePosBodies = indexOfPlanePos * PLANEGRIDSNUM;
            var curPlaneModelBody = gameUI.planeModelPos.arrPositions[gameUI.planeModelPos.currentPosIndex];
            var curPlaneModeHead = gameUI.planeModelPos.arrHeadPos[gameUI.planeModelPos.currentPosIndex];
            var curPlaneEndIndexOfPlanePosBodies = curPlaneIndexOfPlanePosBodies + PLANEGRIDSNUM;
            console.log(curPlaneModeHead);
            console.log(planePosBodies.length);

            for ( var m = curPlaneIndexOfPlanePosBodies, n = 0; m < curPlaneEndIndexOfPlanePosBodies; m++, n++) {
                if ( (planePosBodies[m].i - i) != (curPlaneModelBody[n].i - curPlaneModeHead.i)) return false; 
                if ( (planePosBodies[m].j - j) != (curPlaneModelBody[n].j - curPlaneModeHead.j)) return false; 
            }

            return true;
        },

        isPlaneHead: function(target, airPortPlanePos) {
            $target = $(target);
            var i = $target.data('i');
            var j = $target.data('j');
            var planePosHeads = airPortPlanePos.planePosHeads;
            for (var m = 0; m < planePosHeads.length; m++) {
                if ( planePosHeads[m].i == i && planePosHeads[m].j == j) {
                    return true;
                }
            }

            return false;
        },

        getPlaneHead: function(target) {
            $target = $(target);
            var i = $target.data('i');
            var j = $target.data('j');
            return { 'i': i, 'j': j };
        },

        collideCheck: function(airPortPlanePos){
            var curPossiblePlanePos = gameAction.curPossiblePlanePos;

            for (var m = 0; m < curPossiblePlanePos.planePosBodies.length; m++) {
                for (var n = 0; n < airPortPlanePos.planePosBodies.length; n++) {
                    if (airPortPlanePos.planePosBodies[n].i == curPossiblePlanePos.planePosBodies[m].i && airPortPlanePos.planePosBodies[n].j == curPossiblePlanePos.planePosBodies[m].j) {
                        return false;
                    }
                }
            };

            if (curPossiblePlanePos.planePosBodies.length != PLANEGRIDSNUM) return false;

            airPortPlanePos.planePosBodies.push.apply(airPortPlanePos.planePosBodies, curPossiblePlanePos.planePosBodies);
            return true;
        },

        calcPossiblePlanePos: function(i, j) {
            var curPossPos = []; 
            var planeModelPos = gameUI.planeModelPos; 
            var planePos = planeModelPos.arrPositions[planeModelPos.currentPosIndex];
            var planeHeadPos = planeModelPos.arrHeadPos[planeModelPos.currentPosIndex];

            for (var m = 0; m < planePos.length; m++) {
                var planePosBodyPart = planePos[m];
                var i_ourAirPort = planePosBodyPart.i + i - planeHeadPos.i;
                var j_ourAirPort = planePosBodyPart.j + j - planeHeadPos.j;
                if (1 <= i_ourAirPort && i_ourAirPort <= AIRPORTSIZE && 1 <= j_ourAirPort && j_ourAirPort <= AIRPORTSIZE) {
                   curPossPos.push({i: i_ourAirPort, j: j_ourAirPort}); 
                }
            }

            gameAction.curPossiblePlanePos.planePosBodies = curPossPos;
        },

        toggleClassForPossibleGrid: function(posClass, toggle, airPortSelector) {
           var curPossPos = gameAction.curPossiblePlanePos.planePosBodies;

           for (var m = 0; m < curPossPos.length; m++) {
               var i = curPossPos[m].i; 
               var j = curPossPos[m].j; 
               var selector = airPortSelector + ' span[data-i=' + '\"' + i + '\"' + ']' +  '[data-j=' + '\"'+ j +  '\"' +']';
               if (toggle) {
                   $(selector).addClass(posClass);
               } else {
                   $(selector).removeClass(posClass);
               }
           }
        }

    };

})();
