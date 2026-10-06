// Change tab appearance and download link contents
function changeActivation(enable, id, id2){
  
  toggleSelectedTab(enable, id2);
  toggleContents(enable, id);
}


// Change the appearance of the tab based on whether it's selected.
function toggleSelectedTab(enable, id2){
  const element = document.getElementById(id2);

  if (enable === true){
    element.style.fontWeight = 'bold';
    element.style.backgroundColor = "#121212";
  } else if (enable === false){
    element.style.fontWeight = 'normal';
    element.style.backgroundColor = "#080808";
  }
}

// Switch the download link contents on or off.
function toggleContents(enable, id)
{
  const element = document.getElementById(id);

  if (enable === true){
    element.style.display = 'inline';
  } else if (enable === false){
    element.style.display = 'none';
  }
}

// Disable the auto detected downoad because we are not confident enough to have the correct choice.
function disableTheButton(){
  toggleContents(false, "downLinks");
  toggleContents(false, "downloadTab");
}

function activateTheButton(){

  const os = detectedOS;
  const arch = detectedArch;

  // sanity!
  if (os < 0 || os > 2){
    disableTheButton();
    return;
  }

  const anchorElement = document.getElementById("theButton");
  // Download Link contents
  let newContents = '';
  // Contents for notes *after* the download link
  let noteContents = "";

  // arch 0 means ARM, 32 means 32 bit, 64 means 64 bit

  // Windows
  if (os === 0) {
    if (arch === 0){
      newContents += `${buildMatrix.windows.arm64Installer.version} Windows ARM64 Installer`;
      anchorElement.href = buildMatrix.windows.arm64Installer.url;

    } else if (arch === 32) {
      newContents += `${buildMatrix.windows.x86Installer.version} Windows 32 Bit Installer`;
      anchorElement.href = buildMatrix.windows.x86Installer.url;
    
    } else if (arch === 64) {
      newContents += `${buildMatrix.windows.x64Installer.version} Windows 64 Bit Intel Installer`;
      anchorElement.href = buildMatrix.windows.x64Installer.url;

    // Bogus Windows arch
    }  else {
      disableTheButton();
      return;
    }

  // Mac
  } else if (os === 1) {

    // Because of universal build, handle both situations at once.
    if (arch === 0 || arch === 64) {  
      newContents += `${buildMatrix.macos.installer.version} macOS Universal DMG`;
      anchorElement.href = buildMatrix.macos.installer.url;

    } else if (arch === 32) {
      // Unsuppoted
      disableTheButton();

    // Bogus Mac Arch (Or so old that we're wondering how they're still using it)
    } else {
      disableTheButton();
      return;
    }

  // Linux
  } else if (os === 2) {
    if (arch === 0) {
      newContents +=  `${buildMatrix.linux.arm64Installer.version} Linux aarch64 AppImage`;
      anchorElement.href = buildMatrix.linux.arm64Installer.url;

    } else if (arch === 32) {
        // Unsupported
        disableTheButton();

    } else if (arch === 64) {
      newContents += `${buildMatrix.linux.x64Installer.version} Linux x86_64 AppImage`;
      anchorElement.href = buildMatrix.linux.x64Installer.url;

    // Bogus Linux Arch
    } else {
      disableTheButton();
      return;
    }

    noteContents += "NOTE: When using these images in combination with appimaged or other management system, we recommend disabling auto-update in the Knossos settings tab."

    // Bad OS, somehow
  } else {
//    console.log("really really not detected!");
    disableTheButton();
    return;
  }

  // Set download link text
  document.getElementById("theButtonText").textContent = newContents;

  // Add some final text, explaining the use of other tabs
  document.getElementById("button-extra-text").textContent = noteContents;

  // Go ahead and let the user see it
  activateDownload();
}


function activateDownload(){
  // turn on autodetect
  changeActivation(true, "downLinks", "downTab")

  // turn off everything else
  changeActivation(false, "macLinks", "macTab");
  changeActivation(false, "linLinks", "linTab");
  changeActivation(false, "winLinks", "winTab");

}

