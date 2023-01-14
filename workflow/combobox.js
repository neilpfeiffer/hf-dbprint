/* Custom code */

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
  loadDelay: parseInt(urlParams.get("delay")),
};
const { clientSize, isDefaultDevice, isNewUser, isNewDBPrint, title, dialog, loadDelay } = configObject;
let dataObject = {
  defaultList: [],
  preConfiguredList: [],
  rawList: []
};

// ======================================================
// new utils
function assignSelectedHighlight() {
  let currentSelection = document.getElementById("cb_identifier").getAttribute("data-current-selection");
  let optionsList = document.getElementById("js-dbprintersList").getElementsByTagName("a");
  for (let i = 0; i < optionsList.length; i++) {
    if (optionsList[i].getAttribute("data-value") === currentSelection) {
      optionsList[i].classList.add("highlight");
      document.getElementById("cb_identifier").setAttribute("data-current-selected-index", i);
    }
  }
}

function removeHighlight() {
  let optionsList = document.getElementById("js-dbprintersList").getElementsByTagName("a");
  for (let i = 0; i < optionsList.length; i++) {
    optionsList[i].classList.remove("highlight");
  }
}


function toggleDroplist(state) {
  if (state === "open") {
    assignSelectedHighlight();
    document.getElementById("js-dbprintersList").style.display = "block";
    document.getElementById("cb_identifier").setAttribute("data-list-is-open", "true");
    toggleOverlay("on");
  } 
  if (state === "close") {
    toggleOverlay("off");
    document.getElementById("cb_identifier").setAttribute("data-list-is-open", "false");
    document.getElementById("js-dbprintersList").style.display = "none";
    removeHighlight();
  }
  return true;
}

function toggleOverlay(state) {
  let overlay = document.getElementById("js-overlayMask");
  if (state === "on") {
    overlay.classList.add("overlay-mask");
  }
  if (state === "off") {
    overlay.classList.remove("overlay-mask");
  }
}

function filterOptionValue(optionString) {
  let stringPv = optionString.split(" — ");
  if (stringPv.length > 1) {
    return optionString.split(" — ").shift();
  } 
  return optionString;
}

function removeList(list) {
  let listType = (list === "quicklist") ? "[data-printers-quicklist]" : "[data-printers-alllist]";
  let itemsList = document.querySelectorAll(listType);
  for (let i = 0; i < itemsList.length; i++) {
    itemsList[i].remove();
  }
}

function resetListHint() {
  document.getElementById("js-dbprintersList-hint").innerText = "Enter 3 characters to search all...";
}

function resetQuickList() {
  const { defaultList, preConfiguredList } = dataObject 
  const quickList = document.getElementById("js-dbprintersList");
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
}

function resetDropList() {
  // parobject.dropdownlist.style.display = "none";
  let currentSelection = document.getElementById("cb_identifier").getAttribute("data-current-selection");
  document.getElementById("cb_identifier").value = currentSelection;
  toggleDroplist("close");
  // hideAllList(parobject);
  // showQuicklist(parobject);
  resetListHint();
  resetQuickList();
  document.getElementById("js-dbprintersList").setAttribute("data-quicklist-mode", "true");
  // if (currentSelection.length > 0) { 
    // document.getElementById("cb_identifier").value = currentSelection;
  // }
}

function setInputSelection (selectionValue, indexValue) {
  document.getElementById("cb_identifier").setAttribute("data-current-selection", selectionValue);
  document.getElementById("cb_identifier").setAttribute("data-current-selection-index", indexValue);
  // resetDropList();
  document.getElementById("cb_identifier").value = selectionValue;
  toggleDroplist("close");
  resetListHint();
  resetQuickList();
  document.getElementById("js-dbprintersList").setAttribute("data-quicklist-mode", "true");
  //
  document.getElementById("cb_identifier").blur();
  document.body.focus();
  // resetDropList();
}

function updateTestingInfo(dlLength, curIdx, curHighlight) {
  document.getElementById("feild-droplength").innerText = dlLength;
  document.getElementById("feild-selected").innerText = `[${document.getElementById("cb_identifier").getAttribute("data-current-selection-index")}] ${document.getElementById("cb_identifier").getAttribute("data-current-selection")}`;
  document.getElementById("feild-highlight").innerText = `[${curIdx}] ${curHighlight}`;
}







