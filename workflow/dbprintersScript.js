// Contextual custom menu - borrowed code
function contextualMenu() {
  let combobox = document.getElementById("js-listItem");
  _currentMenuVisible = null;
  combobox.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    // only will open context menu when right clicking
    if (e.button === 2) createContextMenu(e.clientX, e.clientY);
  });
  document.addEventListener("click", (e) => {
    closeCurrentlyOpenedMenu();
  });

  /* close context menu */
  window.onkeyup = function (e) {
    if (e.keyCode === 27) {
      closeCurrentlyOpenedMenu();
    }
  };

  function createContextMenu(x, y) {
    closeCurrentlyOpenedMenu();
    const ctxMenuElem = document.createElement("div");
    ctxMenuElem.classList.add("contextMenu");
    const ulElem = document.createElement("ul");
    const menuArr = ["Set as Default", "Add to Favorites", "XYZ option"];
    for (let ele of menuArr) {
      let liElem = document.createElement("li");
      liElem.innerHTML = '<a href="#">' + ele + "</a>";
      ulElem.appendChild(liElem);
    }
    ctxMenuElem.appendChild(ulElem);
    document.body.appendChild(ctxMenuElem);
    _currentMenuVisible = ctxMenuElem;
    ctxMenuElem.style.display = "block";
    ctxMenuElem.style.left = x + "px";
    ctxMenuElem.style.top = y + "px";
  }

  function closeContextMenu(menu) {
    menu.style.left = "0px";
    menu.style.top = "0px";
    document.body.removeChild(menu);
    _currentMenuVisible = null;
  }

  function closeCurrentlyOpenedMenu() {
    if (_currentMenuVisible !== null) {
      closeContextMenu(_currentMenuVisible);
    }
  }
}
// End Contextual custom menu

function openOutputDestination(e) {
  window.open(
    "./outputDestionationDialog/outputDestination.html",
    "_blank",
    "menubar=1,resizable=0,width=700,height=690"
  );
}
