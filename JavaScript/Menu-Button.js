/* Klassennamen */
const headerbar_name = "Headerbar";
const menu_knopf_name = "Button__Menu";
const icon_hidden_name = "icon-hidden";
const headerbar_ausgeklappt_name = "Headerbar--ausgeklapt";
const headerbar_breakpoint = "1250";

/* Ab hier nichts mehr ändern, sonst ist alles kaputt :D */
var menu_is_active = false;
const menu_button = document.getElementsByClassName(menu_knopf_name)[0];

function toggle_menu(button) {
  menu_is_active = !menu_is_active;
  console.log(menu_is_active);
  if (menu_is_active) {
    click_locker.style.display = "block";
  } else {
    click_locker.style.display = "none";
  }
  for (let child of button.children) {
    child.classList.toggle(icon_hidden_name);
  }
  const headerbar_ref = document.getElementsByClassName(headerbar_name)[0];
  headerbar_ref.classList.toggle(headerbar_ausgeklappt_name);
  headerbar_ref.scrollTo(0, 0);
}

menu_button.addEventListener("click", function () {
  toggle_menu(menu_button);
});

const click_locker = document.createElement("div");
click_locker.style.height = "100vh";
click_locker.style.width = "100vw";
click_locker.style.backgroundColor = "black";
click_locker.style.zIndex = "777";
click_locker.style.position = "absolute";
click_locker.style.top = "0";
click_locker.style.left = "0";
click_locker.style.opacity = "0";
click_locker.style.display = "none";
document.body.appendChild(click_locker);
click_locker.addEventListener("click", function () {
  toggle_menu(menu_button);
});

window.onresize = function () {
  if (menu_is_active && window.innerWidth > headerbar_breakpoint) {
    toggle_menu(menu_button);
  }
};
