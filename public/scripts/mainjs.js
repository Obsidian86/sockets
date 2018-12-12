const socket = io();
 
const dom = {
    selId(elementId){ return(document.getElementById(elementId))  },
    messages: document.getElementById("messages"),
    submit: document.getElementById("submitButton"),
    messageBox: document.getElementById("messageBox"),
    userList: document.getElementById("userList")
} 
const initialEmit = () =>{
    let userInfo = {
        user: dom.selId("h_user").innerText,
        profileImage: dom.selId("h_profileImage").innerText
    }
    socket.emit('NEW_USER', JSON.stringify(userInfo));
}
initialEmit();

//SOCKET IO LISTENERS //SOCKET IO LISTENERS //SOCKET IO LISTENERS
socket.on('RECEIVE_DIRECT', (message) => { console.log(message);
    message = JSON.parse(message);
    let nMessage = message.fromUser;
    nMessage.message = message.message;
    
    let newMessage = template.message(JSON.parse(nMessage));  
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
 
//PAGE EVENT LISTENERS //PAGE EVENT LISTENERS //PAGE EVENT LISTENERS
 
dom.submit.addEventListener("click", (event)=>{
    event.preventDefault();
    if(messageBox.value.length > 0){
        let sendMessage = {
            message: messageBox.value,
            user: user.name,
            profileImage: user.profileImage
        }
        socket.emit('NEW_MESSAGE', JSON.stringify(sendMessage));
        dom.messageBox.value = "";
    };
}); 

//

const sendDirect = (user) =>{
    let userBox = dom.selId(user);
    userBox.insertAdjacentHTML('beforeend', template.directText(user));
}
const cancelDirect = (event) =>{
    let thisBox = event.target.parentNode;
    thisBox.parentNode.removeChild(thisBox); 
}
const submitDirect = (sendUser) =>{  
    let sendMessage = {
        message: dom.selId("directText").value,
        fromUser: user, 
        toUser: sendUser 
    }
    socket.emit('DIRECT_MESSAGE', JSON.stringify(sendMessage));
    dom.selId("directMessageBox").parentNode.removeChild(dom.selId("directMessageBox"));
}