/* TODO: Hier kannst du deine eigenen Namen für deine HTML-Datei und JavaScript eingeben */
const html_datei_pfad =
  "C:/Users/Kevin/Desktop/Desktop_Sortiert/Webentwicklung/BikeMaginary/HTML/Produkte/MiniAtlantis.HTML";
const javascript_datei_pfad = "/JavaScript/resizer.js";

//TODO: Wenn du das skript testen willst dann auf "true", ansonsten auf "false";
const skript_testen = false;

/* TODO: Ab hier nichts mehr ändern, außer du kennst dich aus :D */

var local_html_content = "";
var media_name_array = new Array();

setTimeout(get_local_html_file_content, 1000);
function get_local_html_file_content() {
  console.log("-----------resizer------------");
  connectToBackend("get_local_html_file_content", html_datei_pfad, "");
}

function connectToBackend(requestName, fileName, currentContent) {
  let xhr = new XMLHttpRequest();
  let url = "http://127.0.0.1:8080";
  // open a connection
  xhr.open("POST", url, true);

  if (requestName === "save_html_file") {
    // Set the request header i.e. which type of content you are sending
    xhr.setRequestHeader("Content-Type", "text/plain");
    // Create a state change callback
    xhr.onreadystatechange = function () {
      // Print received data from server

      if (xhr.status == 200 && xhr.readyState === 4) {
        console.log("200, Die Datei wurde erfolgreich gespeichert!");
      } else if (xhr.status == 404) {
        console.log(xhr.responseText);
      } else {
        console.log("irgendwas lief beim speichern schief!");
      }
      xhr.abort();
      return;
    }; // Converting JSON data to string
    var data = JSON.stringify({
      save_html_file: html_datei_pfad,
      content: currentContent,
    });
    // Sending data with the request
    xhr.send(data);
  } else if (requestName === "get_local_html_file_content") {
    xhr.setRequestHeader("Content-Type", "text/plain");
    // Create a state change callback
    xhr.onreadystatechange = function () {
      // Print received data from server

      if (xhr.status == 200 && xhr.readyState === 4) {
        console.log("200, Die Datei ist angekommen");
        local_html_content = xhr.responseText;
        console.log(local_html_content);
        parse_content_for_picture_elements();
      } else if (xhr.status == 404) {
        console.log(xhr.responseText);
      }
      return;
    }; // Converting JSON data to string
    var data = JSON.stringify({
      get_local_html_file_content: html_datei_pfad,
    });
    // Sending data with the request
    xhr.send(data);
  }
}

class picture_element {
  constructor(start_index, end_index, content, image_ref, previous_attributes) {
    this.start_index = start_index;
    this.end_index = end_index;
    this.content = content;
    this.image_ref = image_ref;
    this.previous_attributes = previous_attributes;
  }
}
class element_attribute {
  constructor(attribut, wert) {
    this.attribut = attribut;
    this.wert = wert;
  }
}
const picture_element_array = new Array();
function parse_content_for_picture_elements() {
  const element_to_search_for = "picture";
  const regex = new RegExp(element_to_search_for, "g");
  const string_to_be_tested = String(local_html_content);
  const matches = string_to_be_tested.matchAll(regex);
  const matches_array = [...matches];
  for (let i = 0; i < matches_array.length - 1; i++) {
    if (i % 2 == 0) {
      let string_to_be_stored = local_html_content.slice(
        matches_array[i].index - 1,
        matches_array[i + 1].index + element_to_search_for.length + 1
      );
      let image_element_structure;
      const img_regex = "<img[.]*";
      for (let temp_item of string_to_be_stored.matchAll(img_regex)) {
        image_element_structure = string_to_be_stored.slice(
          temp_item.index,
          matches_array[i + 1].index - matches_array[i].index - 1
        );
      }
      if (!image_element_structure) {
        continue;
      }
      const element_attribute_array = new Array();
      let image_ref_temp;
      const regex_attributes = '([a-zA-Z]{3,})="([a-zA-Z0-9%/. _-]*)"';
      /* const regex_attributes = new RegExp(/(src)="(.*\.[a-zA-Z]+)"/g); */
      /*  const regex_attributes = "src"; */

      let attributes_array = "";
      attributes_array = image_element_structure.matchAll(regex_attributes);
      /* ([a-zA-Z]+)="(.*)" [a-z]+|[\/] 
          ([a-zA-Z]{3,})=
          [a-zA-Z]+="([a-zA-Z0-9/. _-]*)"
          ([a-zA-Z]{3,})="([a-zA-Z0-9/. _-]*)"
      */

      for (let attribute of attributes_array) {
        if (attribute[1] == "src") {
          image_ref_temp = attribute[2];
        }
        element_attribute_array.push(
          new element_attribute(attribute[1], attribute[2])
        );
      }

      picture_element_array.push(
        new picture_element(
          matches_array[i].index - 1,
          matches_array[i + 1].index + element_to_search_for.length + 1,
          string_to_be_stored,
          image_ref_temp,
          element_attribute_array
        )
      );
    }
    /* console.log("picture_element_array", picture_element_array); */
  }
  iterate_through_picture_elements();
}

