const socket = io();

const messages = document.getElementById("messages");
const submit = document.getElementById("submitButton");
const loginButton = document.getElementById("loginButton");
const messageBox = document.getElementById("messageBox");
const userList = document.getElementById("userList");

class User {
    setInfo(name, profileImage){
        this.name = name;
        this.profileImage = profileImage;
    }
    joinChat(){
        socket.emit('NEW_USER', JSON.stringify({
            "user": this.name,
            "profileImage": this.profileImage
        }));
    }
}


//SOCKET IO LISTENERS //SOCKET IO LISTENERS //SOCKET IO LISTENERS
socket.on('NEW_MESSAGE', (message) => {
    let messageData = JSON.parse(message);
    let newMessage = `
    <li>
        <img class="profileImage" src="${messageData.profileImage}">
        <p class="messageText">
            <span class="user">${messageData.user}: </span>
            ${messageData.message}
        </p>
    </li>`;
    messages.insertAdjacentHTML('beforeend', newMessage);
});

socket.on('POPULATE_USERS', (userInfo) => {
    userInfo = JSON.parse(userInfo);
        console.log(userInfo)
    userInfo.forEach(user => {
        let newUser = `
        <li class="chatUser" id="${user.id}">
            <img class="profileImage" src="${user.profileImage}">
            <p class="userName">${user.user}</p>
        </li>`;
        userList.insertAdjacentHTML('beforeend', newUser);
    }); 
});

socket.on('NEW_USER', (userInfo) => {
    userInfo = JSON.parse(userInfo);
    let newUser = `
    <li class="chatUser" id="${userInfo.id}">
        <img class="profileImage" src="${userInfo.profileImage}">
        <p class="userName">${userInfo.user}</p>
    </li>`;
    userList.insertAdjacentHTML('beforeend', newUser);
});

socket.on('REMOVE_USER', (userInfo) => { 
    let getUsers = document.getElementsByClassName("chatUser");
    for(let i=0; i<getUsers.length; i++){
        if(getUsers[i].id === userInfo){
            getUsers[i].parentNode.removeChild(getUsers[i]);
        }
    }
});
 

let user = new User();
 

//PAGE EVENT LISTENERS //PAGE EVENT LISTENERS //PAGE EVENT LISTENERS
loginButton.addEventListener("click", (event)=>{
    event.preventDefault();
    user.setInfo(
        document.getElementById("display_name").value !== "" ? document.getElementById("display_name").value : "Anonymous",
        document.getElementById("profile_image").value !== "" ? document.getElementById("profile_image").value : "https://raw.githubusercontent.com/Infernus101/ProfileUI/0690f5e61a9f7af02c30342d4d6414a630de47fc/icon.png"
    ); 
    user.joinChat();
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("chatContainer").style.display = "block";
});

submit.addEventListener("click", (event)=>{
    event.preventDefault();
    if(messageBox.value.length > 0){
        let sendMessage = {
            message: messageBox.value,
            user: user.name,
            profileImage: user.profileImage
        }
        socket.emit('NEW_MESSAGE', JSON.stringify(sendMessage));
        messageBox.value = "";
    } 
}); 

