/**
 * accid-setup-phone.js
 * 
 * Click and Event Handlers for phone login
 *
 * This one should be included in <script> tag 
 * after accid-check-browser.js
 *
 * @author RS, ATT CP&TS, DRT LTA/SDK
 */

// Global variables
//
var dhs_url = window.location.origin + '/config';

var phone = ATT.rtc.Phone.getPhone();

var ewebrtc_domain, app_tokens_url;


/**
 * Get the Account Id domain
 *
 */

function initDhsConfig() {

  var xhr = new XMLHttpRequest();

  xhr.open('GET', dhs_url);

  xhr.onreadystatechange = function() {

    if (xhr.readyState === 4 && xhr.status === 200) {

      var dhs_config = JSON.parse(xhr.responseText);

      // Get the domain
      //
      ewebrtc_domain = dhs_config.ewebrtc_domain;
      app_tokens_url = dhs_config.app_tokens_url;
      spnAIdDomain.textContent = ewebrtc_domain;
      txtCalleeDomain.value = ewebrtc_domain;

      info('Obtained Account Id Domain.');

    } else {

      error('Unable to obtain Account Id Domain. Response: ' + xhr.responseText);
    }

  };

  xhr.send();
}


/**
 * Create access token for the User's
 * Account Id, associate it and login
 * the Phone
 */

btnLogin.onclick = function() {

  var account_id = txtCaller.value;

  if (account_id && account_id.length !== 0) {

    if (isAlphanumericWithFirstAlphabet(account_id)) {

      createAccessToken(account_id);

    } else {

      error('Account Id must be in an alphanumeric format');

    }

  } else {

    error('Account Id cannot be empty. Enter an alphanumeric string');

  }

};

/**
 * Check the input to show the callee
 * domain input field if the user inputs
 * alphanumeric text, otherwise it hides
 * the callee domain input field
 */

txtCallee.onkeyup = function (e) {
  var input = this.value;

  if (isNaN(input)) {

    calleeDomain.hidden = false;

  } else {

    calleeDomain.hidden = true;

  }

};

/**
 * Create Access Token
 *
 */

function createAccessToken(account_id) {

  // Create AccessToken
  //
  var xhr = new XMLHttpRequest();

  xhr.open('POST', app_tokens_url);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {

      var response_json = JSON.parse(xhr.responseText);
      var access_token = response_json.access_token;

      info('Access Token obtained. Setting up Phone... ');
      setupPhone(account_id, access_token);

    } else {

      error('Error obtaining Access Token. Please check your server.');

    }
  };
  info('Requesting Access Token...');
  xhr.send(JSON.stringify({
    app_scope: 'ACCOUNT_ID'
  }));

}

/**
 * Set up Phone
 *
 */

function setupPhone(account_id, access_token) {
	phone.login({ userId: account_id, token: access_token });
}

phone.on('error', fnErr);

/**
 * Error function simply updates the status
 *
 */
function fnErr(event) {

  var sdkMsg = 'Message: ' + event.ErrorMessage;
  var apiMsg = event.APIError ? (' API Error: ' + event.APIError) : '';

  var msg = sdkMsg + apiMsg;
  error(msg);
}

phone.on('gateway:unreachable', fnGateWayUnreachable);

/**
 * Gateway Unreachable indicates temporary problem
 * with API Platform.
 *
 */
function fnGateWayUnreachable(event) {
  var msg = 'Temporary problem with API Platform. ' +
    'Please check back later. If this persists, ' +
    'contact Platform Administrator';

  error(msg);
}

/**
 * session:ready event is fired when a
 * WebRTC session in the platform is created
 * successfully
 */
phone.on('session:ready', fnSessionReady);

function fnSessionReady(event) {

  info('Login success. Phone is Ready.');

  // Toggle Login, Logout buttons
  //
  btnLogin.hidden = true;
  btnLogout.hidden = false;

  // Show Phone's controls
  //
  txtCallee.hidden = false;
  btnCall.hidden = false;
  btnHangup.hidden = false;
}

/**
 * When Logout button is clicked, or user moves
 * away from the page, perform steps needed to
 * hangup phone and clean up Sessions etc.
 *
 */

window.onbeforeunload = btnLogout.onclick = function() {

  info('Logging out Phone...');

  // attempt logout
  //
  phone.logout();

};

phone.on('session:disconnected', fnSessionDisconnected);

function fnSessionDisconnected() {
  // Update status
  //
  info('Logged out. Login with Account Id.');

  // Toggle Login, Logout buttons
  //
  btnLogin.hidden = false;
  btnLogout.hidden = true;

  // Hide Phone's controls
  //
  txtCallee.hidden = true;
  btnCall.hidden = true;
  btnHangup.hidden = true;
  btnAnswer.hidden = true;
}
