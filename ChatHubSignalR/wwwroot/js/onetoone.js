"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (fromUser, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.textContent = `${fromUser} : ${message}`;
});

connection.on("NewUserRegistered", function (lstUsers) {
    var lst = document.getElementById("lstUsers");
    for (var user in lstUsers) {
        if (lstUsers[user] !== document.getElementById("fromUserName").value) {
            var option = document.createElement("option");
            option.text = lstUsers[user];
            lst.options.add(option);
        }
    }
});
connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});
document.getElementById("registerButton").addEventListener("click", function (event) {
    var user = document.getElementById("fromUserName").value;
    connection.invoke("RegisterMe", user).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});
document.getElementById("sendButton").addEventListener("click", function (event) {
    var fromUser = document.getElementById("fromUserName").value;
    var toUser = document.getElementById("lstUsers").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", fromUser, toUser, message).catch(function (err) {
        return console.error(err.toString());
    });
    document.getElementById("messageInput").focus();
    document.getElementById("messageInput").value = "";
    event.preventDefault();
});

function clearField() {   
    //document.getElementById("messageInput").focus();
}