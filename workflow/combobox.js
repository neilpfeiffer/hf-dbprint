// ========================================================================
// === DEBUG === //
// ========================================================================
let debug;
// ========================================================================
// === CONFIG === //
// ========================================================================
// Configure combobox according to query string
// Parse query string and convert it into an object
let urlParams = new URLSearchParams(window.location.search);
let configObject = {
  clientSize: urlParams.get("clientSize") === "large" ? "large" : "small", 
  isDefaultDevice: urlParams.get("defaultDevice") === "false" ? false : true,
  isNewUser: urlParams.get("newUser") === "false" ? false : true, /// new user or seasoned user TRUE AND FALSE BOOLEANS
  isNewDBPrint: urlParams.get("newDBPrint") === "false" ? false : true,
  title: urlParams.get("scenarioTitle"),
  dialog: urlParams.get("outputDialog"),
  loadDelay: parseInt(urlParams.get("delay"))
};
const { clientSize, isDefaultDevice, isNewUser, isNewDBPrint, title, dialog, loadDelay } = configObject;
let opts = {
  contextFilter: "all", // One of "all", "printers", "faxes", "favorites",
  maxFilterCount: 100
}
let dataObject = {
  defaultList: [],
  preConfiguredList: [],
  rawList: []
}; // END Config



// ======================================================
// UTILS
// ======================================================
function assignSelectedHighlight () {
  let currentSelection = document.getElementById("cb_identifier").getAttribute("data-current-selection");
  let optionsList = document.getElementById("js-dbprintersList").getElementsByTagName("a");
  for (let i = 0; i < optionsList.length; i++) {
    if (optionsList[i].getAttribute("data-value") === currentSelection) {
      optionsList[i].classList.add("selected", "highlight");
      document.getElementById("js-dbprintersList").setAttribute("data-current-highlight-index", i);
      document.getElementById("cb_identifier").setAttribute("data-current-selection-index", i);
    }
  }
} // END assignSelectedHighlight

function removeHighlight () {
  // cycle through all
  // let optionsList = document.getElementById("js-dbprintersList").getElementsByTagName("a");
  // for (let i = 0; i < optionsList.length; i++) {
  //   optionsList[i].classList.remove("highlight");
  // }
  // cycle only through ones that might have it
  if (document.getElementsByClassName("highlight").length > 0) {
    [].forEach.call(document.getElementsByClassName("highlight"), function(el) {
      el.classList.remove("highlight");
    });
  }
  document.getElementById("js-dbprintersList").removeAttribute("data-current-highlight-index");
} // END removeHighlight

function removeSelectedHighlight () {
  if (document.getElementsByClassName("selected").length > 0) {
    [].forEach.call(document.getElementsByClassName("selected"), function(el) {
      el.classList.remove("selected");
    });
  }
} // END removeSelectedHighlight


function toggleDroplist (state) {
  const cbInput = document.getElementById("cb_identifier");
  const cbDroplist = document.getElementById("js-dbprintersList");
  if (state === "open") {
    setTimeout(function () {
      assignSelectedHighlight();
      cbDroplist.style.display = "block";
      cbInput.setAttribute("data-list-is-open", "true");
      toggleOverlay("on");
    }, 10);
  } 
  if (state === "close") {
    toggleOverlay("off");
    cbInput.setAttribute("data-list-is-open", "false");
    cbDroplist.style.display = "none";
    // setTimeout(function () {
    cbDroplist.removeAttribute("data-current-highlight-index");
    if (cbDroplist.getAttribute("data-quicklist-mode") === "false") {
      removeList();
      resetQuickList();
      cbDroplist.setAttribute("data-quicklist-mode", "true");
    } else {
      removeHighlight();
    }
    // }, 10);
  }
  return true;
} // END toggleDroplist

function toggleOverlay (state) {
  let overlay = document.getElementById("js-overlayMask");
  if (state === "on") {
    overlay.classList.add("overlay-mask");
  }
  if (state === "off") {
    overlay.classList.remove("overlay-mask");
  }
} // END toggleOverlay

function filterOptionValue (optionString) {
  let stringPv = optionString.split(" — ");
  if (stringPv.length > 1) {
    return optionString.split(" — ").shift();
  } 
  return optionString;
} // END filterOptionValue

function removeList () {
  // -- NEW LIST REMOVAL UTIL
  const hintmessage = document.getElementById("js-dbprintersList-hint").innerText;
  const listhint = document.createElement("p");
  listhint.className = "dropdownlist-hint";
  listhint.id = "js-dbprintersList-hint";
  listhint.innerText = hintmessage;
  const listcontainer = document.getElementById("js-dbprintersList");
  listcontainer.innerHTML = "";
  listcontainer.append(listhint);
  listcontainer.setAttribute("data-quicklist-mode", "");
} // END removeList


// "Searching all...";
// "Enter 3 characters to search all...";

