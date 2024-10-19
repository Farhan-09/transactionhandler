const { render } = require("ejs");
var express = require("express");
var app = express();
var fs = require("fs");

var path = require("path");

app.set("view engine", "ejs");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  fs.readdir(`./hisaab`, function (err, files) {
    if (err) return res.status(500).send(err);
    res.render("index", { files });
  });
});

app.get("/create", function (req, res) {
  res.render("create");
});

app.post(`/createhisaab`, function (req, res) {

  
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
  const year = today.getFullYear();

  const fb = `${day}-${month}- ${year}.txt`;

  fs.writeFile(`./hisaab/${fb}`, req.body.content, function (err) {
    if (err) return res.status(500).send(err);
    res.redirect("/");
  });
});

app.get("/edit/:filename", function (req, res) {
  fs.readFile(`./hisaab/${req.params.filename}`, "utf-8", function (err, data) {
    if (err) return res.status(500).send(err);
    res.render("edit", { filename: req.params.filename, data });
  });
});

app.post("/update/:filename", function (req, res) {
  fs.writeFile(
    `./hisaab/${req.params.filename}`,
    req.body.content,
    function (err) {
      if (err) return res.status(500).send(err);

      res.redirect("/");
    }
  );
});

app.get("/hisaab/:filename", function (req, res) {
  fs.readFile(`./hisaab/${req.params.filename}`, "utf-8", function (err, data) {
    if (err) return res.status(500).send(err);
    res.render("hisaab", { filename: req.params.filename, data });
  });
});

app.get("/delete/:filename", function (req, res) {
  fs.unlink(`./hisaab/${req.params.filename}`, function (err) {
    if (err) return res.status(500).send(err);
    res.redirect("/");
  });
});

app.listen(3000);
