const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const ejs = require("ejs");
const bodyParser = require("body-parser"); 

const sanitize = require("./helpers/sanitize");

require('./handlers/sockets')(io);

const port = process.env.PORT;
 
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.get("/chatbox/", (req, res) => {
    res.render(__dirname + "/public/index");
});

app.post("/chatbox/", (req, res) => {
    req.body.display_name = sanitize(req.body.display_name);
    res.render(__dirname + "/public/chatbox", {userInfo: req.body});
});

http.listen(port, ()=>{ console.log("connected " + port); });