function resetListHint () {
  document.getElementById("js-dbprintersList-hint").innerText = "Enter 3 characters to search printers...";
} // END resetListHint

function resetQuickList () {
  const { defaultList, preConfiguredList } = dataObject 
  const quickList = document.getElementById("js-dbprintersList");
  quickList.setAttribute("data-quicklist-mode", "true");
  let counter = 0;
  for (let i = 0; i < defaultList.length; i++) {
    defaultList[i].setAttribute("data-value-index", counter);
    quickList.append(defaultList[i]);
    counter++;
  }
  for (let j = 0; j < preConfiguredList.length; j++) {
    preConfiguredList[j].setAttribute("data-value-index", counter);
    quickList.append(preConfiguredList[j]);
    counter++;
  }
  if (debug) { debugUpdateListCountInfo(`${counter} (quick list)`); }
} // END resetQuickList

function resetDropList () {
  let currentSelection = document.getElementById("cb_identifier").getAttribute("data-current-selection");
  document.getElementById("cb_identifier").value = currentSelection;
  toggleDroplist("close");
  resetListHint();
  resetQuickList();
  document.getElementById("js-dbprintersList").setAttribute("data-quicklist-mode", "true");
  // if (currentSelection.length > 0) { 
    // document.getElementById("cb_identifier").value = currentSelection;
  // }
} // END resetDropList

function resetAllList () {
  const { rawList } = dataObject;
  const quickList = document.getElementById("js-dbprintersList");
  quickList.setAttribute("data-quicklist-mode", "false");
  let counter = 0;
  for (let i = 0; i < rawList.length; i++) {
    rawList[i].setAttribute("data-value-index", counter);
    // temp
    //const tempVal = rawList[i].getAttribute("data-value");
    //rawList[i].innerHTML = tempVal + " - " + counter;
    // end temp
    quickList.append(rawList[i]);
    counter++;
  }
  if (debug) { debugUpdateListCountInfo(`${counter} (all list)`); }
} // END resetAllList

function setInputSelection (selectionValue, indexValue) {
  const cbInput = document.getElementById("cb_identifier");
  const cbDroplist = document.getElementById("js-dbprintersList");
  cbInput.setAttribute("data-current-selection", selectionValue);
  if (cbDroplist.getAttribute("data-quicklist-mode") === "false") {
    const valueCheck = [];
    dataObject.defaultList.forEach(element => valueCheck.push(element.getAttribute("data-value")));
    dataObject.preConfiguredList.forEach(element => valueCheck.push(element.getAttribute("data-value")));
    if (debug) { document.getElementById("field-delay").innerText = `${valueCheck.includes(selectionValue)} (in list already)`; }
    if ( !valueCheck.includes(selectionValue) ) {
      // Only add if not already in the quick list
      let selectOption = document.createElement("a");
      selectOption.setAttribute("data-printers-quicklist","");
      selectOption.setAttribute("data-value", selectionValue);
      selectOption.setAttribute("data-value-index", "");
      selectOption.addEventListener("click", attachListMouseOnClick);
      selectOption.addEventListener("mouseover", attachListMouseOver);
      selectOption.innerHTML = selectionValue;
      // dataObject.defaultList.push(selectOption);
      dataObject.preConfiguredList.unshift(selectOption);
    }
    // Gets reset when selection gets assigned
    cbInput.setAttribute("data-current-selection-index", "");
  } else {
    cbInput.setAttribute("data-current-selection-index", indexValue);   
  }
  cbInput.value = selectionValue;
  toggleDroplist("close");
  removeSelectedHighlight();
  if (cbDroplist.getAttribute("data-quicklist-mode") === "false") {
    removeList();  
    resetQuickList();
    cbDroplist.setAttribute("data-quicklist-mode", "true");
  }
  resetListHint();
  cbInput.blur();
  document.body.focus();
  //##?? resetDropList();
} // END setInputSelection





function filterAllList (inputValue) {
  const re = new RegExp('(' + inputValue + ')', "i");
  const { rawList } = dataObject;
  const quickList = document.getElementById("js-dbprintersList");
  quickList.setAttribute("data-quicklist-mode", "false");
  let counter = 0;
  for (let i = 0; i < rawList.length; i++) {
    const dv = rawList[i].getAttribute("data-value");
    if (re.test(dv)) {
      rawList[i].setAttribute("data-value-index", counter);
      // temp
      //const tempVal = rawList[i].getAttribute("data-value");
      //rawList[i].innerHTML = tempVal + " - " + counter;
      // end temp
      quickList.append(rawList[i]);
      counter++;
      if (counter === opts.maxFilterCount) {
        const firstOption = quickList.getElementsByTagName("a")[0];
        [].forEach.call(quickList.getElementsByTagName("a"), function(el) {
          const prevIndex = parseInt(el.getAttribute("data-value-index"));
          el.setAttribute("data-value-index", prevIndex+1); 
        });
        const outputDialogOptionZero = createOutputDestinationDialogItem(0);
        const outputDialogOptionEnd = createOutputDestinationDialogItem(counter);
        quickList.insertBefore(outputDialogOptionZero, firstOption);
        quickList.append(outputDialogOptionEnd);
        counter+=2;
        break;
      }
    }
  }
  if (counter === 0) {
    document.getElementById("js-dbprintersList-hint").innerText = 
    `No matching printers for \"${inputValue}\"`;
    let outputDialogOption = createOutputDestinationDialogItem(counter);
    quickList.append(outputDialogOption);
    counter++;
  }
  if (debug) { debugUpdateListCountInfo(`${counter} (filtered)`); }
  return counter;
} // END filterAllList

