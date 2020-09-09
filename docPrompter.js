// Client ID and API key from the Developer Console
const CLIENT_ID = '528299083579-0so7dj6dhbcu07d9btm7k7srpqseedm8.apps.googleusercontent.com';
const API_KEY = 'AIzaSyA8mlbMBwqQTQ8d6UL8fofDdwOvD744_Nw';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.readonly';

const urlParams = new URLSearchParams(window.location.search)

if(urlParams.has('fileId')) {
    var fileId
}

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
    scope: SCOPES
  }).then(function () {
    if(!gapi.auth2.getAuthInstance().isSignedIn.get()) {
        gapi.auth2.getAuthInstance().signIn();
    }
    if(urlParams.has('fileId')) {
        showFileHTML(urlParams.get('fileId'));
    }
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
 * Print files.
 */
function listFiles() {
  gapi.client.drive.files.list({
    'pageSize': 10,
    'fields': "nextPageToken, files(id, name)"
  }).then(function(response) {
    appendPre('Files:');
    var files = response.result.files;
    if (files && files.length > 0) {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        appendPre(file.name + ' (' + file.id + ')');
      }
    } else {
      appendPre('No files found.');
    }
  });
}

function showFileHTML(fileId) {
  gapi.client.drive.files.export({
    'fileId': fileId,
    'mimeType': "text/html"
  }).then(function(response) {
      console.log(response)
      document.getElementById('promptText').innerHTML = response.body;
  })
}