window.onload = function() {
 
    var messages = [];
	var usernames = ['System'];
    var socket = io.connect('http://10.29.2.15:3700');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var contentSpecific = document.getElementById("contentSpecific");
	var name = document.getElementById("name");
	var personname = document.getElementById("personname");
	function display(data) {
        if(data.message) {
			if (data.username) {
				if (data.personname == "") {
					content.innerHTML += data.username + ': ' + data.message + '<br />'; 
				} else {
					if (data.username == name.value || data.personname == name.value) {
						contentSpecific.innerHTML += data.username + ' ContactWith ' + data.personname + ' :' + data.message + '<br />';
					}
				}
			} else {
				content.innerHTML += 'System' + ': ' + data.message + '<br />'; 
				contentSpecific.innerHTML += 'System' + ': ' + 'Private Room' + '<br />'; 
			}
        } else {
            console.log("There is a problem:", data);
        }
	}
 
    socket.on('message', function (data) {
			display(data);
    });
 
    sendButton.onclick =sendMessage= function() {
		if (name.value == "") {
			alert("Please type your name!");
			return;
		}

        var text = field.value;
        socket.emit('send', { message: text, username: name.value, personname: personname.value });
		field.value="";
    };
 
}


$(document).ready(function() {
		$('#field').keyup(function(e) {
			if (e.keyCode == 13) {
				sendMessage();
			}
		});
});