function resetAllList () {
  const { rawList } = dataObject;
  const quickList = document.getElementById("js-dbprintersList");
  quickList.setAttribute("data-quicklist-mode", "false");
  let counter = 0;
  for (let i = 0; i < rawList.length; i++) {
    rawList[i].setAttribute("data-value-index", counter);
    // temp
    //const tempVal = rawList[i].getAttribute("data-value");
    //rawList[i].innerHTML = tempVal + " - " + counter;
    // end temp
    quickList.append(rawList[i]);
    counter++;
  }
  if (debug) { debugUpdateListCountInfo(`${counter} (all list)`); }
} // END resetAllList

function createOutputDestinationDialogItem (indexValue) {
  const i = (indexValue !== undefined) ? indexValue : "";
  let selectOption = document.createElement("a");
  selectOption.setAttribute("data-printers-outputdialog","");
  selectOption.setAttribute("data-value", "[open-output-dialog]");
  selectOption.setAttribute("data-value-index", i);
  selectOption.addEventListener("mouseover", attachListMouseOver);
  selectOption.addEventListener("click", attachOpenDialogMouseOnClick, false);
  selectOption.innerHTML = "Open Output Destination dialog...";
  return selectOption;
} // END createOutputDestinationDialogItem


function addOutputDestinationDialog () {
  // const { rawList } = dataObject;
  const quickList = document.getElementById("js-dbprintersList");
  // quickList.setAttribute("data-quicklist-mode", "false");
  // let counter = 0;
  // for (let i = 0; i < rawList.length; i++) {
  //   rawList[i].setAttribute("data-value-index", counter);
  //   // temp
  //   const tempVal = rawList[i].getAttribute("data-value");
  //   rawList[i].innerHTML = tempVal + " - " + counter;
  //   // end temp
  //   quickList.append(rawList[i]);
  //   counter++;
  // }
  // if (debug) { debugUpdateListCountInfo(`${counter} (all list)`); }
}

const popupCenter = ({url, target, w, h}) => {
  // Fixes dual-screen position                             Most browsers      Firefox
  const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX;
  const dualScreenTop =  window.screenTop  !==  undefined ? window.screenTop  : window.screenY;

  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  const systemZoom = 1; // width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft
  const top = (height - h) / 2 / systemZoom + dualScreenTop
  const newWindow = window.open(url, target, 
    `
    scrollbars=yes,
    menubar=1,
    resizable=0,
    width=${w / systemZoom}, 
    height=${h / systemZoom}, 
    top=${top}, 
    left=${left}
    `
  )
  if (window.focus) newWindow.focus();
}

function oldOpenOutputDestination (e) {
  window.open(
    "./outputDestinationDialog/outputDestination.html",
    "_blank",
    "menubar=1,resizable=0,width=691,height=679"
  );
} // END openOutputDestination

function openOutputDestination (e) {
  popupCenter({url: './outputDestinationDialog/outputDestination.html', target: "_blank", w: 691, h: 680});
} // END openOutputDestination





function attachListMouseOnClick () {
    const curIndex = this.getAttribute("data-value-index");
    const curItem = this.getAttribute("data-value");
    setInputSelection(curItem, curIndex);
    if (debug) { debugUpdateCurrentInfo(curIndex, curItem); }
} // END attachListMouseOnClick

function attachListMouseOver () {
  if (document.getElementsByClassName("highlight").length > 0) {
    [].forEach.call(document.getElementsByClassName("highlight"), function(el) {
      el.classList.remove("highlight");
    });
  }
  const curIndex = this.getAttribute("data-value-index");
  const curItem = this.getAttribute("data-value");
  this.classList.add("highlight");
  document.getElementById("js-dbprintersList").setAttribute("data-current-highlight-index", curIndex)
  if (debug) { debugUpdateCurrentInfo(curIndex, curItem); }
} // END attachListMouseOver

