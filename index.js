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

function getClientBySocketID(socketID) {
    var i = 0;
    for (; i< clients.length; i++) {
        if (socketID === clients[i].socket.id) {
            break;
        }
    }

    return clients[i];
}

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

    var client = clients[i];
    clients.splice(i, 1);
    return client;
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

function isOpponentIDExist(opponentID) {
    var i = 0;

    for (; i < clients.length; i++) {
        if (clients[i].playerID == opponentID) {
           break; 
        }
    }

    if ( i == clients.length ) {
        return false;
    } else {
        return true;
    }
}

function getShootSeqByID(playerID) {
    for ( var i = 0; i < clients.length; i++ ) {
        if (clients[i].playerID == playerID) {
            return clients[i].shootSeq; 
        }
    }

    return "dinglei"
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

            if (isOpponentIDExist(data.opponentID)) {
                var opponentPlaySeq = getShootSeqByID(data.opponentID);
                if (data.shootSeq == opponentPlaySeq) {
                    socket.emit('message', {msgType: 'PLAYERID_NOT_ACK', msgInfo: 'You have the same playSeq with Your Opponent'});
                    return;
                }
            }

            data.socket = socket;
            clients.push(data);
            socket.emit('message', {msgType: 'PLAYERID_ACK'});

            if (isOpponentIDExist(data.opponentID)) {
                var opponentPlaySeq = getShootSeqByID(data.opponentID);
                if (opponentPlaySeq) {
                    var socketId = getSocketIDByClientID(data.opponentID);
                    io.sockets.socket(socketId).emit('message', {msgType: 'SERVER_SAY_SHOOT'});
                } else {
                    socket.emit('message', {msgType: 'SERVER_SAY_SHOOT'});
                }

            }
        }

        if (data.msgType === 'PLAYERID_ACK') {
            io.sockets.socket(getSocketIDByClientID(data.playerID)).emit('message', 'socketIDReceived: ' + socket.id);
            return;
        }

    });

    socket.on('disconnect', function() {
         var client = removeSpecifiedConnection(socket.id); 
         if (client == undefined) return;
         if (isOpponentIDExist(client.opponentID)) {
            console.log('Opponent exits');
            io.sockets.socket(getSocketIDByClientID(client.opponentID)).emit('message', {msgType: 'OPPONENT_QUIT'}); 
         }
         console.log('Conection disconnected');
         console.log('Clients Len: ' + clients.length);
    });

    socket.on('shoot', function(data) {
        if (data.msgType === 'SHOOT') {
            var client = getClientBySocketID(socket.id);
            var opponentSockId = getSocketIDByClientID(client.opponentID);
            io.sockets.socket(opponentSockId).emit('message', data);
        }

        if (data.msgType === 'SHOOT_ACK') {
            var client = getClientBySocketID(socket.id);
            var opponentSockId = getSocketIDByClientID(client.opponentID);
            io.sockets.socket(opponentSockId).emit('message', data);
        }

        if (data.msgType === 'YOULOST') {
            var client = getClientBySocketID(socket.id);
            var opponentSockId = getSocketIDByClientID(client.opponentID);
            io.sockets.socket(opponentSockId).emit('message', data);
        }
    });
});

console.log("Listening on port " + process.env.PORT);
