// Client ID and API key from the Developer Console
const CLIENT_ID = '528299083579-0so7dj6dhbcu07d9btm7k7srpqseedm8.apps.googleusercontent.com';
const API_KEY = 'AIzaSyA8mlbMBwqQTQ8d6UL8fofDdwOvD744_Nw';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.readonly';

const urlParams = new URLSearchParams(window.location.search)

// put values of url parameters into the controls
urlParams.forEach(function(value, key) {
    if(document.getElementById(key)) {
        // TODO: also have a field for fileId?
        document.getElementById(key).value = value
        if(document.getElementById(key).type == 'checkbox') {
            // special case for actual checkbox value, because why would input value be consistently sensible.
            document.getElementById(key).checked = (value=='true')
        }
    }
})

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
    // Sign in if necessary:
    if(!gapi.auth2.getAuthInstance().isSignedIn.get()) {
        gapi.auth2.getAuthInstance().signIn();
    }

    // Initialize file picker:  
    gapi.load('picker', initPicker);

    // Loat the file (if one is specified)
    if(urlParams.has('fileId')) {
        showFileHTML();
    }
  }, function(error) {
    showError(JSON.stringify(error, null, 2));
  });
}

let picker=null
function initPicker() {
    // Initialize fie picker:
    jesus_christ_I_just_wanted_a_goddamn_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token
    console.log(jesus_christ_I_just_wanted_a_goddamn_token)
    
    // All this to set it to list view instead of grid view. And it for some reason DISABLES grid view.
    let view = new google.picker.DocsView(google.picker.ViewId.DOCS)
    view.setMode(google.picker.DocsViewMode.LIST)

    picker = new google.picker.PickerBuilder().
              addView(view).
              disableFeature(google.picker.Feature.MULTISELECT_ENABLED).
              setOAuthToken(jesus_christ_I_just_wanted_a_goddamn_token).
              setDeveloperKey(API_KEY).
              setCallback(filePicked).
              build();
    document.getElementById('docselector').disabled = false
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
function showFileHTML() {
  fileId = urlParams.get('fileId')
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
    startScrolling() 
}

function stopPrompting() {
    document.getElementById('controls').hidden = false
    stopScrolling()
}

function updateSettings(){
    // TODO: update one setting at a time instead?..
    for(let s of document.getElementsByClassName('setting')){
        urlParams.set(s.id, s.value)
        if(s.type == 'checkbox') {
            // special case for actual checkbox value, because why would input value be consistently sensible.
            urlParams.set(s.id, s.checked)
        }
    }
    new_url = `${location.protocol}//${location.host}${location.pathname}?${urlParams.toString()}`
    window.history.replaceState({}, '', new_url)
}

function setSize() {
    document.getElementById('promptArea').style.fontSize = document.getElementById('textsize').value+'%'
    updateSettings()
}
setSize()

let scrollSpeed = 1
function setScrollSpeed(){
    scrollSpeed = parseFloat(document.getElementById('scrollspeed').value)
    updateSettings()
}
setScrollSpeed()

function setMirrored(){
    if (document.getElementById('mirrortext').checked){
        document.getElementById('promptArea').classList.add("mirrored");
    }
    else{
        document.getElementById('promptArea').classList.remove("mirrored");
    }
    updateSettings()
}
setMirrored()

function openPicker() {
    if(picker.setVisible)
        picker.setVisible(true);
}

function filePicked(data) {
    if(data.action=='picked') {
        urlParams.set('fileId', data.docs[0].id)
        updateSettings()
        showFileHTML()
    }
}

const scroll_fps = 30
let scrollTimer = null
/**
 * do a frame's worth of scrolling - on average, scroll by scrollSpeed every frame;
 * but scrollBy can only deal with integer scroll amounts, so store remainder in a static variable 
 * and use it when we've accumulated enough.
 */

function scroll_frame() {
    if( typeof scroll_frame.remainder == 'undefined' ) {
            scroll_frame.remainder = 0;
    }

    scroll_frame.remainder += scrollSpeed
    if(scroll_frame.remainder >= 1){
        scrollby = Math.floor(scroll_frame.remainder)
        scroll_frame.remainder -= scrollby
        document.getElementById('promptArea').scrollBy(0,scrollby)
    }

}

function startScrolling() {
    scrollTimer = setInterval(scroll_frame, 1000.0/scroll_fps)

    // Focus on the teleprompter area, to pass through scrolling user actions(e.g. arrow keys, scroll wheel)
    window.setTimeout(function(){
        document.getElementById('promptArea').focus()
        console.log(document.activeElement)
    }, 0)
}

function stopScrolling() {
    if(scrollTimer) {
        clearInterval(scrollTimer)
        scrollTimer = null
    }
}

function toggleScrolling(){
    if(scrollTimer) {
        stopScrolling()
    }
    else {
        startScrolling()
    }
}

document.onkeydown = function(e){
    if (e.keyCode == '32' || e.key==' ') {
        toggleScrolling()
        e.preventDefault() // Don't scroll on spacebar
    }

}

window.scrollTo(0,0) // Don't know why the scroll gets messed up sometimes on reload.