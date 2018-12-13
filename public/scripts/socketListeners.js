
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
    
    let groups = {};
    popInfo.users.forEach(user => {
        if(!user.group){
            dom.userList.insertAdjacentHTML('beforeend', template.user(user)); 
        }else{
            if(!groups[user.group]){
                groups[user.group] = [user];
            }else{
                groups[user.group].push(user);
            }
        }
    });

    for(group in groups){
        let assembleGroup = `<ul class="group ${group}" id="group${group}"><p>${group} group</p>`;
        groups[group].forEach(user =>{
            assembleGroup += template.user(user);
        });
        assembleGroup += `</ul>`;
        dom.selId("listContainer").insertAdjacentHTML('beforeend', assembleGroup);
        dom.selId(`group${group}`).style.borderLeft = `4px solid ${group}`;
    }
    
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