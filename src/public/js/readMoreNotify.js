$(document).ready(function () {
  $('#link-read-more-notif').bind('click', function () {
    const skipNumber = $('.list-notifications').find('li').length;

    $('#link-read-more-notif').css('display', 'none');
    $('.read-more-notif-loader').css('display', 'inline-block');

    $.get(`/notification/read-more?skipNumber=${skipNumber}`, function (
      notifications
    ) {
      if (!notifications.length) {
        alertify.notify('Bạn không còn thông báo nào.', 'error', 7);
        $('#link-read-more-notif').css('display', 'inline-block');
        $('.read-more-notif-loader').css('display', 'none');
        return false;
      }

      notifications.forEach(function (notification) {
        $('ul.list-notifications').append(`<li>${notification}</li>`);
      });
      $('#link-read-more-notif').css('display', 'inline-block');
      $('.read-more-notif-loader').css('display', 'none');
    });
  });
});
