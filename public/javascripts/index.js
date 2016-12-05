var nickname // = "Anonymous" + Math.floor((Math.random() * 999) + 1);
var socket = io();
// Called when the user submit a new nickname
function submit_new_nickname(event) {
    var newNickname = $('#nickname').val();
    if (newNickname != "" && newNickname != undefined && newNickname != nickname) {
        nickname = newNickname;
        socket.emit('new nickname', nickname);
        $('.saved').fadeIn('slow', function() {
            setTimeout(function() {$('.saved').fadeOut('slow')}, 2000)
        });
    }
    event.preventDefault();
    return false;
}
// Called when the user submit a new message
function submit_message(event) {
    var m = $('#m').val();
    if (m != "" && m != undefined) {
      socket.emit('chat message', {message: m, nickname: nickname});
      $('#m').val('');
    }
    event.preventDefault();
    return false;
}
// Called when the server sends a notice
// i.e.: User login, Disconnect, changes his name
function on_chat_notice(notice) {
    $('#messages').append($('<li>').text(notice));
}
// Called when a new message from another user comes in.
function on_chat_message(msg) {
    if (msg.message && msg.nickname) {
        console.log("Chat Message!")
        console.log(msg.nickname);
      $('#messages').append($('<li>').text(msg.nickname+": "+msg.message));
    } else if(msg) {
      $('#messages').append($('<li>').text(msg))
    }
}
// Called when there's a change in the list of users.
// Receives the whole list of users.
function on_users_list(userslist) {
    //console.log(userslist);
    $('#users').empty();
   userslist.forEach(function(nickname) {
      $('#users').append($('<li>').text(nickname));
    });
    $('#users').find("li:contains('"+nickname+"')").filter(function() {
        return $(this).text() === nickname;
    }).addClass("me");
}
function on_whoareyou() {
    if (nickname) {
        socket.emit('iam', nickname);
    }
}
$(document).ready(function() {
    //socket.emit('new user', nickname);
    //socket.emit('chat message', {message: "Connected", nickname: nickname});
    $('form#submit-message').submit(submit_message);
    $('form#submit-nickname').submit(submit_new_nickname);
    socket.on('chat notice', on_chat_notice);
    socket.on('chat message', on_chat_message);
    socket.on('users list', on_users_list);
    socket.on('whoareyou', on_whoareyou);
    socket.emit("whoami")
    socket.on("youare", function(mynickname) {
        nickname = mynickname;
    })
}) 