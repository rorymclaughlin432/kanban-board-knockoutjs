var express = require("express");
var app = express();

app.use(express.static(__dirname + "/src"));

app.listen(3000, function () {
  console.log("Kanban app listening on port 3000!");
});
