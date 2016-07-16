/**
 * accid-make-call.js
 *
 * Click and Event Handlers for making a call
 *
 * This one should be included in <script> tag
 * after accid-setup-phone.js
 *
 * @author RS, ATT CP&TS, DRT LTA/SDK
 */

btnCall.onclick = function() {
  var callee;

  info('Calling...');

  callee = getCalleeId();

  // Dial the number or account id
  //
  phone.dial({
    destination: phone.cleanPhoneNumber(callee),
    mediaType: 'video',
    localMedia: vidLocal,
    remoteMedia: vidRemote
  });
};

phone.on('call:connected', onCallConnected);

function onCallConnected(event) {

  info('Call connected.');

  // Show Phone's control buttons
  //
  btnHold.hidden = false;
  btnResume.hidden = false;

  btnMute.hidden = false;
  btnUnmute.hidden = false;

  // Hide only answer button
  //
  btnAnswer.hidden = true;

}

phone.on('call:disconnected', onCallDisconnected);

btnHangup.onclick = function() {

  info('Disconnecting...');

  // Hang up
  //
  phone.hangup();
};

function onCallDisconnected(event) {

  info('Call disconnected.');

  // Hide Phone's control buttons
  //
  btnHold.hidden = true;
  btnResume.hidden = true;

  btnMute.hidden = true;
  btnUnmute.hidden = true;

}

/**
 * Hold, Resume actions and callbacks
 *
 */
btnHold.onclick = function() {
  phone.hold();
};

btnResume.onclick = function() {
  phone.resume();
};

phone.on('call:held', fnHeld);
phone.on('call:resumed', fnResumed);

function fnHeld() {
  info('Call is on hold.');
}

function fnResumed() {
  info('Call is resumed.');
}

/**
 * Mute, Unmute actions and callbacks
 *
 */
btnMute.onclick = function() {
  phone.mute();
};

btnUnmute.onclick = function() {
  phone.unmute();
};

phone.on('call:muted', fnMuted);
phone.on('call:unmuted', fnUnmuted);

function fnMuted() {
  info('Call is muted.');
}

function fnUnmuted() {
  info('Call is unmuted.');
}