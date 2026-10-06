document.addEventListener("DOMContentLoaded", function(){ initPage() });

// Run at the start of the page (called from the html) with our best guess at Architecture
function initPage(){
  let parser = new UAParser();
  const archResult = parser.getResult().cpu.architecture;
  const oldTheme = getCookie("theme");

  if (oldTheme){
    setPageTheme(oldTheme)
  }

  populateFields(false);

  get_latest_version(archResult)
  .then(populateFields(true))
  .then(toggleContents(false, "cover"))
  .then(initOsChoice(archResult));
}
