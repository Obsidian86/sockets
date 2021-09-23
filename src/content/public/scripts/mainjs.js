const socket = io();

const dom = {
    selId(elementId){ return(document.getElementById(elementId))  },
    messages: document.getElementById("messages"),
    submit: document.getElementById("submitButton"),
    messageBox: document.getElementById("messageBox"),
    userList: document.getElementById("userList"),
    toggleUsers: document.getElementById("toggleUsers_btn")
} 
const initialEmit = () =>{
    let userInfo = {
        user: dom.selId("h_user").innerText,
        profileImage: dom.selId("h_profileImage").innerText
    }
    socket.emit('NEW_USER', JSON.stringify(userInfo));
}
initialEmit();
 
 
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
 
const sendDirect = (clickedUser) =>{
    console.log(clickedUser, user)
    if (clickedUser && user && user.userId !== clickedUser) {
        if(document.getElementsByClassName("directBox").length > 0){
            dom.selId("directMessageBox").outerHTML = "";
        }
        let userBox = dom.selId(clickedUser);
        let toImage = userBox.children[0].outerHTML; 
        let toDisplay = userBox.children[1].innerText;
        userBox.insertAdjacentHTML('beforeend', template.directText(clickedUser, toDisplay, toImage));
    }
}
const cancelDirect = (event) =>{
    let thisBox = event.target.parentNode.parentNode;
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

//VISUAL
let userList_state = {
    view: true,
    smallList: false,
    viewLock: true
} 
dom.toggleUsers.addEventListener("click", () =>{
    userList_state.view = !userList_state.view;
    setView();
});

const setView = () =>{
    let winHeight = window.innerHeight;
    let winWidth = window.innerWidth;
    if(winWidth < 651){
        userList_state.smallList = true; 
        dom.selId("userIndex").classList.add("smallList");
        if(userList_state.viewLock){ 
            userList_state.view = false; 
            userList_state.viewLock = false; 
        }
    } else{
        if(document.getElementsByClassName("smallList").length > 0){
            document.getElementsByClassName("smallList")[0].classList.remove("smallList");
        }
        if(!userList_state.viewLock){ 
            userList_state.view = true; 
            userList_state.viewLock = true; 
        }
        userList_state.smallList = false;
    }
    dom.selId("userIndex").style.display = userList_state.view ? "block" : "none";
    dom.messages.style.height = (winHeight - 94) + "px";
    dom.selId("userIndex").style.height = (winHeight - 94) + "px";
    if( userList_state.smallList || !userList_state.view  ){ 
        dom.messages.style.width = "96%";
        dom.messages.style.margin = "0 2% 0 2%";
    }else{
        dom.messages.style.width = "70%" ;
        dom.messages.style.margin = "0 0 0 11px" ;
    } 
    dom.messages.scrollTop = dom.messages.scrollHeight; 
}

window.addEventListener("resize", setView);
setView();