function activateWindows(){
  // turn on windows
  changeActivation(true, "winLinks", "winTab");

  // turn off everything else
  changeActivation(false, "macLinks", "macTab");
  changeActivation(false, "linLinks", "linTab");
  changeActivation(false, "downLinks", "downTab")
}

function activateMac(){
  // Turn on macOS
  changeActivation(true, "macLinks", "macTab");

  // turn off everything else
  changeActivation(false, "linLinks", "linTab");
  changeActivation(false, "winLinks", "winTab");
  changeActivation(false, "downLinks", "downTab")
}

function activateLinux(){
  // turn on linux
  changeActivation(true, "linLinks", "linTab");

  // turn off everything else
  changeActivation(false, "winLinks", "winTab");
  changeActivation(false, "macLinks", "macTab");
  changeActivation(false, "downLinks", "downTab")
}

function populateFields(populateAutoUpdate){
  document.getElementById("winarm-installer-version").textContent = buildMatrix.windows.arm64Installer.version;
  document.getElementById("winx64-installer-version").textContent = buildMatrix.windows.x64Installer.version;
  document.getElementById("winx86-installer-version").textContent = buildMatrix.windows.x86Installer.version;
  document.getElementById("winarm-pack-version").textContent = buildMatrix.windows.arm64.version;
  document.getElementById("winx64-pack-version").textContent = buildMatrix.windows.x64.version;
  document.getElementById("winx86-pack-version").textContent = buildMatrix.windows.x86.version;

  document.getElementById("winarm-installer-link").href = buildMatrix.windows.arm64Installer.url;
  document.getElementById("winx64-installer-link").href = buildMatrix.windows.x64Installer.url;
  document.getElementById("winx86-installer-link").href = buildMatrix.windows.x86Installer.url;
  document.getElementById("winarm-pack-link").href = buildMatrix.windows.arm64.url;
  document.getElementById("winx64-pack-link").href = buildMatrix.windows.x64.url;
  document.getElementById("winx86-pack-link").href = buildMatrix.windows.x86.url;


  document.getElementById("macuni-version").textContent = buildMatrix.macos.installer.version;
  document.getElementById("macapplesilicon-version").textContent = buildMatrix.macos.appleSilicon.version;
  document.getElementById("macintel-version").textContent = buildMatrix.macos.intel.version;

  document.getElementById("macuni-link").href = buildMatrix.macos.installer.url;
  document.getElementById("macapplesilicon-link").href = buildMatrix.macos.appleSilicon.url;
  document.getElementById("macintel-link").href = buildMatrix.macos.intel.url;


  document.getElementById("linuxarm-appimage-version").textContent = buildMatrix.linux.arm64Installer.version;
  document.getElementById("linuxx64-appimage-version").textContent = buildMatrix.linux.x64Installer.version;
  document.getElementById("linuxarm-binaries-version").textContent = buildMatrix.linux.arm64.version;
  document.getElementById("linuxx64-binaries-version").textContent = buildMatrix.linux.x64.version;

  document.getElementById("linuxarm-appimage-link").href = buildMatrix.linux.arm64Installer.url;
  document.getElementById("linuxx64-appimage-link").href = buildMatrix.linux.x64Installer.url;
  document.getElementById("linuxarm-binaries-link").href = buildMatrix.linux.arm64.url;
  document.getElementById("linuxx64-binaries-link").href = buildMatrix.linux.x64.url;

  document.getElementById("checksum-link-windows").href = checksumUrl;
  document.getElementById("checksum-link-mac").href = checksumUrl;
  document.getElementById("checksum-link-linux").href = checksumUrl;
  document.getElementById("checksum-link-autodetect").href = checksumUrl;

  if (populateAutoUpdate){
    activateTheButton();
  }
}

function setPageTheme(theme){
  const validThemes = [ "Knet", "Classic", "Vishnan", "Ancients", "Nightmare", "Ae" ];

  if ( !validThemes.includes(theme) ) return;

  document.body.setAttribute('data-theme', theme);
  document.cookie = `theme=${theme}`;
}