// ======================================================
// old utils 
function hideItemsByAttr(parobject, parattribute) {
  let itemsList = parobject.dropdownlist.querySelectorAll(`[${parattribute}]`);
  let itemsListLength = itemsList.length;
  for (let i = 0; i < itemsListLength; i++) {
    // itemsList[i].style.display = "block";
    itemsList[i].style.background = "plum";
  }
}


function hideQuicklist(parobject) {
  let itemsList = parobject.dropdownlist.querySelectorAll("[data-printers-quicklist]");
  let itemsListLength = itemsList.length;
  for (let i = 0; i < itemsListLength; i++) {
    itemsList[i].style.display = "none";
    // itemsList[i].style.background = "plum";
  }
}

function hideAllList(parobject) {
  let itemsList = parobject.dropdownlist.querySelectorAll("[data-printers-alllist]");
  let itemsListLength = itemsList.length;
  for (let i = 0; i < itemsListLength; i++) {
    itemsList[i].style.display = "none";
    itemsList[i].style.background = "greenyellow";
  }
}

function showQuicklist(parobject) {
  let itemsList = parobject.dropdownlist.querySelectorAll("[data-printers-quicklist]");
  let itemsListLength = itemsList.length;
  for (let i = 0; i < itemsListLength; i++) {
    itemsList[i].style.display = "block";
  }
}

function showItems(parobject) {
  let itemsList = parobject.dropdownlist.getElementsByTagName("a");
  let itemsListLength = itemsList.length;
  for (let i = 0; i < itemsListLength; i++) {
    itemsList[i].style.display = "block";
    itemsList[i].style.background = "dodgerblue";
  }
}

function hideItems2(parobject) {
  let itemsList = parobject.dropdownlist.getElementsByTagName("a");
  let itemsListLength = itemsList.length;
  for (let i = 0; i < itemsListLength; i++) {
    itemsList[i].style.display = "block";
    itemsList[i].style.background = "greenyellow";
  }
}

function hideItems(parobject) {
  let itemsList = parobject.dropdownlist.getElementsByTagName("a");
  let itemsListLength = itemsList.length;
  for (let i = 0; i < itemsListLength; i++) {
    itemsList[i].style.display = "block";
    itemsList[i].style.background = "tomato";
  }
}

