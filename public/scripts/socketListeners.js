socket.on('RECEIVE_DIRECT', (message) => {
    let newMessage = template.message(JSON.parse(message));  
    dom.messages.insertAdjacentHTML('beforeend', newMessage); 
    dom.messages.scrollTop = messages.scrollHeight;
}); 
socket.on('SENT_DIRECT', (message) => {
    let newMessage = template.message(JSON.parse(message));  
    dom.messages.insertAdjacentHTML('beforeend', newMessage); 
    dom.messages.scrollTop = messages.scrollHeight;
}); 
socket.on('NEW_MESSAGE', (message) => { 
    let newMessage = template.message(JSON.parse(message));
    dom.messages.insertAdjacentHTML('beforeend', newMessage); 
    dom.messages.scrollTop = messages.scrollHeight;
}); 

socket.on('POPULATE_DATA', (popInfo) => { 
    popInfo = JSON.parse(popInfo);
    user.setInfo(popInfo.userInfo.id, popInfo.userInfo.user, popInfo.userInfo.profileImage);
    popInfo.messages.forEach(message =>{    
        dom.messages.insertAdjacentHTML('beforeend', template.message(message)); 
    });
    popInfo.users.forEach(user => {
        dom.userList.insertAdjacentHTML('beforeend', template.user(user)); 
    });  
    dom.messages.scrollTop = dom.messages.scrollHeight; 
});

socket.on('NEW_USER', (userInfo) => {  
    dom.userList.insertAdjacentHTML('beforeend', template.user(JSON.parse(userInfo)));
});

socket.on('REMOVE_USER', (userInfo) => { 
    let getUsers = document.getElementsByClassName("chatUser");
    for(let i=0; i<getUsers.length; i++){
        if(getUsers[i].id === userInfo){
            getUsers[i].parentNode.removeChild(getUsers[i]);
            break;
        }
    }
});