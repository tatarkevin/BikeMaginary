/* TODO: Hier kannst du deine eigenen Namen für deine HTML-Datei eingeben */
//alert("resizer.js wird ausgeführt und füllt jetzt die picture-Elemente aus.");
const html_datei_name = "index.html";
const html_datei_pfad = "C:/Users/Kevin/Desktop/BikeMaginary/HTML/index.html";
const javascript_data_pfad = "/JavaScript/resizer.js";

/* Ab hier nichts mehr ändern, außer du kennst dich aus :D */
var local_html_content = "";
var media_name_array = new Array();

setTimeout(get_local_html_file_content, 1000);
function get_local_html_file_content() {
  connectToBackend("get_local_html_file_content", html_datei_pfad, "");
}

function connectToBackend(requestName, fileName, currentContent) {
  let xhr = new XMLHttpRequest();
  let url = "http://127.0.0.1:8080";
  // open a connection
  xhr.open("POST", url, true);

  if (requestName === "find_belonging_resized_files") {
    // Set the request header i.e. which type of content you are sending
    xhr.setRequestHeader("Content-Type", "text/plain");
    // Create a state change callback
    xhr.onreadystatechange = function () {
      // Print received data from server

      if (xhr.status == 200 && xhr.readyState === 4) {
        create_source_Elements(JSON.parse(xhr.responseText), currentContent);
      } else if (xhr.status == 404) {
        console.log(xhr.responseText);
      }
      return;
    }; // Converting JSON data to string
    var data = JSON.stringify({
      find_belonging_resized_files: fileName,
    });
    // Sending data with the request
    xhr.send(data);
  } else if (requestName === "save_html_file") {
    // Set the request header i.e. which type of content you are sending
    xhr.setRequestHeader("Content-Type", "text/plain");
    // Create a state change callback
    xhr.onreadystatechange = function () {
      // Print received data from server

      if (xhr.status == 200 && xhr.readyState === 4) {
        console.log("200, Die Datei wurde erfolgreich gespeichert!");
      } else if (xhr.status == 404) {
        console.log(xhr.responseText);
      }
      xhr.abort();
      return;
    }; // Converting JSON data to string
    var data = JSON.stringify({
      save_html_file: html_datei_name,
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
      for (let temp_item of string_to_be_stored.matchAll("<img.*/>")) {
        image_element_structure = string_to_be_stored.slice(
          temp_item.index,
          matches_array[i + 1].index - matches_array[i].index - 1
        );
        console.log("image_element_structure1", image_element_structure);
      }
      console.log("image_element_structure2", image_element_structure);
      if (!image_element_structure) {
        continue;
      }
      const element_attribute_array = new Array();
      let image_ref_temp;
      const regex_attributes = '([a-zA-Z]{3,})="([a-zA-Z0-9/. _-]*)"';

      let attributes_array = "";
      attributes_array = image_element_structure.matchAll(
        String(regex_attributes)
      );
      /* ([a-zA-Z]+)="(.*)" [a-z]+|[\/] 
          ([a-zA-Z]{3,})=
          [a-zA-Z]+="([a-zA-Z0-9/. _-]*)"
          ([a-zA-Z]{3,})="([a-zA-Z0-9/. _-]*)"
      */

      console.log("attributes_array", attributes_array);
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
  }
  iterate_through_picture_elements();
}

let media_name_array_length;
function iterate_through_picture_elements() {
  for (let element of picture_element_array) {
    const regex_media_name = new RegExp(/(([a-zA-Z_0-9]+){1})\.[a-zA-Z]{1,5}/);
    const regex_media_name_split = new RegExp(/[\.][a-zA-Z]+/);

    let parsedURL;
    parsedURL = element.image_ref.match(regex_media_name)[0];
    const media_name_split = parsedURL.match(regex_media_name_split);
    media_name_array.push(
      media_name_split.input.slice(0, media_name_split.index)
    );
  }
  media_name_array_length = media_name_array.length - 1;
  connectToBackend(
    "find_belonging_resized_files",
    media_name_array[media_name_array_length],
    picture_element_array[media_name_array_length--]
  );
}

function sort_available_files(available_files) {
  const new_array = [...available_files];
  const regex_find_width = new RegExp("-w([0-9]*)");

  for (let i = 0; i < new_array.length / 2 + 1; i++) {
    for (let j = new_array.length - 1; j > new_array.length / 2 - 1; j--) {
      let temp = new_array[i];
      new_array[i] = new_array[j];
      new_array[j] = temp;
    }
  }
  for (let i = 0; i < new_array.length - 1; i++) {
    for (let j = i + 1; j < new_array.length; j++) {
      let temp_entry_ref_i = new_array[i].match(regex_find_width);
      let temp_entry_ref_j = new_array[j].match(regex_find_width);
      if (temp_entry_ref_i && temp_entry_ref_j) {
        if (parseInt(temp_entry_ref_i[1]) > parseInt(temp_entry_ref_j[1])) {
          let temp = new_array[i];
          new_array[i] = new_array[j];
          new_array[j] = temp;
        }
      } else if (!temp_entry_ref_i) {
        let temp = new_array[i];
        new_array[i] = new_array[j];
        new_array[j] = temp;
      }
      if (new_array[i].match(".png") && new_array[j].match(".webp")) {
        let temp = new_array[i];
        new_array[i] = new_array[j];
        new_array[j] = temp;
      }
    }
  }

  return new_array;
}

function create_source_Elements(available_files, currentContent) {
  available_files = sort_available_files(available_files);
  const new_picture_Element = document.createElement("picture");
  for (let file of available_files) {
    const regex_find_width = new RegExp("-w([0-9]*)");
    let match = file.match(regex_find_width);

    let new_source_element;
    if (match) {
      new_source_element = document.createElement("source");
      new_source_element.media = `(max-width: ${match[1]}px)`;
      new_source_element.srcset = `/Bilder/${file}`;
      if (file.match(".png")) {
        new_source_element.setAttribute("type", "image/png");
      } else if (file.match(".webp")) {
        new_source_element.setAttribute("type", "image/webp");
      }
      new_picture_Element.appendChild(new_source_element);
    } else if (!match) {
      if (file.match(".png")) {
        new_source_element = document.createElement("img");
        new_source_element.setAttribute("type", "image/png");
        for (let attribute of currentContent.previous_attributes) {
          new_source_element.setAttribute(attribute.attribut, attribute.wert);
        }
      } else if (file.match(".webp")) {
        new_source_element = document.createElement("source");
        new_source_element.setAttribute("type", "image/webp");
        new_source_element.srcset = `/Bilder/${file}`;
      }
      new_picture_Element.appendChild(new_source_element);
    }
  }

  overwrite_local_html_content(new_picture_Element, currentContent);
}

function overwrite_local_html_content(new_picture_Element, current_content) {
  const temp_container = document.createElement("div");
  temp_container.appendChild(new_picture_Element);
  const start_string = local_html_content.slice(0, current_content.start_index);

  let end_string = local_html_content.slice(
    current_content.end_index,
    local_html_content.length
  );

  let final_string = start_string + temp_container.innerHTML + end_string;

  local_html_content = final_string;

  console.log("---------------------------------------------------");
  if (media_name_array_length >= 0) {
    console.log("final_string", final_string);
    connectToBackend(
      "find_belonging_resized_files",
      media_name_array[media_name_array_length],
      picture_element_array[media_name_array_length--]
    );
  } else {
    /* JavaScript deaktivieren */
    let end_string_start;
    let end_string_end;
    let match_end_string_array = new Array();
    for (let temp of end_string.matchAll(
      "script.*" + javascript_data_pfad + ".*script"
    )) {
      match_end_string_array.push(temp);
    }
    /* TODO: Hier gibt es jetzt ein Problem :( */
    end_string_start = match_end_string_array[0].index - 1;
    end_string_end =
      match_end_string_array[0].index + match_end_string_array[0][0].length + 1;

    final_string =
      start_string +
      temp_container.innerHTML +
      end_string.slice(0, end_string_start) +
      "<!--" +
      end_string.slice(end_string_start, end_string_end) +
      "-->" +
      end_string.slice(end_string_end, end_string.length);
    /* console.log("start_string last ", start_string);
    console.log("temp_container last ", temp_container.innerHTML);
    console.log("end_string last ", end_string);
    console.log(
      "end_string_slice last ",
      end_string.slice(end_string_start, end_string_end)
    ); */
    console.log("final_string last ", final_string);

    //save_html_file(final_string);
  }
}

function save_html_file(new_html_structure) {
  connectToBackend("save_html_file", "", new_html_structure);
}
