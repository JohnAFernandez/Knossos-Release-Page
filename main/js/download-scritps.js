function changeActivation(enable, id){
  var nodes = document.getElementById(id).getElementsByTagName('*');

  console.log(nodes);

  if (enable === true){
    document.getElementById(id).style.display = 'inline';
  } else if (enable === false){
    document.getElementById(id).style.display = 'none';
  }
}


function activateWin(){
  console.log("Windows Chosen");

  changeActivation(false, "macLinks");
  changeActivation(false, "linLinks");
  changeActivation(true, "winLinks");
}

function activateMac(){
  console.log("macOS chosen");

  changeActivation(false, "linLinks");
  changeActivation(false, "winLinks");
  changeActivation(true, "macLinks");

}

function activateLinux(){
  console.log("Linux chosen");

  changeActivation(false, "winLinks");
  changeActivation(false, "macLinks");
  changeActivation(true, "linLinks");
}

// borrowed from Vlad Turak
// https://stackoverflow.com/questions/38241480/detect-macos-ios-windows-android-and-linux-os-with-js
function initOsChoice() {
  const userAgent = window.navigator.userAgent,
      platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
      macosPlatforms = ['macOS', 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'];

  if (macosPlatforms.indexOf(platform) !== -1) {
    activateMac();
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    activateMac();
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    activateWin();
  } else if (/Android/.test(userAgent)) {
    activateWin();
  } else if (/Linux/.test(platform)) {
    activateLinux();
  }
}