function attachOpenDialogMouseOnClick (event) {
  // const curIndex = this.getAttribute("data-value-index");
  // const curItem = this.getAttribute("data-value");
  event.preventDefault();
  event.stopPropagation();
  event.cancelBubble = true;

  openOutputDestination();
  
  // if (debug) { debugUpdateListCountInfo(`${curItem} (all list)`); }
  // if (debug) { debugUpdateCurrentInfo(curIndex, curItem); }
} // END attachOpenDialogMouseOnClick



function debugUpdateListCountInfo (droplistLength) {
  document.getElementById("field-droplength").innerText = droplistLength;
} // END debugUpdateListCountInfo


function debugUpdateCurrentInfo (curIdx, curHighlight) {
  document.getElementById("field-selected").innerText = `[${document.getElementById("cb_identifier").getAttribute("data-current-selection-index")}] ${document.getElementById("cb_identifier").getAttribute("data-current-selection")}`;
  document.getElementById("field-highlight").innerText = `[${curIdx}] ${curHighlight}`;
} // END debugUpdateCurrentInfo

// END UTILS






// ========================================================================
// === Attach Listeners to Overlay Mask ===
document.getElementById("js-overlayMask").addEventListener("click", function (evt) {
  resetDropList();
});

document.getElementById("js-overlayMask").addEventListener("mouseover", function (evt) {
  // Do Mouseover to remove highlight
  //removeHighlight();
  if (document.getElementById("cb_identifier").getAttribute("data-current-selection") !== undefined) {
    // assignSelectedHighlight();
  }
  const cbDroplist = document.getElementById("js-dbprintersList");
  const currentSelection = document.getElementById("cb_identifier").getAttribute("data-current-selection-index");
  const currentHighlight = cbDroplist.getAttribute("data-current-highlight-index");
  const quickListMode = cbDroplist.getAttribute("data-quicklist-mode");
  if (currentSelection !== currentHighlight || quickListMode === "false") {
    removeHighlight();
  }
});

document.getElementById("js-overlayMask").addEventListener("mousemove", function (evt) {
  //removeHighlight();
  if (document.getElementById("cb_identifier").getAttribute("data-current-selection") !== undefined) {
    // assignSelectedHighlight();
  }
  const cbDroplist = document.getElementById("js-dbprintersList");
  const currentSelection = document.getElementById("cb_identifier").getAttribute("data-current-selection-index");
  const currentHighlight = cbDroplist.getAttribute("data-current-highlight-index");
  const quickListMode = cbDroplist.getAttribute("data-quicklist-mode");
  if (currentSelection !== currentHighlight || quickListMode === "false") {
    removeHighlight();
  }
}); 
// End Overlay


// ========================================================================
// === GET MOCKED DATA === //
// ========================================================================
async function getData(data) {
  let dbprintersList = document.getElementById("js-dbprintersList");
  let isQuickList = dbprintersList.getAttribute('data-quicklist-mode') === "false" ? false : true;
  
  if (isQuickList === true) {
    // do something when it is just the quick list
  }

  let json = await fetch(data);
  let info = await json.text();
  let defaultDeviceStr;
  let quickCounter = 0;
  let rawCounter = 0;
  let comboboxData = [];
  comboboxData = JSON.parse(info);
  comboboxData.map((e) => {
    if (e.type === "printers") {
      e.payload.map((el) => {
        // --- QUICK LIST - defaults and recommended ---
        if (isDefaultDevice && el.hasOwnProperty("defaultedData")) {
          el.defaultedData.map((elem, i) => {
            // POPULATE the "QuickList" workflow and user default options in the combobox
            let selectOption = document.createElement("a");
            let optValue = filterOptionValue(elem);
            selectOption.setAttribute("data-printers-quicklist","");
            selectOption.setAttribute("data-value", optValue);
            selectOption.setAttribute("data-value-index", quickCounter);
            selectOption.addEventListener("click", attachListMouseOnClick);
            selectOption.addEventListener("mouseover", attachListMouseOver);        
            selectOption.innerHTML = elem;
            if (i === 0) {
              // set the value to have suggested device be auto-selected 
              document.getElementById("cb_identifier").value = optValue;
              document.getElementById("cb_identifier").setAttribute("data-current-selection", optValue);
              document.getElementById("cb_identifier").setAttribute("data-current-selection-index", i);
              //>>> change this >>> selectOption.className = "highlight";
              defaultDeviceStr = optValue;
            }
            if(!isNewUser) {
              dataObject.defaultList.push(selectOption);
              dbprintersList.append(selectOption);
            } else if (i === 0) {
              dataObject.defaultList.push(selectOption);
              dbprintersList.append(selectOption);
            }
            quickCounter++;
          });
        }
        // --- QUICK LIST - favorites & last used ---
        if (!isNewUser && el.hasOwnProperty("preConfiguredData")) {
          el.preConfiguredData.map((elem, i) => {
            let selectOption = document.createElement("a");
            selectOption.setAttribute("data-printers-quicklist","");
            selectOption.setAttribute("data-value", elem);
            selectOption.setAttribute("data-value-index", quickCounter);
            selectOption.addEventListener("click", attachListMouseOnClick);
            selectOption.addEventListener("mouseover", attachListMouseOver);
            selectOption.innerHTML = elem;
            dataObject.preConfiguredList.push(selectOption);
            dbprintersList.append(selectOption);
            quickCounter++;
          });
        }
        // --- ALL LIST ---
        if (el.hasOwnProperty("rawData")) {
          let dbprintersSelect = (!isNewDBPrint) ? document.getElementById("js-dbprintersSelect") : undefined;
          el.rawData.map((elem) => {
            let selectOption = isNewDBPrint ? document.createElement("a") : document.createElement("option");
            selectOption.setAttribute("data-printers-alllist","");
            selectOption.innerHTML = elem;
            if (isNewDBPrint) {
              // POPULATE the combobox
              selectOption.setAttribute("data-value", elem);
              selectOption.setAttribute("data-value-index", rawCounter);
              selectOption.addEventListener("click", attachListMouseOnClick);
              selectOption.addEventListener("mouseover", attachListMouseOver);          
              dataObject.rawList.push(selectOption);
            } else {
              // POPULATE the old school select
              selectOption.value = elem;
              if (isDefaultDevice && elem === defaultDeviceStr) {
                selectOption.selected = true;
                document.getElementById("js-selectEmptyOption").removeAttribute("selected");
              }
              dbprintersSelect.append(selectOption);
            }
            rawCounter++;
          });
        }
      });
    }
    //
    // INSERT THE OUTPUT DESTINATION DIALOG OPTION
    // document.getElementById(
    //   "js-dbprintersList-outputDestination"
    // ).style.display = (dialog === true) ? "block" : "none";
    
    setTimeout(function () {
      if (debug) { debugUpdateListCountInfo(`${quickCounter} (initial list)`); }
    }, 100);
  });
}
getData(`data-${clientSize}-site.json`);
// END Get Mocked Data




