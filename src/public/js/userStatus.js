socket.emit('check-status');

socket.on('check-users-online', function (users) {
  users.forEach((userId) => {
    $(`.person[data-chat = ${userId}]`).find('div.dot').addClass('online');
    $(`.person[data-chat = ${userId}]`).find('img').addClass('avatar-online');
  });
});

socket.on('broadcast-after-login', function (userId) {
  $(`.person[data-chat = ${userId}]`).find('div.dot').addClass('online');
  $(`.person[data-chat = ${userId}]`).find('img').addClass('avatar-online');
});

socket.on('broadcast-after-logout', function (userId) {
  $(`.person[data-chat = ${userId}]`).find('div.dot').removeClass('online');
  $(`.person[data-chat = ${userId}]`).find('img').removeClass('avatar-online');
});