var media_name_array_length;
function iterate_through_picture_elements() {
  media_name_array = new Array();
  console.log(picture_element_array);
  for (let i = picture_element_array.length - 1; i >= 0; i--) {
    /* https://regex101.com/ */
    const regex_media_name = new RegExp(/(([a-zA-Z_0-9]+){1})\.[a-zA-Z]{1,5}/);
    const regex_media_name_split = new RegExp(/[\.][a-zA-Z]+/);

    let parsedURL;
    parsedURL = picture_element_array[i].image_ref.match(regex_media_name)[0];
    const media_name_split = parsedURL.match(regex_media_name_split);
    media_name_array.push(
      media_name_split.input.slice(0, media_name_split.index)
    );

    /* Hier schauen wir ob das picture-Element ein data-parcel-resizer-Attribut hat
      Wenn ja, dann parsen wir durch und schauen was für Bilder-Versionen wir vom Original wollen.
    */
    const regex_data_attr = new RegExp(/data-parcel-resizer="(.*[ \n]*.*)"/);
    const regex_data_order = new RegExp(/data-parcel-order="(.*[ \n]*.*)"/);
    let parsed_data_attr_array;
    parsed_data_attr_array =
      picture_element_array[i].content.match(regex_data_attr);
    if (parsed_data_attr_array) {
      parsed_data_attr_array = parsed_data_attr_array[1].split(",");
      parsed_data_attr_array = sort_picture_element_structure(
        parsed_data_attr_array,
        picture_element_array[i].content.match(regex_data_order)[1].split(",")
      );
      change_picture_element_structure(
        parsed_data_attr_array,
        picture_element_array[i]
      );
    }
  }
  save_html_file(local_html_content);
}

function sort_picture_element_structure(array, order) {
  const sorted_arrays = new Array();
  for (let format of order) {
    const new_array = new Array();
    for (let array_item of array) {
      if (array_item.match(format.trim())) {
        new_array.push(array_item.trim());
      }
    }
    sorted_arrays.push(new_array);
  }
  for (let i = 0; i < sorted_arrays.length; i++) {
    for (let j = 0; j < sorted_arrays[i].length - 1; j++) {
      for (let k = j + 1; k < sorted_arrays[i].length; k++) {
        let left_item = sorted_arrays[i][j].match("[0-9]+");
        let right_item = sorted_arrays[i][k].match("[0-9]+");

        if (parseInt(left_item[0]) > parseInt(right_item[0])) {
          const temp = sorted_arrays[i][j];
          sorted_arrays[i][j] = sorted_arrays[i][k];
          sorted_arrays[i][k] = temp;
        }
      }
    }
  }

  const new_array = new Array();
  for (let i = 0; i < sorted_arrays.length; i++) {
    for (let j = 0; j < sorted_arrays[i].length; j++) {
      new_array.push(sorted_arrays[i][j]);
    }
  }
  return new_array;
}
function change_picture_element_structure(parsed_data_attr_array, element) {
  let new_picture_Element_middle = document.createElement("picture");

  let new_picture_Element_start = element.content.match(
    new RegExp(
      /<[ \n\r]*.*picture[ \n\r]*.*data-parcel-resizer=".*[ \n\r]*.*"[ \n\r]*>/gm
    )
  );
  let new_picture_Element_end = "</picture>";

  for (let source_element of parsed_data_attr_array) {
    source_element_width = source_element.trim().match("[0-9]+");
    source_element_type = source_element.trim().match("[a-zA-Z]+");
    source_element_mediaQuery = source_element.trim().match("@[0-9]+");
    let new_source_element = document.createElement("source");
    new_source_element.media = "(max-width:" + source_element_width + "px)";
    new_source_element.type = "image/" + source_element_type;

    if (source_element_mediaQuery) {
      source_element_mediaQuery = parseInt(
        source_element_mediaQuery[0].match("[0-9]+")
      );
      source_element_width = parseInt(source_element_width[0]);
      source_element_width += source_element_mediaQuery;

      new_source_element.media = `(min-width: ${source_element_mediaQuery}px) and (max-width: ${source_element_width}px)`;
      source_element_width -= source_element_mediaQuery;
    }
    new_source_element.srcset =
      element.image_ref +
      "?as=" +
      source_element_type +
      "&width=" +
      source_element_width;
    new_picture_Element_middle.appendChild(new_source_element);
  }
  let current_image_element = document.createElement("img");
  for (let attr of element.previous_attributes) {
    current_image_element.setAttribute(attr.attribut, attr.wert);
  }

  new_picture_Element_middle.appendChild(current_image_element);

  const new_picture_Element_combined =
    new_picture_Element_start +
    String(
      new_picture_Element_middle.innerHTML
        .replaceAll("amp;", "")
        .replaceAll("&quot;", '"')
    ) +
    new_picture_Element_end;

  local_html_content =
    local_html_content.slice(0, element.start_index) +
    new_picture_Element_combined +
    local_html_content.slice(element.end_index);
}

function save_html_file(new_html_structure) {
  //TODO:
  /* JavaScript deaktivieren */
  let end_string_start;
  let end_string_end;
  let match_end_string_array = new Array();
  for (let temp of new_html_structure.matchAll(
    new RegExp(
      `<script[\n\r ]*src="${javascript_datei_pfad}">[\n\r ]*<\/script>`,
      "gm"
    )
  )) {
    match_end_string_array.push(temp);
  }

  end_string_start = match_end_string_array[0].index - 1;
  end_string_end =
    match_end_string_array[0].index + match_end_string_array[0][0].length + 1;
  let final_string =
    new_html_structure.slice(0, end_string_start) +
    "<!-- " +
    match_end_string_array[0][0] +
    " -->" +
    new_html_structure.slice(
      match_end_string_array[0].index + match_end_string_array[0][0].length,
      new_html_structure.length
    );
  console.log("final_string last ", final_string);

  if (!skript_testen) {
    connectToBackend("save_html_file", "", final_string);
  }
}
