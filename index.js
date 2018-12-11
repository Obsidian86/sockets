const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const port = process.env.PORT || 3000;
 
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});
 
let users = [];
let messages = [];

(function AUTOFILL(){
    let Start_Message;
    for(let i=0; i<10; i++){
        Start_Message = {
            "message": "This is a test first messsage",
            "user": "Johnathan Test",
            "profileImage": "https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg"
        }; 
        messages.push(Start_Message);
        Start_Message = {
            "message": "This is a test second messsage, its a bit longer than the first",
            "user": "Test Peerson",
            "profileImage": "https://content-static.upwork.com/uploads/2014/10/01073427/profilephoto1.jpg"
        };
        messages.push(Start_Message);
    };
    Start_Message = { 
        "user": "Johnathan Test",
        "profileImage": "https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg"
    }; 
    users.push(Start_Message);
    Start_Message = { 
        "user": "Test Peerson",
        "profileImage": "https://content-static.upwork.com/uploads/2014/10/01073427/profilephoto1.jpg"
    }; 
    users.push(Start_Message);
})(); 
 
io.on("connection", (socket) => {     
    socket.on("NEW_USER", (userInfo) => {
        let newUserInfo = JSON.parse(userInfo);
        newUserInfo.id = socket.id;
        io.to(`${socket.id}`).emit('POPULATE_DATA', JSON.stringify({ userInfo: newUserInfo, users, messages}));
        io.emit('NEW_USER', JSON.stringify(newUserInfo));
        users.push(newUserInfo);
    });

    socket.on('NEW_MESSAGE', (message) => {
        messages.push( JSON.parse(message) );
        io.emit('NEW_MESSAGE', message);
    });
    
    socket.on("disconnect", () =>{
        io.emit('REMOVE_USER', socket.id);
        users = users.filter(user => user.id !== socket.id); 
    }); 
});

http.listen(port, ()=>{ console.log("connected"); });

