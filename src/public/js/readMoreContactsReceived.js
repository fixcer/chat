$(document).ready(function () {
  $('#link-read-more-contacts-received').bind('click', function () {
    const skipNumber = $('#request-contact-received').find('li').length;

    $('#link-read-more-contacts-received').css('display', 'none');
    $('.read-more-contacts-received-loader').css('display', 'inline-block');

    $.get(
      `/contact/read-more-contacts-received?skipNumber=${skipNumber}`,
      function (contacts) {
        if (!contacts.length) {
          alertify.notify('Bạn không còn danh sách nào.', 'error', 7);
          $('#link-read-more-contacts-received').css('display', 'inline-block');
          $('.read-more-contacts-received-loader').css('display', 'none');
          return false;
        }

        contacts.forEach(function (user) {
          $('#request-contact-received')
            .find('ul')
            .append(
              `<li class="_contactList" data-uid="${user._id}">
              <div class="contactPanel">
                <div class="user-avatar">
                  <img src="images/users/${user.avatar}" alt="" />
                </div>
                <div class="user-name">
                  <p>${user.username}</p>
                </div>
                <br />
                <div class="user-address">
                  <span>&nbsp ${
                    user.address !== null ? user.address : ''
                  }</span>
                </div>
                <div class="user-approve-request-contact-received" data-uid="${
                  user._id
                }">
                  Chấp nhận
                </div>
                <div class="user-remove-request-contact-received action-danger"
                  data-uid="${user._id}">
                  Xóa yêu cầu
                </div>
              </div>
            </li>`
            );
        });

        removeRequestContactReceived();
        approveRequestContactReceived();

        $('#link-read-more-contacts-received').css('display', 'inline-block');
        $('.read-more-contacts-received-loader').css('display', 'none');
      }
    );
  });
});
