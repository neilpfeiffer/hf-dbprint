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
  var isQuickList = dbprintersList.getAttribute('data-quicklist-mode') === "false" ? false : true;
  if (isQuickList === true) {
    // dbprintersListRawData.style.display = "none";
  }
  let json = await fetch(data);
  let info = await json.text();
  let comboboxData = [];
  comboboxData = JSON.parse(info);
  comboboxData.map((e) => {
    if (e.type === "printers") {
      e.payload.map((el) => {
        if (isDefaultDevice && el.hasOwnProperty("defaultedData")) {
          el.defaultedData.map((elem, i) => {
            // POPULATE the "QuickList" workflow and user default options in the combobox
            let selectOption = document.createElement("a");
            selectOption.setAttribute("data-printers-quicklist","");
            selectOption.innerHTML = elem;
            if (i ===0) {
              var stringPv = elem.split(" — ");
              var pv = "";
              var specialSetup = "";
              if (stringPv.length > 1) {
                pv = elem.split(" — ").shift();
                specialSetup = " — " + elem.split(" — ").pop();
              } else {
                pv = elem;
              }
              // set the value to default for first item
              document.getElementById("cb_identifier").value = pv;
              selectOption.className = "highlight";
            }

            if(!isNewUser) {
              dbprintersList.append(selectOption);
            } else if (i === 0) {
              dbprintersList.append(selectOption);
            }
          });
        }

        if (!isNewUser && el.hasOwnProperty("preConfiguredData")) {
          el.preConfiguredData.map((elem, i) => {
            // POPULATE the "QuickList" favorites and recently used options in the combobox
            let selectOption = document.createElement("a");
            selectOption.setAttribute("data-printers-quicklist","");
            selectOption.innerHTML = elem;
            dbprintersList.append(selectOption);

            // document.getElementById(
            //   "js-dbprintersList-specialCase"
            // ).style.display = (isNewUser === false) ? "block" : "none";
          });
        }

        if (el.hasOwnProperty("rawData")) {
          el.rawData.map((elem) => {
            // POPULATE all the "All List" of options in the combobox
            let selectOption = document.createElement("a");
            selectOption.setAttribute("data-printers-alllist","");
            selectOption.innerHTML = elem;
            selectOption.style.display = "none";
            dbprintersList.append(selectOption);
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
    var ddl = document
      .getElementById(object_name)
      .parentNode.getElementsByTagName("DIV");
    this.dropdownlist = ddl[0];
    // Current Item
    this.currentitem = null;
    // Current Item Index
    this.currentitemindex = null;
    // Visible Items Count
    this.visiblecount = 0;
    // Closure Object
    const parobject = this;
    // Picker
    const pick = document
      .getElementById(object_name)
      .parentNode.getElementsByTagName("SPAN");
    pick[0].onclick = function () {
      console.log(1);
      parobject.edit.focus();
    };


    
    // FOCUS - SHOW LISTBOX -- Show Items when edit get focus
    this.edit.onfocus = function () {
      parobject.dropdownlist.style.display = "block";
      
      // Custom code
      if (isNewUser === false) {
        // ??? CHECK WHAT THIS DOES ???
        // hideItems(parobject);

      }
      // End of Custom code

    }; // End onfocus
    

    
    // BLUR - HIDE LISTBOX -- Hide Items when edit lost focus
    this.edit.onblur = function () {
      if (allowLoose) {
        setTimeout(function () {
          parobject.dropdownlist.style.display = "none";
          hideAllList(parobject);
          showQuicklist(parobject);
          document.getElementById("js-dbprintersList").setAttribute("data-quicklist-mode", "true");
        }, 150);
      }
    }; // End onblur
    var allowLoose = true;    
    // IE fix
    parobject.dropdownlist.onmousedown = function (event) {
      allowLoose = false;
      return false;
    };
    parobject.dropdownlist.onmouseup = function (event) {
      setTimeout(function () {
        allowLoose = true;
      }, 150);
      return false;
    };
    


    
    // Get Items
    this.listitems = this.dropdownlist.getElementsByTagName("A");
    for (var i = 0; i < this.listitems.length; i++) {
      var t = i;
      // Binding Click Event

      // In this onclick function we can customize any behavior of the elements, when they are selected
      this.listitems[i].onclick = function () {
        
      
        // Custom Code
        // When clicking an option that contains " - suggested" for example, it was injecting the span tag as text.
        // So, I'm removing them and add them again.
        // var upv = this.innerHTML;  
        this.classList.remove("highlight");
        var stringUpv = this.innerText.split(" — ");
        var upv = "";
        var specialSetup = "";
        if (stringUpv.length > 1) {
          upv = this.innerText.split(" — ").shift();
          specialSetup = " — " + this.innerText.split(" — ").pop();
        } else {
          upv = this.innerText;
        }
        // End custom code


        if (this.id === "js-listItem") {
          // to avoid removing and reinserting suggested and default elements
          upv = upv.replace(/\<b\>/gi, "");
          upv = upv.replace(/\<\/b\>/gi, "");
          parobject.edit.value = upv + specialSetup;
          // parobject.dropdownlist.style.display = "none";

          var cloneElem = this.cloneNode(true);
          var referenceNode = this.parentNode.children;
          this.parentNode.insertBefore(cloneElem, referenceNode[5]);
          this.remove();
          return false;
        }
      }; // End onclick

      // Binding OnMouseOver Event
      this.listitems[i].onmouseover = function (e) {
        for (var i = 0; i < parobject.listitems.length; i++) {
          if (this === parobject.listitems[i]) {
            if (parobject.currentitem) {
              parobject.currentitem.className =
                parobject.currentitem.className.replace(/highlight/g, "");
            }
            parobject.currentitem = parobject.listitems[i];
            parobject.currentitemindex = i;
            parobject.currentitem.className += "highlight";
          }
        }
      }; // End onmouseover
    }

    // Binding OnKeyDown Event
    this.edit.onkeydown = function (e) {
      e = e || window.event;
      // Move Selection Up
      if (e.keyCode === 38) {
        // up
        var cn = 0;
        if (parobject.visiblecount > 0) {
          if (parobject.visiblecount === 1) {
            parobject.currentitemindex = parobject.listitems.length - 1;
          }
          do {
            parobject.currentitemindex--;
            cn++;
          } while (
            parobject.currentitemindex > 0 &&
            parobject.listitems[parobject.currentitemindex].style.display ===
              "none"
          );
          if (parobject.currentitemindex < 0) {
            parobject.currentitemindex = parobject.listitems.length - 1;
          }

          if (parobject.currentitem) {
            parobject.currentitem.className =
              parobject.currentitem.className.replace(/highlight/g, "");
          }
          parobject.currentitem =
            parobject.listitems[parobject.currentitemindex];
          parobject.currentitem.className += " highlight";
          parobject.currentitem.scrollIntoView(false);
        }
        e.cancelBubble = true;
        if (navigator.appName !== "Microsoft Internet Explorer") {
          e.preventDefault();
          e.stopPropagation();
        }
        return false;
      }

      // Move Selection Down
      else if (e.keyCode === 40) {
        // down
        var ic = 0;
        if (parobject.visiblecount > 0) {
          do {
            parobject.currentitemindex++;
          } while (
            parobject.currentitemindex < parobject.listitems.length &&
            parobject.listitems[parobject.currentitemindex].style.display ===
              "none"
          );
          if (parobject.currentitemindex >= parobject.listitems.length) {
            parobject.currentitemindex = 0;
          }

          if (parobject.currentitem) {
            parobject.currentitem.className =
              parobject.currentitem.className.replace(/highlight/g, "");
          }
          parobject.currentitem =
            parobject.listitems[parobject.currentitemindex];
          parobject.currentitem.className += " highlight";
          parobject.currentitem.scrollIntoView(false);
        }
        e.cancelBubble = true;
        if (navigator.appName != "Microsoft Internet Explorer") {
          e.preventDefault();
          e.stopPropagation();
        }
        return false;
      }
    }; // End onkeydown

    
    // THIS IS THE TYPING AND SEARCHING PART
    this.edit.onkeyup = function (e) {    
      document.getElementById("js-dbprintersList").setAttribute("data-quicklist-mode", "false");

      // Custom code
      let inputBox = e.currentTarget.value;
      if (inputBox.length > 0) {
        document.getElementById("js-dbprintersList-hint").innerText =
          "Searching all...";
      } else {
        document.getElementById("js-dbprintersList-hint").innerText =
          "Enter 3 characters to search all...";
      }
      // End of Custom code
      // Labels "Searching all" and "enter 3 characters to search all..."

      e = e || window.event;
      if (e.keyCode === 13) {
        // enter
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

      // Custom Code

      // For the new user, when he/she deletes the entry, the items should be hidden
      let inputComboboxLength = document.getElementById("cb_identifier").value.length;
      if (
        e.keyCode === 8 &&
        inputComboboxLength === 0
      ) {
        hideAllList(parobject);
      }
              
      // if (
      //   e.keyCode === 8 &&
      //   isNewUser === true &&
      //   inputComboboxLength === 0
      // ) {
      //   // ??? CHECK WHAT THIS DOES ???
      //   hideItems2(parobject);
      // }
    }; // End onkeyup
    

  }, 100); // End custom code setTimeOut
};


/*
if (isNewUser === true) {
  // NEW USER
  // In case different configurations are added for printers, faxes, etc.

} else {
  // SEASONED USER
  // In case different configurations are added for printers, faxes, etc.
  // dbprintersListQuickData.style.display = "block";
}
*/