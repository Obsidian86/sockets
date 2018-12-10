const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});
 
io.on("connection", (socket) => {   
    //AUTO FILL DATA
    let Start_Message;
    for(let i=0; i<3; i++){
        Start_Message = JSON.stringify({
            "message": "This is a test first messsage",
            "user": "Johnathan Test",
            "profileImage": "https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg"
        });
        
        io.emit("NEW_MESSAGE", Start_Message);
    
        Start_Message = JSON.stringify({
            "message": "This is a test second messsage, its a bit longer than the first",
            "user": "Test Peerson",
            "profileImage": "https://content-static.upwork.com/uploads/2014/10/01073427/profilephoto1.jpg"
        });
        
        io.emit("NEW_MESSAGE", Start_Message);
    }
     
    Start_Message = JSON.stringify({ 
        "user": "Johnathan Test",
        "profileImage": "https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg"
    });
    io.emit('NEW_USER', Start_Message);
    Start_Message = JSON.stringify({ 
        "user": "Test Peerson",
        "profileImage": "https://content-static.upwork.com/uploads/2014/10/01073427/profilephoto1.jpg"
    });
    io.emit('NEW_USER', Start_Message);
 
    //AUTO FILL DATA

    socket.on("NEW_USER", (userInfo) => {
        io.emit('NEW_USER', userInfo);
    });

    socket.on('NEW_MESSAGE', (message) => {  
        io.emit('NEW_MESSAGE', message);
    });
 
    socket.on("disconnect", () =>{
        console.log("disconnected");
    });


});

http.listen(port, ()=>{
    console.log("connected");
});