/* ========================================================================
 * ComboBox Object 
 * http://www.zoonman.com/projects/combobox/
 * ========================================================================
 * Copyright (c) 2011, Tkachev Philipp
 * All rights reserved.
 * BSD License
 * ========================================================================
 */
ComboBox = function (object_name, debug_mode) {
  // --- modified with Custom Code for the purpose of this prototype ---
  // This setTimeout is added to wait for the async function to load the data
  setTimeout(function () {
    // Edit element cache
    this.edit = document.getElementById(object_name);
    // Get list of things (divs) that follow the Input 
    var ddlist = document
      .getElementById(object_name)
      .parentNode.getElementsByTagName("div");
    // Dropdown List Container
    this.droplistcontainer = ddlist[0]; // same as document.getElementById("js-dbprintersList")
    // Actual List of Options
    this.dropdownlist = ddlist[0].getElementsByTagName("a");
    // Selected Item
    this.selecteditem = ( this.edit.getAttribute("data-current-selection").length < 1 ) ? undefined : this.edit.getAttribute("data-current-selection");
    // Selected Item Index
    this.selecteditemindex = ( this.edit.getAttribute("data-current-selection-index").length < 1) ? undefined : parseInt(this.edit.getAttribute("data-current-selection-index"));
    // Current Item
    this.currentitem = ( this.selecteditem !== undefined ) ? this.selecteditem : undefined;
    // Current Item Index
    this.currentitemindex = ( this.selecteditemindex !== undefined ) ? this.selecteditemindex : undefined;
    // Visible Items Count
    this.visiblecount = this.dropdownlist.length;
    // another arrow helper
    this.startindexover = true;
    // another arrow helper
    this.getfreshalllist = true;
    // Debug mode
    this.debug = debug_mode;
    // Closure Object
    const parobject = this;
    // Picker
    const pick = document.getElementById(object_name).parentNode.getElementsByTagName("span");

    debug = parobject.debug;
    
    function resetIndexes () {
      parobject.dropdownlist = document.getElementById("js-dbprintersList").getElementsByTagName("a");
      parobject.visiblecount = parobject.dropdownlist.length;
      parobject.currentitemindex = ( document.getElementById(object_name).getAttribute("data-current-selection-index").length < 1 ) ? undefined : document.getElementById(object_name).getAttribute("data-current-selection-index");
      parobject.currentitem = ( document.getElementById(object_name).getAttribute("data-current-selection").length < 1 ) ? undefined : document.getElementById(object_name).getAttribute("data-current-selection");
      parobject.startindexover = true;
      return true;
    }

    // CHEVRON -- SHOW + HIDE LISTBOX when picker icon is clicked
    pick[0].onclick = function () {
      let cbInput = document.getElementById("cb_identifier");
      setTimeout(function () {
        cbInput.getAttribute("data-list-is-open") === "false" ?
          toggleDroplist("open") && cbInput.focus() && cbInput.select() :
          toggleDroplist("close") && resetDropList() && resetIndexes();
        // parobject.edit.focus();
        // cbInput.focus() && cbInput.select()
      }, 10);
    };
    // FOCUS -- SHOW LISTBOX -- Show Items when input receives focus
    this.edit.onfocus = function () {
      setTimeout(function () {
        toggleDroplist("open");      
        this.edit.select();
      }, 1);
    }; 
    // BLUR -- HIDE LISTBOX -- Hide Items when input loses focus
    this.edit.onblur = function () {
      if (allowLoose) {
        setTimeout(function () {
          resetDropList();
          resetIndexes();
        }, 150);
      }
    }; // End onblur
    var allowLoose = true;
    // ==========================================================
    // DECIDE IF WE STILL NEED THIS PART
    // // IE fix
    // parobject.dropdownlist.onmousedown = function (event) {
    //   allowLoose = false;
    //   return false;
    // };
    // parobject.dropdownlist.onmouseup = function (event) {
    //   setTimeout(function () {
    //     allowLoose = true;
    //   }, 150);
    //   return false;
    // };
    // ==========================================================







    // ====================================================================  
    // REUSABLES
    // ====================================================================
    let dlc = parobject.droplistcontainer;
    let ddl = parobject.dropdownlist;
    let vc = parobject.visiblecount;
    let cii = parobject.currentitemindex;
    let ci = parobject.currentitem;
    let hii = parobject.droplistcontainer.hasAttribute("data-current-highlight-index") ? parobject.droplistcontainer.getAttribute("data-current-highlight-index") : undefined;

    // ====================================================================
    // ONKEYDOWN - NAVIGATION WITH KEYBOARD
    // ====================================================================
    this.edit.onkeydown = function (e) {
      e = e || window.event;
      hii = parobject.droplistcontainer.hasAttribute("data-current-highlight-index") ? parobject.droplistcontainer.getAttribute("data-current-highlight-index") : undefined;

      if (parobject.startindexover) {
        dlc = parobject.droplistcontainer = document.getElementById("js-dbprintersList");
        ddl = parobject.dropdownlist = dlc.getElementsByTagName("a");
        vc = parobject.visiblecount = ddl.length;
        cii = parobject.currentitemindex = ( document.getElementById(object_name).getAttribute("data-current-selection-index").length < 1 ) ? undefined : document.getElementById(object_name).getAttribute("data-current-selection-index");
        ci = parobject.currentitem = ( document.getElementById(object_name).getAttribute("data-current-selection").length < 1 ) ? undefined : document.getElementById(object_name).getAttribute("data-current-selection");
        hii = parobject.droplistcontainer.hasAttribute("data-current-highlight-index") ? parobject.droplistcontainer.getAttribute("data-current-highlight-index") : undefined;
        parobject.startindexover = false;
      }

      // PRESSING ARROW UP
      //if (e.keyCode === 38) {
      if (e.key === "ArrowUp") {
        if (vc > 0) {
          e.preventDefault();
          if (hii !== undefined && hii !== cii) {
            cii = hii;
          }
          if (cii === undefined && hii === undefined) {
            //#for (var i = 0; i < vc; i++) {
            //#  ddl[i].classList.remove("highlight"); // <==== this is a problem
            //#}
            removeHighlight();
            cii = 0;
            ci = ddl[cii].getAttribute("data-value");
            ddl[cii].classList.add("highlight");
            dlc.setAttribute("data-current-highlight-index", cii);
            hii = cii;
          }
          else if (cii > 0 && cii < vc) {
            //#for (var i = 0; i < vc; i++) {
            //#  ddl[i].classList.remove("highlight");
            //#}
            removeHighlight();
            cii--;
            ci = ddl[cii].getAttribute("data-value");
            ddl[cii].classList.add("highlight");
            dlc.setAttribute("data-current-highlight-index", cii);
            hii = cii;
          }
          if (debug) { debugUpdateCurrentInfo(cii, ci); }
          if (debug) { debugUpdateListCountInfo(`${vc} (${e.key})`); }
        }        
      }

      // PRESSING ARROW DOWN
      //if (e.keyCode === 40) {
      if (e.key === "ArrowDown") {
        if (vc > 0) {
          e.preventDefault();
          if (hii !== undefined && hii !== cii) {
            cii = hii;
          }
          if (cii === undefined && hii === undefined) {
            //#for (var i = 0; i < vc; i++) {
            //#  ddl[i].classList.remove("highlight"); // <==== this is a problem
            //#}
            removeHighlight();
            cii = 0;
            ci = ddl[cii].getAttribute("data-value");
            ddl[cii].classList.add("highlight");
            dlc.setAttribute("data-current-highlight-index", cii);
            hii = cii;
          }
          else if (cii >= 0 && cii < vc-1) {
            //#for (var i = 0; i < vc; i++) {
            //#  ddl[i].classList.remove("highlight");
            //#}
            removeHighlight();
            cii++;
            ci = ddl[cii].getAttribute("data-value");
            ddl[cii].classList.add("highlight");
            dlc.setAttribute("data-current-highlight-index", cii);
            hii = cii;
          }
          if (debug) { debugUpdateCurrentInfo(cii, ci); }
          if (debug) { debugUpdateListCountInfo(`${vc} (${e.key})`); }
        }
      }

      // PRESSING HOME KEY 
      //if (e.keyCode === 36) {
      if (e.key === "Home") {
        //#for (var i = 0; i < vc; i++) {
        //#  ddl[i].classList.remove("highlight");
        //#}
        removeHighlight();
        cii = 0;
        ci = ddl[cii].getAttribute("data-value");
        ddl[cii].classList.add("highlight");
        dlc.setAttribute("data-current-highlight-index", cii);
        hii = cii;
        if (debug) { debugUpdateCurrentInfo(cii, ci); }
        if (debug) { debugUpdateListCountInfo(`${vc} (${e.key})`); }
      }
      
      // PRESSING END KEY 
      //if (e.keyCode === 35) {
      if (e.key === "End") {
        //#for (var i = 0; i < vc; i++) {
        //#  ddl[i].classList.remove("highlight");
        //#}
        removeHighlight();
        cii = vc-1;
        ci = ddl[cii].getAttribute("data-value");
        ddl[cii].classList.add("highlight");
        dlc.setAttribute("data-current-highlight-index", cii);
        hii = cii;
        if (debug) { debugUpdateCurrentInfo(cii, ci); }
        if (debug) { debugUpdateListCountInfo(`${vc} (${e.key})`); }
      }
    }; // END ONKEYDOWN



    // ====================================================================
    // ONKEYUP - TYPING AND SEARCHING PART
    // ====================================================================
    this.edit.onkeyup = function (e) {
      e = e || window.event;
      hii = parobject.droplistcontainer.hasAttribute("data-current-highlight-index") ? parobject.droplistcontainer.getAttribute("data-current-highlight-index") : undefined;

      // PRESSING ENTER KEY
      //if (e.keyCode === 13) {
      if (e.key === "Enter") {
        if (cii > -1 && ci !== "[open-output-dialog]") {
          setInputSelection(ci, cii);
          dlc.removeAttribute("data-current-highlight-index");
          parobject.getfreshalllist = true;
        } else if (ci === "[open-output-dialog]") {
          // do the open dialog
          openOutputDestination();
          // if (debug) { debugUpdateListCountInfo(`${ci} (all list)`); }
        }
        e.cancelBubble = true;
        return false;   
        // else {
        //   toggleDroplist("close");
        //   resetDropList();
        //   resetIndexes();
        // }
      }

      // PRESSING ESCAPE KEY
      //else if (e.keyCode === 27) {
      else if (e.key === "Escape") {
        dlc.removeAttribute("data-current-highlight-index");
        e.currentTarget.blur();
        document.body.focus();
        resetDropList();
      }

      // PRESSING TAB KEY
      //else if (e.keyCode === 9) {
      else if (e.key === "Tab") {
        // Let existing onFocus Handler manage instead
        e.stopPropagation();
        e.preventDefault(); 
      }

      // PRESSING DELETE KEY
      //else if (e.keyCode === 8 || e.keyCode === 46) {
      else if (e.key === "Backspace" || e.key === "Delete") {
        
        // const cbDroplist = document.getElementById("js-dbprintersList");   
        let inputComboboxLength = e.currentTarget.value.length;
        if (inputComboboxLength >= 3) {

          // ===================================
          // switch hint message to searching
          // swap list
          // do search/filter
          // update hint t0 all results
          // ===================================

          removeList();         
          document.getElementById("js-dbprintersList-hint").innerText = `Printers that contain \"${e.currentTarget.value}\"`;
          vc = parobject.visiblecount = filterAllList(e.currentTarget.value);
          removeHighlight();
          cii = parobject.currentitemindex = undefined;
          ci = parobject.currentitem = undefined;        
          dlc.removeAttribute("data-current-highlight-index");
          hii = undefined;
          if (debug) { debugUpdateListCountInfo(`${vc} (filtered list)`); }

        }
        if (inputComboboxLength < 3) {
          if (dlc.getAttribute("data-quicklist-mode") === "false") {
            removeHighlight();
            cii = parobject.currentitemindex = undefined;
            ci = parobject.currentitem = undefined;
            dlc.removeAttribute("data-current-highlight-index");
            hii = undefined;
            removeList();
            //##setTimeout(function () {
              resetQuickList();
              if ( document.getElementById(object_name).getAttribute("data-current-selection") !== undefined ) {
                assignSelectedHighlight(); 
                cii = parobject.currentitemindex = document.getElementById(object_name).getAttribute("data-current-selection-index");
                ci = parobject.currentitem = document.getElementById(object_name).getAttribute("data-current-selection");
                hii = dlc.getAttribute("data-current-highlight-index");
              } else {
                removeHighlight();
                cii = parobject.currentitemindex = undefined;
                ci = parobject.currentitem = undefined;
                dlc.removeAttribute("data-current-highlight-index");
                hii = undefined;
              }
            //##}, 500);
          }
          dlc.setAttribute("data-quicklist-mode", "true");  
          resetListHint();
        }
        if (inputComboboxLength === 0) {
          e.currentTarget.setAttribute("data-current-selection-index", "");
          e.currentTarget.setAttribute("data-current-selection", "");
          dlc.setAttribute("data-quicklist-mode", "true");
          removeHighlight();
          removeSelectedHighlight();
          dlc.removeAttribute("data-current-highlight-index");
          cii = parobject.currentitemindex = undefined;
          ci = parobject.currentitem = undefined;        
          resetListHint();       
          resetQuickList();
        }
      }

      // PRESSING CLEAR KEY
      //else if (e.keyCode === 12 {
      else if (e.key === "Clear") {
        e.currentTarget.setAttribute("data-current-selection-index", "");
        e.currentTarget.setAttribute("data-current-selection", "");
        document.getElementById("js-dbprintersList").setAttribute("data-quicklist-mode", "true");
        removeHighlight();
        removeSelectedHighlight();
        dlc.removeAttribute("data-current-highlight-index");
        cii = parobject.currentitemindex = undefined;
        ci = parobject.currentitem = undefined;
        resetQuickList();
      }

      else if (e.key === "Shift" || e.key === "ShiftLeft" || e.key === "ShiftRight") {
        //e.cancelBubble = true;
        if (debug) { document.getElementById("field-delay").innerText = e.key; }
      }

      // PRESSING ALL OTHER KEYS
      //else if (e.keyCode !== 38 && e.keyCode !== 40 && e.keyCode !== 36 && e.keyCode !== 35) {
      else if (e.key !== "ArrowUp" && e.key !== "ArrowDown" && e.key !== "Home" && e.key !== "End" && e.key !== "Shift" && e.key !== "ShiftLeft" && e.key !== "ShiftRight" ) {




        let inputBoxText = e.currentTarget.value;        
        if (inputBoxText.length >= 3) {
          // ddl.setAttribute("data-quicklist-mode", "false");

          // ===============================
          // switch hint message to searching
          // swap list
          // do search/filter
          // update hint t0 all results
          // ===============================

          // resetListHint();
          removeList();

          // Move this into the sequence with filtering
          document.getElementById("js-dbprintersList-hint").innerText = 
            "Searching printers...";

          if (parobject.getfreshalllist || document.getElementById("js-dbprintersList").getAttribute("data-quicklist-mode") === "true") {
            // First time getting 3 letters
            const loadDelay = (clientSize === "large") ? 1200 : 600;
            //removeList();
            dlc.removeAttribute("data-current-highlight-index");
            cii = parobject.currentitemindex = undefined;
            ci = parobject.currentitem = undefined;
            //##setTimeout(function () {
              //**** resetAllList();
              parobject.getfreshalllist = false;
              //##setTimeout(function () {
                document.getElementById("js-dbprintersList-hint").innerText = 
                  `Printers that contain \"${inputBoxText}\"`;

                // ============================================================
                removeList();
                vc = parobject.visiblecount = filterAllList(parobject.edit.value);

                removeHighlight();
                cii = parobject.currentitemindex = undefined;
                ci = parobject.currentitem = undefined;
                hii = undefined;
                dlc.removeAttribute("data-current-highlight-index");
    
                if (debug) { debugUpdateListCountInfo(`${vc} (filtered list)`); }
                if (debug) { document.getElementById("field-delay").innerText = "(Filter: first 3 letters)"; }
                // ============================================================


              //##}, 25);
            //##}, loadDelay);
          } else {
            // Second time and/or More than 3 letters

            //##setTimeout(function () {
              document.getElementById("js-dbprintersList-hint").innerText = 
                `Printers that contain \"${inputBoxText}\"`;
            //##}, 50);

            // ============================================================
            removeList();
            vc = parobject.visiblecount = filterAllList(parobject.edit.value);

            removeHighlight();
            cii = parobject.currentitemindex = undefined;
            ci = parobject.currentitem = undefined;
            hii = undefined;
            dlc.removeAttribute("data-current-highlight-index");

            if (debug) { debugUpdateListCountInfo(`${vc} (filtered list)`); }
            if (debug) { document.getElementById("field-delay").innerText = "(Filter: more than 3 letters)"; }
            // ============================================================

          }
        }
      }
    }; // END ONKEYUP
    
  }, 100);
};
