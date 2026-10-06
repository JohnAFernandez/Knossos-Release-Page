const fallbackVersion = "1.3.11"
let checksumUrl = "https://github.com/KnossosNET/Knossos.NET/releases/download/v1.3.11/checksums.txt";

const buildMatrix = {
  windows: {
    arm64Installer: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/Knossos.NET-${fallbackVersion}-arm64.exe`,
      version: `${fallbackVersion}`
    },
    x64Installer: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/Knossos.NET-${fallbackVersion}-x64.exe`,
      version: `${fallbackVersion}`
    },
    x86Installer: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/Knossos.NET-${fallbackVersion}-x86.exe`,
      version: `${fallbackVersion}`
    },
    arm64: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/Windows_arm64.zip`,
      version: `${fallbackVersion}`
    },
    x64: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/Windows_x64.zip`,
      version: `${fallbackVersion}`
    },
    x86: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/Windows_x86.zip`,
      version: `${fallbackVersion}`
    }
  },
  linux: {
    arm64Installer: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/Knossos.NET-aarch64.AppImage`,
      version: `${fallbackVersion}`
    },
    x64Installer: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/Knossos.NET-x86_64.AppImage`,
      version: `${fallbackVersion}`
    },
    arm64: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/Linux_arm64.tar.gz`,
      version: `${fallbackVersion}`
    },
    x64: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/Linux_x64.tar.gz`,
      version: `${fallbackVersion}`
    }
  },
  macos: {
    installer: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/Knossos.NET-${fallbackVersion}.dmg`,
      version: `${fallbackVersion}`
    },
    appleSilicon: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/MacOS_arm64.tar.gz`,
      version: `${fallbackVersion}`
    },
    intel: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/MacOS_x64.tar.gz`,
      version: `${fallbackVersion}`
    }
  }
}


let detectedOS = -1;
let detectedArch = -1;
let arch = 0;

// borrowed from Vlad Turak
// https://stackoverflow.com/questions/38241480/detect-macos-ios-windows-android-and-linux-os-with-js
// Despite us having the other library for detecting these settings, this has worked well enough so far
function initOsChoice(archResult) {
  const userAgent = window.navigator.userAgent,
      platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
      macosPlatforms = ['macOS', 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'];

  // save arch result for later
  detectedArch = archResult;

  if (macosPlatforms.indexOf(platform) !== -1) {
    detectedOS = 1;
    activateMac();
    activateTheButton();
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    activateMac();
    disableTheButton(); // No ios builds, so user must pick if they want one.
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    detectedOS = 0;
    activateWindows();
    activateTheButton();
  } else if (/Android/.test(userAgent)) {
    activateWindows();
    disableTheButton(); // No android builds, so user must pick if they want one.
  } else if (/Linux/.test(platform)) {
    detectedOS = 2;
    activateLinux();
    activateTheButton();
  }
}

async function get_latest_version(arch) {
  fetch("https://api.github.com/repos/KnossosNET/Knossos.NET/releases/latest")
  .then((response) => response.json())
  .then(responseJSON => { 
    // still looking for a good ARM list.  Hopefully defaulting to ARM and detecting the other two is enough.
    const arch64List = ["EM64T", "x86-64", "Intel 64", "amd64"];
    const arch32List = ["ia32", "x86", "amd32"];

    let archResult = 0;

    if (arch64List.includes(arch)) {
      archResult = 64;
    } else if (arch32List.includes(arch)){
      archResult = 32;
    }

    get_info(responseJSON); 
  })
  .catch (error => {
    console.log(`Fetching the most recent build from the github api failed. The error encountered was: ${error}`)
    toggleContents(false, "cover");
    
  });  
}

function get_info(response){
  //console.log(response);

  if (!response || !response.hasOwnProperty("assets")){

    console.log("Early return. Response is null or does not have assets");
    return;
  }

  let newVersion = fallbackVersion;

  if (response.hasOwnProperty("tag_name")){
    // Our tag names have the v, but in a lot of places we don't need it, so cut it off.
    if (response.tag_name[0] === `v`){
      newVersion = response.tag_name.slice(-response.tag_name.length + 1);
    } else {
      newVersion = response.tag_name;
    }
  }

  // return if we already have this version.
  if (newVersion === fallbackVersion){
    return;
  }

  let x = 0;

  while (x < response.assets.length){
    if (!response.assets[x].hasOwnProperty("name") || !response.assets[x].hasOwnProperty("browser_download_url")){
      x++;
      continue;
    }

    if (response.assets[x].name.endsWith("arm64.exe")){
      buildMatrix.windows.arm64Installer.version = newVersion;
      buildMatrix.windows.arm64Installer.url = response.assets[x].browser_download_url;
    } else if (response.assets[x].name.endsWith("x64.exe")){
      buildMatrix.windows.x64Installer.version = newVersion;
      buildMatrix.windows.x64Installer.url = response.assets[x].browser_download_url;
    } else if (response.assets[x].name.endsWith("x86.exe")){
      buildMatrix.windows.x86Installer.version = newVersion;
      buildMatrix.windows.x86Installer.url = response.assets[x].browser_download_url;
    } else if (response.assets[x].name.endsWith(".dmg")){
      buildMatrix.macos.installer.version = newVersion;
      buildMatrix.macos.installer.url = response.assets[x].browser_download_url;
    } else if (response.assets[x].name.endsWith("aarch64.AppImage")){
      buildMatrix.linux.arm64Installer.version = newVersion;
      buildMatrix.linux.arm64Installer.url = response.assets[x].browser_download_url;
    } else if (response.assets[x].name.endsWith("x86_64.AppImage")){
      buildMatrix.linux.x64Installer.version = newVersion;
      buildMatrix.linux.x64Installer.url = response.assets[x].browser_download_url;
    } else if (response.assets[x].name==="Linux_arm64.tar.gz"){
      buildMatrix.linux.arm64.version = newVersion;
      buildMatrix.linux.arm64.url = response.assets[x].browser_download_url;
    } else if (response.assets[x].name==="Linux_x64.tar.gz"){
      buildMatrix.linux.x64.version = newVersion;
      buildMatrix.linux.x64.url = response.assets[x].browser_download_url;
    } else if (response.assets[x].name==="MacOS_arm64.tar.gz"){
      buildMatrix.macos.appleSilicon.version = newVersion;
      buildMatrix.macos.appleSilicon.url = response.assets[x].browser_download_url;
    } else if (response.assets[x].name==="MacOS_x64.tar.gz"){
      buildMatrix.macos.intel.version = newVersion;
      buildMatrix.macos.intel.url = response.assets[x].browser_download_url;
    } else if (response.assets[x].name==="Windows_arm64.zip"){
      buildMatrix.windows.arm64.version = newVersion;
      buildMatrix.windows.arm64.url = response.assets[x].browser_download_url;
    } else if (response.assets[x].name==="Windows_x64.zip"){
      buildMatrix.windows.x64.version = newVersion;
      buildMatrix.windows.x64.url = response.assets[x].browser_download_url;      
    } else if (response.assets[x].name==="Windows_x86.zip"){
      buildMatrix.windows.x86.version = newVersion;
      buildMatrix.windows.x86.url = response.assets[x].browser_download_url;      
    } else if (response.assets[x].name==="checksums.txt"){
      checksumUrl = response.assets[x].browser_download_url;
    }
    x++;
  }
}

// Borrowed from w3schools
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}