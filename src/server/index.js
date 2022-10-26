const express = require("express");
const server = express();
const path = require("path");
const fetch = require("node-fetch");
const {
  retrieveOpenRestaurants,
} = require("./controllers/restaurant.controller");
const port = process.env.PORT || 5000;

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

server.get("/api", (req, res) => {
  res.status(200).send({ status: "Ok" });
});

server.get("/api/postman-echo", async (req, res) => {
  const proxRes = await fetch(
    "https://postman-echo.com/get?foo1=bar1&foo2=bar2"
  );
  const result = await proxRes.json();
  res.send(result);
});

server.get("/api/restaurants/open/:day/:time", async (req, res) => {
  console.log("-------", req.body);
  return retrieveOpenRestaurants(req, res);
});
