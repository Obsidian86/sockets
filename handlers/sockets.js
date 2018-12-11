const sockets = (io, users, messages, socket) => {     
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
};

module.exports = sockets;