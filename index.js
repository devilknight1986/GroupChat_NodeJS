var express = require("express");
var app = express();
var port = 3700;
 
app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));
app.get("/", function(req, res){
    res.render("page");
});

var clients = [];
function getSocketIDByClientID(clientID) {
    var socketID = "Hello";
    for (var i = 0; i < clients.length; i++) {
        if (clientID === clients[i].playerID) {
            socketID = clients[i].socket.id;
        }
    }
    
    return socketID;
}

function removeUnconnectedConnection() {
   var i = 0; 
   for (; i < clients.length; i++) {
       if (clients[i].socket.status == undefined) {
            console.log("socket undefined");
            break;
       }
   }

   clients.splice(i, 1);
}

function removeSpecifiedConnection(socketID) {
    var i = 0;
    for (; i < clients.length; i++) {
        if (clients[i].socket.id == socketID) {
            console.log("socket disconnect");
            break;
        }
    }

    clients.splice(i, 1);
}

function isPlayerIDConflictedWithPlayersOnline(playerID) {
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].playerID == playerID) return true;
    }

    return false;
}
 
function isOpponentIDPlayingWithAnotherPlayer(playerID, opponentID) {
    var i = 0;

    for (; i < clients.length; i++) {
        if (clients[i].opponentID == playerID) {
           break; 
        }
    }

    if ( i == clients.length ) return false;
    if ( clients[i].playerID == opponentID ) {
        return false;
    } else {
        return true;
    }

}

var io = require('socket.io').listen(app.listen(process.env.PORT || 3700));
io.sockets.on('connection', function (socket) {

    socket.on('send', function (data) {
        if (data.playerID == null || data.opponentID == null) {
            socket.disconnect();
            return;
        }

        if (data.msgType === 'PLAYERID') {
            if (isPlayerIDConflictedWithPlayersOnline(data.playerID)) {
                socket.emit('message', {msgType: 'PLAYERID_NOT_ACK', msgInfo: 'playerID ' + data.playerID + ' exist'});
                return;
            }

            if (isOpponentIDPlayingWithAnotherPlayer(data.playerID, data.opponentID)) {
                socket.emit('message', {msgType: 'PLAYERID_NOT_ACK', msgInfo: 'Opponent ' + data.playerID + ' not proper'});
                return;
            }

            data.socket = socket;
            clients.push(data);
            socket.emit('message', {msgType: 'PLAYERID_ACK'});
        }

        if (data.msgType === 'PLAYERID_ACK') {
            io.sockets.socket(getSocketIDByClientID(data.playerID)).emit('message', 'socketIDReceived: ' + socket.id);
            return;
        }
    });

    socket.on('disconnect', function() {
         removeSpecifiedConnection(socket.id); 
         console.log('Conection disconnected');
         console.log('Clients Len: ' + clients.length);
    });
});

console.log("Listening on port " + process.env.PORT);
