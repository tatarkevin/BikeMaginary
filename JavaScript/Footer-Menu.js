/*
    Hier kannst du deine eigenen Klassennamen verwenden,
    damit das JavaScript auch bei dir funktioniert.
 */
const footer_section_name = "Footer__Section";
const footer_button_name = "Footer__Menu-Button";
const footer_ausgeklappt_name = "Footer--ausgeklappt";

/* 
    Ab hier nichts ändern außer du kennst dich mit JavaScript
    aus :) 
*/

const footer_sections_arr =
  document.getElementsByClassName(footer_section_name);

for (let section of footer_sections_arr) {
  section.addEventListener("click", function () {
    toggleMenuHeight(section);
  });
}

function toggleMenuHeight(section) {
  console.log(section);
  section.classList.toggle(footer_ausgeklappt_name);
}
