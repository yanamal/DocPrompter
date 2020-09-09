// Client ID and API key from the Developer Console
const CLIENT_ID = '528299083579-0so7dj6dhbcu07d9btm7k7srpqseedm8.apps.googleusercontent.com';
const API_KEY = 'AIzaSyA8mlbMBwqQTQ8d6UL8fofDdwOvD744_Nw';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.readonly';

const urlParams = new URLSearchParams(window.location.search)

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handlePageLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES,
    ux_mode: 'redirect',
  }).then(function () {
    if(!gapi.auth2.getAuthInstance().isSignedIn.get()) {
        gapi.auth2.getAuthInstance().signIn();
    }
    if(urlParams.has('fileId')) {
        showFileHTML(urlParams.get('fileId'));
    }
  }, function(error) {
    showError(JSON.stringify(error, null, 2));
  });
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Hack to display error messages when they aren't handled in some other way.
 *
 * @param {string} message Text to be placed in pre element.
 */
function showError(message) {
  var pre = document.getElementById('errors');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
 * Display the HTML of a given Google Drive file in the telepromter text element.
 * 
 * @param {string} fileId google drive fileId for the file to display
 */
function showFileHTML(fileId) {
  gapi.client.drive.files.export({
    'fileId': fileId,
    'mimeType': "text/html"
  }).then(function(response) {
      // Put googl docs contents into the telempromter text element:
      document.getElementById('promptText').innerHTML = response.body;
      // Strip out font-sizee property from text, so that it can be controlled programmatically:
      for(var e of document.getElementById('promptText').querySelectorAll('*')) {
        e.style.removeProperty('font-size')
      }
  })
}

function startPrompting() {
    document.documentElement.webkitRequestFullScreen()
    document.getElementById('controls').hidden = true
    console.log('start')
}

function stopPrompting() {
    document.getElementById('controls').hidden = false
    console.log('stop')
}

function setSize() {
    document.getElementById('promptText').style.fontSize = document.getElementById('textsize').value+'%'
    console.log(document.getElementById('textsize').value+'%')
    console.log(document.getElementById('textsize'))
    console.log(document.getElementById('promptText').style.fontSize)
}