const sanitize = require("../helpers/sanitize");

let users = [];
let messages = []; 
 
let Start_Message = {
    "message": "Welcome to ChatBox",
    "user": "Welcome",
    "profileImage": ""
};  
messages.push(Start_Message);

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