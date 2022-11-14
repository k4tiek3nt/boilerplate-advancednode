$(document).ready(function () {
  /* Global io */
  let socket = io();

  //updated to announce new user connection
  socket.on('user', (data) => {

    //displays number of users
    $('#num-users').text(data.currentUsers + ' users online');
    
    //announces username when user connects or disconnects from the chat
    let message = data.username + (data.connected ? ' has joined the chat.' : ' has left the chat.');

    //tells the dom to append the announcement as a list for both connections and disconnects
    $('#messages').append($('<li>').html('<b>' + message + '</b>'));
  });

  // Form submittion with new message in field with id 'm'
  $('form').submit(function () {
    
    //updated from var to let, this allows for redeclaration as needed
    let messageToSend = $('#m').val();
    
    //sends message to server as string
    $('#m').val('');

    // Prevents form submit from refreshing page
    return false; 
  });
});