// === GET MOCKED DATA === //
async function getData(data) {
  let dbprintersList = document.getElementById("js-dbprintersList");
  let isQuickList = dbprintersList.getAttribute('data-quicklist-mode') === "false" ? false : true;
  if (isQuickList === true) {
    // dbprintersListRawData.style.display = "none";
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
        if (isDefaultDevice && el.hasOwnProperty("defaultedData")) {
          el.defaultedData.map((elem, i) => {
            // POPULATE the "QuickList" workflow and user default options in the combobox
            let selectOption = document.createElement("a");
            let optValue = filterOptionValue(elem);
            selectOption.setAttribute("data-printers-quicklist","");
            selectOption.setAttribute("data-value", optValue);
            selectOption.setAttribute("data-value-index", quickCounter);
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

        if (!isNewUser && el.hasOwnProperty("preConfiguredData")) {
          el.preConfiguredData.map((elem, i) => {
            // POPULATE the "QuickList" favorites and recently used options in the combobox
            let selectOption = document.createElement("a");
            selectOption.setAttribute("data-printers-quicklist","");
            selectOption.setAttribute("data-value", elem);
            selectOption.setAttribute("data-value-index", quickCounter);
            selectOption.innerHTML = elem;
            dataObject.preConfiguredList.push(selectOption);
            dbprintersList.append(selectOption);
            quickCounter++;
          });
        }

        if (el.hasOwnProperty("rawData")) {
          let dbprintersSelect = (!isNewDBPrint) ? document.getElementById("js-dbprintersSelect") : undefined;
          el.rawData.map((elem) => {
            // POPULATE all the "All List" of options in the combobox or select
            let selectOption = isNewDBPrint ? document.createElement("a") : document.createElement("option");
            selectOption.setAttribute("data-printers-alllist","");
            selectOption.innerHTML = elem;
            if (isNewDBPrint) {
              selectOption.setAttribute("data-value", elem);
              selectOption.setAttribute("data-value-index", rawCounter);
              dataObject.rawList.push(selectOption);
              //>> selectOption.style.display = "none";
              //>> dbprintersList.append(selectOption);
            } else {
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

    // POPULATE all Raw Options in the combobox
    if (e.type === "printers") {
      e.payload.map((el) => {
        // extra step
      });
    }

    // document.getElementById(
    //   "js-dbprintersList-outputDestination"
    // ).style.display = (dialog === true) ? "block" : "none";
  });
}
// === GO GET THE OPTIONS DATA === //
getData(`data-${clientSize}-site.json`);
// End of Custom code


document.getElementById("js-overlayMask").addEventListener("click", function (evt) {
  resetDropList();
});


/* 
	ComboBox Object 
	http://www.zoonman.com/projects/combobox/

	Copyright (c) 2011, Tkachev Philipp
	All rights reserved.
	BSD License
*/
ComboBox = function (object_name) {
  // Custom code - this setTimeout is added to wait for the async function to load the data
  setTimeout(function () {
    // Edit element cache
    this.edit = document.getElementById(object_name);
    // Items Container
    var ddlist = document
      .getElementById(object_name)
      .parentNode.getElementsByTagName("div");
    this.dropdownlist = ddlist[0].getElementsByTagName("a");
    //this.dropdownlist = document.getElementById("js-dbprintersList").getElementsByTagName("a");
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
    // Closure Object
    const parobject = this;
    // Picker
    const pick = document.getElementById(object_name).parentNode.getElementsByTagName("span");

    
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
      cbInput.getAttribute("data-list-is-open") === "false" ?
        toggleDroplist("open") && cbInput.focus() && cbInput.select() :
        toggleDroplist("close") && resetDropList() && resetIndexes();
      // console.log(1);
      // parobject.edit.focus();
      // cbInput.focus() && cbInput.select()
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


    // ====================================================================  
    // REUSABLES
    // ====================================================================  
    let ddl = parobject.dropdownlist;
    let vc = parobject.visiblecount;
    let cii = parobject.currentitemindex;
    let ci = parobject.currentitem;


    // ====================================================================
    // MOUSE NAVIGATION 
    // ====================================================================
    for (var i = 0; i < ddl.length; i++) {
      // Binding Click Event
      ddl[i].onclick = function (e) {
        cii = parobject.currentitemindex = e.currentTarget.getAttribute("data-value-index");
        ci = parobject.currentitem = e.currentTarget.getAttribute("data-value");
        setInputSelection(ci, cii);
        updateTestingInfo(vc, cii, ci);
      }; // End onclick

      // Binding OnMouseOver Event
      ddl[i].onmouseover = function (e) {
        if (document.getElementsByClassName("highlight").length > 0) {
          [].forEach.call(document.getElementsByClassName("highlight"), function(el) {
            el.classList.remove("highlight");
          });
        }
        cii = parobject.currentitemindex = e.currentTarget.getAttribute("data-value-index");
        ci = parobject.currentitem = e.currentTarget.getAttribute("data-value");
        e.currentTarget.classList.add("highlight");
        updateTestingInfo(vc, cii, ci);
      }; // End onmouseover
    }



    // ====================================================================
    // ONKEYDOWN - NAVIGATION WITH KEYBOARD
    // ====================================================================
    this.edit.onkeydown = function (e) {
      e = e || window.event;

      if (parobject.startindexover) {
        ddl = parobject.dropdownlist = document.getElementById("js-dbprintersList").getElementsByTagName("a");
        vc = parobject.visiblecount = ddl.length;
        cii = parobject.currentitemindex = ( document.getElementById(object_name).getAttribute("data-current-selection-index").length < 1 ) ? undefined : document.getElementById(object_name).getAttribute("data-current-selection-index");
        ci = parobject.currentitem = ( document.getElementById(object_name).getAttribute("data-current-selection").length < 1 ) ? undefined : document.getElementById(object_name).getAttribute("data-current-selection");
        parobject.startindexover = false;
      }

      // PRESSING ARROW UP // or ARROW LEFT KEY e.keyCode === 37
      if (e.keyCode === 38) {
        if (vc > 0) {
          e.preventDefault();
          if (cii === undefined) {
            for (var i = 0; i < vc; i++) {
              ddl[i].classList.remove("highlight");
            }
            cii = 0;
            ci = ddl[cii].getAttribute("data-value");
            ddl[cii].classList.add("highlight");
          }
          else if (cii > 0 && cii < vc) {
            for (var i = 0; i < vc; i++) {
              ddl[i].classList.remove("highlight");
            }  
            cii--;
            ci = ddl[cii].getAttribute("data-value");
            ddl[cii].classList.add("highlight");
          }
          updateTestingInfo(vc, cii, ci);
        }        
      }

      // PRESSING ARROW DOWN // or ARROW RIGHT KEY e.keyCode ===  39
      if (e.keyCode === 40) {
        if (vc > 0) {
          e.preventDefault();
          if (cii === undefined) {
            for (var i = 0; i < vc; i++) {
              ddl[i].classList.remove("highlight");
            }  
            cii = 0;
            ci = ddl[cii].getAttribute("data-value");
            ddl[cii].classList.add("highlight");
          }
          else if (cii >= 0 && cii < vc-1) {
            for (var i = 0; i < vc; i++) {
              ddl[i].classList.remove("highlight");
            }  
            cii++;
            ci = ddl[cii].getAttribute("data-value");
            ddl[cii].classList.add("highlight");
          }
          updateTestingInfo(vc, cii, ci);
        }
      }

      // PRESSING HOME KEY 
      if (e.keyCode === 36) {
        for (var i = 0; i < vc; i++) {
          ddl[i].classList.remove("highlight");
        }
        cii = 0;
        ci = ddl[cii].getAttribute("data-value");
        ddl[cii].classList.add("highlight");
        updateTestingInfo(e.keyCode, cii, ci);
      }
      
      // PRESSING END KEY 
      if (e.keyCode === 35) {
        for (var i = 0; i < vc; i++) {
          ddl[i].classList.remove("highlight");
        }
        cii = vc-1;
        ci = ddl[cii].getAttribute("data-value");
        ddl[cii].classList.add("highlight");
        updateTestingInfo(e.keyCode, cii, ci);

      }
    }; // END ONKEYDOWN



    // ====================================================================
    // ONKEYUP - TYPING AND SEARCHING PART
    // ====================================================================
    this.edit.onkeyup = function (e) {    

      // Custom code
      let inputBox = e.currentTarget.value;
      if (inputBox.length > 2 && document.getElementById("js-dbprintersList").getAttribute("data-quicklist-mode") === true) {
        document.getElementById("js-dbprintersList").setAttribute("data-quicklist-mode", "false");
        document.getElementById("js-dbprintersList-hint").innerText =
          "Searching all...";
        removeList("quicklist");
      } else {
        document.getElementById("js-dbprintersList-hint").innerText =
          "Enter 3 characters to search all...";
      }
      // End of Custom code
      // Labels "Searching all" and "enter 3 characters to search all..."

      e = e || window.event;

      // PRESSING ENTER KEY
      if (e.keyCode === 13) {
        if (cii > -1) {
          setInputSelection(ci, cii);
        } 
        // else {
        //   toggleDroplist("close");
        //   resetDropList();
        //   resetIndexes();
        // }
      }





      
      /* ================================================================ 

      // PRESSING ENTER KEY
      if (e.keyCode === 13) {

        if (parobject.visiblecount != 0) {
          var upv = parobject.currentitem.innerHTML;
          upv = upv.replace(/\<b\>/gi, "");
          upv = upv.replace(/\<\/b\>/gi, "");
          parobject.edit.value = upv;
        }
        parobject.dropdownlist.style.display = "none";
        e.cancelBubble = true;
        return false;
      } else {
        hideQuicklist(parobject);
        parobject.dropdownlist.style.display = "block";
        parobject.visiblecount = 0;
        if (parobject.edit.value === "") {
          for (var i = 0; i < parobject.listitems.length; i++) {
            parobject.listitems[i].style.display = "block";
            parobject.visiblecount++;
            var pv = parobject.listitems[i].innerHTML;
            pv = pv.replace(/\<b\>/gi, "");
            parobject.listitems[i].innerHTML = pv.replace(/\<\/b\>/gi, "");
          }
        } else {
          var re = new RegExp("(" + parobject.edit.value + ")", "i");
          setTimeout(() => {
            for (var i = 0; i < parobject.listitems.length; i++) {
              
              // Custom adjustments.
              // When typing, the results make bold all the text in the list item, including " - suggested" for example.
              // Fix: If the string contains "- suggested", "- default", etc; only replace the characters of the first array item.
              
              // original script: var pv = parobject.listitems[i].innerText;

              var stringPv = parobject.listitems[i].innerText.split(" - ");
              var pv = "";
              var specialSetup = "";
              if (stringPv.length > 1) {
                pv = parobject.listitems[i].innerText.split(" - ").shift();
                specialSetup =
                  " - " + parobject.listitems[i].innerText.split(" - ").pop();
              } else {
                pv = parobject.listitems[i].innerText;
              }

              pv = pv.replace(/\<b\>/gi, "");
              pv = pv.replace(/\<\/b\>/gi, "");
              if (re.test(pv) && parobject.hasAttribute("data-printers-alllist")) {

                // this is the non-red
                parobject.listitems[i].style.display = "block";
                parobject.visiblecount++;
                parobject.listitems[i].innerHTML =
                  pv.replace(re, "<b>$1</b>") + specialSetup;

                // Custom code
                // No matching items label

                // WHY DOES THIS MATTER ???????????????
                if (isNewUser === true) {
                  parobject.listitems[i].style.display = "block";
                  document.getElementById("js-dbprintersList-hint").innerText =
                    "All that contains" + ` "${inputBox}"`;
                }
                // Testing here -- remove when done 
                else {
                   parobject.listitems[i].style.display = "block";
                   document.getElementById("js-dbprintersList-hint").innerText =
                     "******This is that other one" + ` "${inputBox}"`;
                }
                // End of Custom code

              } else {
                // THIS IS THE FILTER REMOVAL WHEN SEARCHING
                // parobject.listitems[i].style.background = "red";
                parobject.listitems[i].style.display = "none";
              }
            }

            // Custom code
            // No matching items label
            let itemsList = document
              .getElementById("js-dbprintersList")
              .getElementsByTagName("a");
            let itemsListLength = itemsList.length;
            let counter = 0;
            for (let i = 0; i < itemsListLength; i++) {
              if (itemsList[i].style.display === "none") counter++;
            }
            if (counter === itemsListLength) {
              document.getElementById("js-dbprintersList-hint").innerText =
                "No matching items for" + ` "${inputBox}"`;
            }
            // End of Custom code

          }, loadDelay);
        }
      }

      ================================================================ */
      // let inputComboboxLength = document.getElementById("cb_identifier").value.length;
      // For the new user, when he/she deletes the entry, the items should be hidden

      // PRESSING ESCAPE KEY
      if (e.keyCode === 27) {
        document.getElementById("cb_identifier").blur();
        document.body.focus();
        resetDropList();
      }      

      // PRESSING TAB KEY
      if (e.keyCode === 9) {
        // Let existing onFocus Handler manage instead
        e.stopPropagation();
        e.preventDefault(); 
      }      

      // PRESSING DELETE KEY
      if (e.keyCode === 8) {
        let inputComboboxLength = document.getElementById("cb_identifier").value.length;
        document.getElementById("js-dbprintersList-hint").innerText = inputComboboxLength;
        if (inputComboboxLength < 3) {
          resetListHint();        
        }
        if (inputComboboxLength === 0) {
          document.getElementById("cb_identifier").setAttribute("data-current-selection", "");
          document.getElementById("js-dbprintersList").setAttribute("data-quicklist-mode", "true");
          removeHighlight();
          resetQuickList();
          // hideAllList(parobject);
        }
      }

    }; // END ONKEYUP
    

  }, 100); // End custom code setTimeOut
};
