const socket = io();
 
class User {
    setInfo(userId, name, profileImage){
        this.userId = userId;
        this.name = name;
        this.profileImage = profileImage;
    }
    joinChat(name, profileImage){
        socket.emit('NEW_USER', JSON.stringify({
            "user": name,
            "profileImage": profileImage
        }));
    }
}
let user = new User();

const dom = {
    selId(elementId){ return(document.getElementById(elementId))  },
    messages: document.getElementById("messages"),
    submit: document.getElementById("submitButton"),
    loginButton: document.getElementById("loginButton"),
    messageBox: document.getElementById("messageBox"),
    userList: document.getElementById("userList")
}
const template = {
    message(messageData){
        return(`
            <li>
                <img class="profileImage" 
                    src="${messageData.profileImage}" 
                    onerror="this.src='https://raw.githubusercontent.com/Infernus101/ProfileUI/0690f5e61a9f7af02c30342d4d6414a630de47fc/icon.png';">
                <p class="messageText">
                    <span class="user">${messageData.user}: </span>
                    ${messageData.message}
                </p>
            </li>`);
    },
    user(userData){ 
        return(`
        <li class="chatUser ${ userData.id === user.userId && "thisUser" }" id="${userData.id}">
            <img class="profileImage" src="${userData.profileImage}" onerror="this.src='https://raw.githubusercontent.com/Infernus101/ProfileUI/0690f5e61a9f7af02c30342d4d6414a630de47fc/icon.png';">
            <p class="userName">${userData.user}</p>
        </li>`);
    }
}

//SOCKET IO LISTENERS //SOCKET IO LISTENERS //SOCKET IO LISTENERS
socket.on('NEW_MESSAGE', (message) => { console.log('new message');
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
    dom.selId("loginContainer").style.display = "none";
    dom.selId("chatContainer").style.display = "block";
    dom.messages.scrollTop = dom.messages.scrollHeight; 
});

socket.on('NEW_USER', (userInfo) => {console.log('new user'); 
    dom.userList.insertAdjacentHTML('beforeend', template.user(JSON.parse(userInfo)));
});

socket.on('REMOVE_USER', (userInfo) => { console.log('remove user');
    let getUsers = document.getElementsByClassName("chatUser");
    for(let i=0; i<getUsers.length; i++){
        if(getUsers[i].id === userInfo){
            getUsers[i].parentNode.removeChild(getUsers[i]);
            break;
        }
    }
});
 
//PAGE EVENT LISTENERS //PAGE EVENT LISTENERS //PAGE EVENT LISTENERS
dom.loginButton.addEventListener("click", (event)=>{
    event.preventDefault();
    user.joinChat(
        dom.selId("display_name").value !== "" ? dom.selId("display_name").value : "Anonymous",
        dom.selId("profile_image").value !== "" ? dom.selId("profile_image").value : "https://raw.githubusercontent.com/Infernus101/ProfileUI/0690f5e61a9f7af02c30342d4d6414a630de47fc/icon.png"
    );
});

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

