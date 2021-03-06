/* TODO: Hier kannst du deine eigenen Namen für deine HTML-Datei eingeben */

/* Connection Logic */
const { error } = require("console");
const http = require("http");
const hostname = "127.0.0.1";
const port = 8080;
var data = "";
const server = http.createServer((req, res) => {
  //Receive Data

  req.on("data", (chunk) => {
    data += chunk;
  });
  req.on("end", () => {
    let queryName = "";

    try {
      /* console.log("data", data); */
      queryName = Object.keys(JSON.parse(data));
      /* console.log("queryname", queryName); */
      if (queryName[0] == "find_belonging_resized_files") {
        /* find_belonging_files(res); */
        console.log("find_belonging_resized_files");
        find_belonging_files(
          JSON.parse(data).find_belonging_resized_files,
          res
        );
      } else if (queryName[0] == "save_html_file") {
        console.log("save_html_file");
        save_new_html_file(JSON.parse(data), res);
      } else if (queryName[0] == "get_local_html_file_content") {
        console.log("get_local_html_file_content");
        get_local_html_file_content(JSON.parse(data), res);
      }
    } catch (error) {
      console.log(error);
    }
    resetDataStream();
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function save_new_html_file(new_html_file, response) {
  console.log("Speichere neuen HTML Inhalt");
  response.writeHead(200, {
    "Content-Type": "text/plain",
    "Access-Control-Allow-Origin": "*", // Allow access from other domains
  });

  fs = require("fs");

  fs.writeFile(
    new_html_file.save_html_file,
    new_html_file.content,
    function (err) {
      if (err) return console.log(err);
    }
  );
  response.write("Datei wurde perfekt gespeichert");
  response.end();
  resetDataStream();
}

function get_local_html_file_content(fileName, response) {
  fs = require("fs");
  let html_file_content = fs.readFileSync(
    fileName.get_local_html_file_content,
    "utf8",
    (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );

  response.writeHead(200, {
    "Content-Type": "text/plain",
    "Access-Control-Allow-Origin": "*", // Allow access from other domains
  });
  response.write(html_file_content);
  response.end();
  resetDataStream();
}

function resetDataStream() {
  data = "";
}
