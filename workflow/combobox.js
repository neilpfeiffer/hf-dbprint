/* Custom code */

// Configure combobox according to query string
// Parse query string and convert it into an object
let urlParams = new URLSearchParams(window.location.search);
let configObject = {
  isNewUser: urlParams.get("newUser"), /// new user or seasoned user TRUE AND FALSE BOOLEANS
  title: urlParams.get("scenarioTitle"),
  dialog: urlParams.get("outputDialog"),
  loadDelay: parseInt(urlParams.get("delay")),
};

const { isNewUser, title, dialog, loadDelay } = configObject;

function hideItems(parobject) {
  let itemsList = parobject.dropdownlist.getElementsByTagName("a");
  let itemsListLength = itemsList.length;
  for (let i = 0; i < itemsListLength; i++) {
    itemsList[i].style.display = "none";
  }
}

// get mocked data
async function getData(data) {
  let json = await fetch(data);
  let info = await json.text();
  let comboboxData = [];
  comboboxData = JSON.parse(info);
  let combobox = document.getElementById("js-dbprintersList");
  comboboxData.map((e) => {
    if (isNewUser === "true") {
      // NEW USER
      // In case different configurations are added for printers, faxes, etc.
      if (e.type === "printers") {
        e.payload.map((el) => {
          if (el.hasOwnProperty("rawData")) {
            el.rawData.map((elem) => {
              // Populate the combobox
              let selectOption = document.createElement("a");
              selectOption.innerHTML = elem;
              combobox.append(selectOption);
            });
          }
        });
      }
    } else {
      // SEASONED USER
      // In case different configurations are added for printers, faxes, etc.
      if (e.type === "printers") {
        e.payload.map((el) => {
          if (el.hasOwnProperty("preConfiguredData")) {
            el.preConfiguredData.map((elem, i) => {
              // Populate the combobox
              let selectOption = document.createElement("a");
              selectOption.id = "js-dbprintersList-specialCase";
              selectOption.className = "dbprintersList-specialCase";
              switch (i) {
                case 0:
                  selectOption.innerHTML = elem + " - suggested";
                  break;
                case 1:
                  selectOption.innerHTML = elem + " - your default";
                  break;
                case 2:
                  selectOption.innerHTML = elem + " - PC default";
                  break;
                default:
                  selectOption.innerHTML = elem;
                  selectOption.id = "js-listItem";
              }
              combobox.append(selectOption);

              document.getElementById(
                "js-dbprintersList-specialCase"
              ).style.display = isNewUser === "false" ? "block" : "none";
            });
          }
        });
      }
      // Once the items are loaded, the contextual menu is executed
      //contextualMenu();
    }
    document.getElementById(
      "js-dbprintersList-outputDestination"
    ).style.display = dialog === "true" ? "block" : "none";
  });
}
// -- End get mocked data

getData("data-large-site.json");

/* End of Custom code */

/* 
	ComboBox Object 
	http://www.zoonman.com/projects/combobox/

	Copyright (c) 2011, Tkachev Philipp
	All rights reserved.
	BSD License
	
*/
ComboBox = function (object_name) {
  /* Custome code - this setTimeout is added to wait for the async function to load the data */
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
    var parobject = this;
    // Picker
    var pick = document
      .getElementById(object_name)
      .parentNode.getElementsByTagName("SPAN");
    pick[0].onclick = function () {
      console.log(1);
      parobject.edit.focus();
    };

    // Show Items when edit get focus
    this.edit.onfocus = function () {
      parobject.dropdownlist.style.display = "block";
      /* Custom code */
      if (isNewUser === "true") {
        hideItems(parobject);
      }
      /* End of Custom code */
    }; // End onfocus
    // Hide Items when edit lost focus
    this.edit.onblur = function () {
      if (allowLoose) {
        setTimeout(function () {
          parobject.dropdownlist.style.display = "none";
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
        /* 
        Custom Code
        When clicking an option that contains " - suggested" for example, it was injecting the span tag as text.
        So, I'm removing them and add them again.
        var upv = this.innerHTML;
        */
        this.classList.remove("light");
        var stringUpv = this.innerText.split(" - ");
        var upv = "";
        var specialSetup = "";
        if (stringUpv.length > 1) {
          upv = this.innerText.split(" - ").shift();
          specialSetup = " - " + this.innerText.split(" - ").pop();
        } else {
          upv = this.innerText;
        }
        // End custom code
        if (this.id === "js-listItem") {
          // to avoid removing and reinserting suggested and default elements
          upv = upv.replace(/\<b\>/gi, "");
          upv = upv.replace(/\<\/b\>/gi, "");
          parobject.edit.value = upv + specialSetup;
          //parobject.dropdownlist.style.display = "none";
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
                parobject.currentitem.className.replace(/light/g, "");
            }
            parobject.currentitem = parobject.listitems[i];
            parobject.currentitemindex = i;
            parobject.currentitem.className += " light";
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
              parobject.currentitem.className.replace(/light/g, "");
          }
          parobject.currentitem =
            parobject.listitems[parobject.currentitemindex];
          parobject.currentitem.className += " light";
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
              parobject.currentitem.className.replace(/light/g, "");
          }
          parobject.currentitem =
            parobject.listitems[parobject.currentitemindex];
          parobject.currentitem.className += " light";
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
    this.edit.onkeyup = function (e) {
      /** Custom code */
      // Labels "Searching all" and "enter 3 characters to search all..."
      let inputBox = e.currentTarget.value;
      if (inputBox.length > 0) {
        document.getElementById("js-dbprintersList-label").innerText =
          "Searching all";
      } else {
        document.getElementById("js-dbprintersList-label").innerText =
          "Enter 3 characters to search all...";
      }
      /** End of Custom code */
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
              /* 
              Custom adjustments.
              When typing, the results make bold all the text in the list tiem, including " - suggested" for example.
              Fix: If the string contains "- suggested", "- default", etc; only replace the characters of the first array item.
              original script: var pv = parobject.listitems[i].innerText;
              */
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
              if (re.test(pv)) {
                parobject.listitems[i].style.display = "block";
                parobject.visiblecount++;
                parobject.listitems[i].innerHTML =
                  pv.replace(re, "<b>$1</b>") + specialSetup;

                /* Custom code */
                // No matching items label
                if (isNewUser === "true") {
                  parobject.listitems[i].style.display = "block";
                  document.getElementById("js-dbprintersList-label").innerText =
                    "All that contains" + ` "${inputBox}"`;
                }
                /* End of Custom code */
              } else {
                parobject.listitems[i].style.display = "none";
              }
            }
            /* Custom code */
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
              document.getElementById("js-dbprintersList-label").innerText =
                "No matching items for" + ` "${inputBox}"`;
            }
            /* End of Custom code */
          }, loadDelay);
        }
      }
      /* 
      Custom Code 
      For the new user, when he/she deletes the entry, the items should be hidden
      */
      let inputComboboxLength =
        document.getElementById("cb_identifier").value.length;
      if (
        e.keyCode === 8 &&
        isNewUser === "true" &&
        inputComboboxLength === 0
      ) {
        hideItems(parobject);
      }
    }; // End onkeyup
  }, 100); // End custome code setTimeOut
};
