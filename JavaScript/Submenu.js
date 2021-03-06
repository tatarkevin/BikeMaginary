//TODO: Hier kannst du deine eigenen Klassennamen eintragen.
//Du musst nur sicherstellen, dass die Werte zwischen den Gänsefüßchen absolut exakt so
//heißen, wie deine Klassennamen.
const Headerbar__Name = "Headerbar";
const Headerbar__Button__Name = "Headerbar__Button";
const submenu_Klassenname = "Submenu";
const ausgeklapptes_Submenu_Name = "Submenu--expanded";
const breakpoint_desktop = 1250; // Das ist der Breakpoint ab wann die mobile Headerbar angezeigt wird

//Ab hier nichts ändern, außer du kennst dich aus!
{
  const all_buttons_array = document.getElementsByClassName(
    Headerbar__Button__Name
  );
  const button_array = new Array();
  const submenu_array = new Array();
  const combined_array = new Array();
  let active_Submenu;
  const headerbar_ref = document.getElementsByClassName(Headerbar__Name)[0];
  let b_keepSubmenuActive = false;
  const expanded_submenu_class = ausgeklapptes_Submenu_Name;

  class submenu_link {
    constructor(button, submenu) {
      this.button = button;
      this.submenu = submenu;
    }
  }

  let index = 0;
  let button_id = 0;
  for (let button of all_buttons_array) {
    if (button.dataset.submenu_id) {
      button.dataset.index = index++;
      button_array.push(button);
    }
    button.dataset.button_id = button_id++;
  }

  for (let submenu of document.getElementsByClassName(submenu_Klassenname)) {
    if (submenu.dataset.submenu_id) {
      submenu.dataset.default_display = getComputedStyle(submenu).display;
      submenu.style.display = "none";
      submenu_array.push(submenu);
    }
  }

  for (let i = 0; i < button_array.length; i++) {
    for (let j = 0; j < submenu_array.length; j++) {
      if (
        button_array[i].dataset.submenu_id ===
        submenu_array[j].dataset.submenu_id
      ) {
        combined_array.push(
          new submenu_link(button_array[i], submenu_array[j])
        );
      }
    }
  }

  function calculateLeftOffsets() {
    if (window.innerWidth >= breakpoint_desktop) {
      for (let button of button_array) {
        const belonging_submenu = combined_array[button.dataset.index].submenu;
        belonging_submenu.style.display =
          belonging_submenu.dataset.default_display;
        const belonging_submenu_width =
          belonging_submenu.getBoundingClientRect().width;
        belonging_submenu.style.display = "none";
        let button_offset = button.getBoundingClientRect().left;
        if (button_offset + belonging_submenu_width > window.innerWidth) {
          button_offset +=
            window.innerWidth - (button_offset + belonging_submenu_width) - 20;
        }
        button.dataset.left_offset = button_offset;
      }
    }
  }

  calculateLeftOffsets();

  var calculateLeftButtonOffsets;
  window.onresize = function () {
    clearTimeout(calculateLeftButtonOffsets);
    calculateLeftButtonOffsets = setTimeout(calculateLeftOffsets, 500);
  };

  let previousHoveredButton = undefined;

  function showSubmenu(button) {
    b_keepSubmenuActive = true;
    if (window.innerWidth >= breakpoint_desktop) {
      if (active_Submenu != undefined) {
        hideSubmenu();
      }
      let index = button.dataset.index;
      element = combined_array[index].submenu;

      element.style.display = element.dataset.default_display;
      calculateVerticalOffsetOfSubmenu(element);
      element.style.left = button.dataset.left_offset + "px";
      element.classList.add(expanded_submenu_class);
      active_Submenu = element;
    }
  }

  function calculateVerticalOffsetOfSubmenu(element) {
    element.style.top = headerbar_ref.getBoundingClientRect().bottom - 2 + "px"; //Weil ich jetzt immer die bottom edge neu berechne, geht endlich die animation
  }

  function hideSubmenu() {
    if (window.innerWidth >= breakpoint_desktop) {
      if (active_Submenu != undefined) {
        active_Submenu.classList.remove(expanded_submenu_class);
        active_Submenu.style.display = "none";
        active_Submenu = undefined;
        previousHoveredButton = undefined;
      }
    }
  }

  for (let button of button_array) {
    /* button.addEventListener("mouseover", function () {
      showSubmenu(button);
    }); */
    button.addEventListener("mouseover", function (event) {
      if (window.innerWidth >= breakpoint_desktop) {
        event.preventDefault();
        showSubmenu(button);
      }
    });
  }

  for (let button of all_buttons_array) {
    button.addEventListener("mouseover", function () {
      if (
        previousHoveredButton != undefined &&
        previousHoveredButton.dataset.button_id !== button.dataset.button_id
      ) {
        hideSubmenu();
      }
      previousHoveredButton = button;
    });
  }

  for (let submenu of submenu_array) {
    submenu.addEventListener("mouseleave", () => {
      hideSubmenu();
    });
    submenu.addEventListener("mouseover", () => {
      b_keepSubmenuActive = true;
    });
  }

  function checkIfSubmenuCanBeActive() {
    if (!b_keepSubmenuActive) {
      hideSubmenu();
    }
  }

  function delayedCheckForHidingSubmenu() {
    b_keepSubmenuActive = false;
    setTimeout(checkIfSubmenuCanBeActive, 100);
  }

  headerbar_ref.addEventListener("mouseleave", function () {
    delayedCheckForHidingSubmenu();
  });

  /*  for (let item of button_array) {
    console.log(item);
  }
  console.log("------------------");
  for (let item of submenu_array) {
    console.log(item);
  }
  console.log("------------------");
  for (let item of combined_array) {
    console.log(item);
  }
  console.log("------------------");
  for (let item of all_buttons_array) {
    console.log(item);
  } */
}
