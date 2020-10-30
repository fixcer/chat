function chatVideo(divId) {
  $(`#video-chat-${divId}`)
    .unbind('click')
    .on('click', function () {
      let targetId = $(this).data('chat');
      let callerName = $('#navbar-username').text().trim();

      let dataToEmit = {
        listenerId: targetId,
        callerName,
      };

      // Check status listener
      socket.emit('caller-check-listener', dataToEmit);
    });
}

$(document).ready(function () {
  // Response of server when listener offline
  socket.on('listener-offline', function () {
    alertify.notify('Người dùng này hiện không trực tuyến', 'error', 7);
  });

  let getPeerId = '';
  const peer = new Peer();
  peer.on('open', function (peerId) {
    getPeerId = peerId;
  });

  // Listener create peer id and send peer id to server
  socket.on('request-peer-id', function (response) {
    const listenerName = $('#navbar-username').text().trim();
    const dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName,
      listenerPeerId: getPeerId,
    };

    // Listener emit peer id to server
    socket.emit('listener-emit-peer-id', dataToEmit);
  });

  // Receiver peer id of listener from server and request call
  socket.on('check-status-caller', function (response) {
    const dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId,
    };

    // Caller call listener through server
    socket.emit('call-listener-through-server', dataToEmit);

    let timeInterval;
    Swal.fire({
      title: `Đang gọi&nbsp;<span style="color: #2ecc71;">${response.listenerName}</span>...&nbsp;<i class="fa fa-volume-control-phone"></i>`,
      html: `
        Thời gian: <strong style="color: #d43f3a;"></strong> giây.<br/><br/>
        <button id="btn-cancel-call" class="btn btn-danger">Hủy cuộc gọi</button>
      `,
      backdrop: 'rgba(85, 85, 85, 0.4)',
      width: '52rem',
      allowOutsideClick: false,
      timer: 30000,
      onBeforeOpen: () => {
        $('#btn-cancel-call')
          .unbind('click')
          .on('click', function () {
            Swal.close();
            clearInterval(timeInterval);

            // Caller cancel
            socket.emit('caller-cancel', dataToEmit);
          });
        Swal.showLoading();
        timeInterval = setInterval(() => {
          Swal.getContent().querySelector('strong').textContent = Math.ceil(
            Swal.getTimerLeft() / 1000
          );
        }, 1000);
      },
      onOpen: () => {
        // Server send reject call for caller
        socket.on('send-reject-call', function (response) {
          Swal.close();
          clearInterval(timeInterval);

          Swal.fire({
            type: 'warning',
            title: `<span style="color: #2ecc71;">${response.listenerName}</span>&nbsp;không phản hồi`,
            backdrop: 'rgba(85, 85, 85, 0.4)',
            width: '52rem',
            allowOutsideClick: false,
            confirmButtonColor: '#2ECC71',
            confirmButtonText: 'Xác nhận',
          });
        });

        // Server send accept call for caller
        socket.on('send-accept-call-to-caller', function (response) {
          Swal.close();
          clearInterval(timeInterval);

          console.log('Caller ok');
        });
      },
      onClose: () => {
        clearInterval(timeInterval);
      },
    }).then((result) => {
      return false;
    });
  });

  // Server send request call for listener
  socket.on('send-request-call', function (response) {
    const dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId,
    };

    let timeInterval;
    Swal.fire({
      title: `<span style="color: #2ecc71;">${response.callerName}</span>&nbsp;đang gọi cho bạn...`,
      html: `
        Thời gian: <strong style="color: #d43f3a;"></strong> giây.<br/><br/>
        <button id="btn-accept-call" class="btn btn-success">Chấp nhận</button>
        <button id="btn-reject-call" class="btn btn-danger">Từ chối</button>
      `,
      backdrop: 'rgba(85, 85, 85, 0.4)',
      width: '52rem',
      allowOutsideClick: false,
      timer: 30000,
      onBeforeOpen: () => {
        $('#btn-reject-call')
          .unbind('click')
          .on('click', function () {
            Swal.close();
            clearInterval(timeInterval);

            // Listener send reject call for server
            socket.emit('reject-call', dataToEmit);
          });

        $('#btn-accept-call')
          .unbind('click')
          .on('click', function () {
            Swal.close();
            clearInterval(timeInterval);

            // Listener send accept call for server
            socket.emit('accept-call', dataToEmit);
          });

        Swal.showLoading();
        timeInterval = setInterval(() => {
          Swal.getContent().querySelector('strong').textContent = Math.ceil(
            Swal.getTimerLeft() / 1000
          );
        }, 1000);
      },
      onOpen: () => {
        // Server send request cancel call for listener
        socket.on('send-request-cancel-call', function (response) {
          Swal.close();
          clearInterval(timeInterval);
        });

        // Server send accept call for listener
        socket.on('send-accept-call-to-listener', function (response) {
          Swal.close();
          clearInterval(timeInterval);

          console.log('Listener ok');
        });
      },
      onClose: () => {
        clearInterval(timeInterval);
      },
    }).then((result) => {
      return false;
    });
  });
});
