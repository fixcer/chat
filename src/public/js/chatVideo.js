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

function playVideoStream(videoTagId, stream) {
  let video = document.getElementById(videoTagId);

  video.srcObject = stream;
  video.onloadeddata = function () {
    video.play();
  };
}

function closeVideoStream(stream) {
  return stream.getTracks().forEach((track) => {
    track.stop();
  });
}

$(document).ready(function () {
  // Response of server when listener offline
  socket.on('listener-offline', function () {
    alertify.notify('Người dùng này hiện không trực tuyến', 'error', 7);
  });

  const iceServerList = JSON.parse($('#ice-server-list').val());

  let getPeerId = '';
  const peer = new Peer({
    key: 'peerjs',
    host: 'peer-fixcer.herokuapp.com',
    secure: true,
    port: 443,
    debug: 1,
    config: {
      iceServers: iceServerList,
    },
  });

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

  // Server send for caller
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

          let getUserMedia = (
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia
          ).bind(navigator);

          getUserMedia(
            { video: true, audio: true },
            function (stream) {
              // Show modal streaming
              $('#streamModal').modal('show');

              // Play stream of caller
              playVideoStream('local-stream', stream);

              // Call to listener
              let call = peer.call(response.listenerPeerId, stream);

              // Listen and play stream of listener
              call.on('stream', function (remoteStream) {
                playVideoStream('remote-stream', remoteStream);
              });

              // Close modal
              $('#streamModal').on('hidden.bs.modal', function () {
                closeVideoStream(stream);

                Swal.fire({
                  type: 'warning',
                  title: `Đã kết thúc cuộc gọi với &nbsp;<span style="color: #2ecc71;">${response.listenerName}</span>`,
                  backdrop: 'rgba(85, 85, 85, 0.4)',
                  width: '52rem',
                  allowOutsideClick: false,
                  confirmButtonColor: '#2ECC71',
                  confirmButtonText: 'Xác nhận',
                });
              });
            },
            function (err) {
              if (err.toString() === 'NotAllowedError: Permission denied') {
                alertify.notify('Không có quyền truy cập camera', 'error', 7);
              }

              if (
                err.toString() === 'NotFoundError: Requested device not found'
              ) {
                alertify.notify('Không tìm thấy thiết bị.', 'error', 7);
              }
            }
          );
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

          let getUserMedia = (
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia
          ).bind(navigator);

          peer.on('call', function (call) {
            getUserMedia(
              { video: true, audio: true },
              function (stream) {
                // Show modal streaming
                $('#streamModal').modal('show');

                // Play stream of listener
                playVideoStream('local-stream', stream);

                call.answer(stream); // Answer the call with an A/V stream.

                call.on('stream', function (remoteStream) {
                  // Play stream of caller
                  playVideoStream('remote-stream', remoteStream);
                });

                // Close modal
                $('#streamModal').on('hidden.bs.modal', function () {
                  closeVideoStream(stream);

                  Swal.fire({
                    type: 'warning',
                    title: `Đã kết thúc cuộc gọi với &nbsp;<span style="color: #2ecc71;">${response.callerName}</span>`,
                    backdrop: 'rgba(85, 85, 85, 0.4)',
                    width: '52rem',
                    allowOutsideClick: false,
                    confirmButtonColor: '#2ECC71',
                    confirmButtonText: 'Xác nhận',
                  });
                });
              },
              function (err) {
                if (err.toString() === 'NotAllowedError: Permission denied') {
                  alertify.notify('Không có quyền truy cập camera', 'error', 7);
                }

                if (
                  err.toString() === 'NotFoundError: Requested device not found'
                ) {
                  alertify.notify('Không tìm thấy thiết bị.', 'error', 7);
                }
              }
            );
          });
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
