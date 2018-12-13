const sanitize = require("../helpers/sanitize");

let users = [];
let messages = [];
let groups = [
    {
        taken: false,
        color: "red", 
    },
    {
        taken: false,
        color: "green", 
    },
    {
        taken: false,
        color: "blue", 
    },
    {
        taken: false,
        color: "orange", 
    },
    {
        taken: false,
        color: "purple", 
    },
    {
        taken: false,
        color: "pink", 
    },
    {
        taken: false,
        color: "yellow"
    }
];

(function AUTOFILL(){
    let Start_Message;
        //add Messages
    for(let i=0; i<5; i++){
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
        //add users
    for(let i=0; i<13; i++){
        Start_Message = { 
            "user": i+ "Johnathan Test" + i,
            "profileImage": "https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg",
            "id": "asd" + i
        }; 
        users.push(Start_Message);
    
        Start_Message = { 
            "user": i + "Test Peerson" +i,
            "profileImage": "https://content-static.upwork.com/uploads/2014/10/01073427/profilephoto1.jpg",
            "id": "zxc" + i
        }; 
        users.push(Start_Message);
    }
        Start_Message = { 
            "user": "xJohnathan RED" ,
            "profileImage": "https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg",
            "id": "asdx" ,
            "group": "red"
        }; 
        users.push(Start_Message);

        Start_Message = { 
            "user": "xTest Peersonx RED" ,
            "profileImage": "https://content-static.upwork.com/uploads/2014/10/01073427/profilephoto1.jpg",
            "id": "zxcx" ,
            "group": "red"
        }; 
        users.push(Start_Message);
        Start_Message = { 
            "user": "xJohnathan RED" ,
            "profileImage": "https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg",
            "id": "asdx" ,
            "group": "red"
        }; 
        users.push(Start_Message);

        Start_Message = { 
            "user": "xTest Peersonx RED" ,
            "profileImage": "https://content-static.upwork.com/uploads/2014/10/01073427/profilephoto1.jpg",
            "id": "zxcx" ,
            "group": "red"
        }; 
        users.push(Start_Message);
        Start_Message = { 
            "user": "xJohnathan RED" ,
            "profileImage": "https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg",
            "id": "asdx" ,
            "group": "green"
        }; 
        users.push(Start_Message);

        Start_Message = { 
            "user": "xTest Peersonx RED" ,
            "profileImage": "https://content-static.upwork.com/uploads/2014/10/01073427/profilephoto1.jpg",
            "id": "zxcx" ,
            "group": "green"
        }; 
        users.push(Start_Message);
        Start_Message = { 
            "user": "xJohnathan RED" ,
            "profileImage": "https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg",
            "id": "asdxasd1" ,
            "group": "blue"
        }; 
        users.push(Start_Message);

        Start_Message = { 
            "user": "xTest Peersonx RED" ,
            "profileImage": "https://content-static.upwork.com/uploads/2014/10/01073427/profilephoto1.jpg",
            "id": "zxcxasd" ,
            "group": "blue"
        }; 
        users.push(Start_Message);

})(); 
 
module.exports = (io) => {
    io.on("connection", (socket) => {  
        
        socket.on("NEW_USER", (userInfo) => {
            let newUserInfo = JSON.parse(userInfo);
            newUserInfo.id = socket.id;
            io.to(`${socket.id}`).emit('POPULATE_DATA', JSON.stringify({ userInfo: newUserInfo, users, messages}));
            io.emit('NEW_USER', JSON.stringify(newUserInfo));
            users.push(newUserInfo);
        });
    
        socket.on('NEW_MESSAGE', (message) => {
            let newMessage = JSON.parse(message);
            newMessage.message = sanitize(newMessage.message);
            messages.push( newMessage );
            io.emit('NEW_MESSAGE', JSON.stringify(newMessage));
        });

        socket.on('DIRECT_MESSAGE', (message) => {
            let newMessage = JSON.parse(message);
            let findTo = users.filter(user => user.id === newMessage.toUser);
            let sendMessage = { ...newMessage.fromUser, user: newMessage.fromUser.name, message: sanitize(newMessage.message), direct: "from"};
            io.to(`${newMessage.toUser}`).emit('RECEIVE_DIRECT', JSON.stringify(sendMessage));
            sendMessage.direct = "sent";
            sendMessage.directTo = findTo.length > 0 ? findTo[0].user : "Disconnected user";
            io.to(`${sendMessage.userId}`).emit('SENT_DIRECT', JSON.stringify(sendMessage));
        });
        
        socket.on("disconnect", () =>{
            io.emit('REMOVE_USER', socket.id);
            users = users.filter(user => user.id !== socket.id); 
        }); 


    });
}