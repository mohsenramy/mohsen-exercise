const express = require("express");
const server = express();
const path = require("path");
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`The app server is running on port: ${port}`);
});

const DIST_DIR = path.join(__dirname, "dist");
const HTML_FILE = path.join(DIST_DIR, "index.html");

server.use(express.json());
server.use(express.static("public"));
server.use(express.static("dist"));

server.get("/", (req, res) => {
  res.sendFile(HTML_FILE, function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});
