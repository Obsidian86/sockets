const template = {

    message(messageData){
        return(`
            <li ${messageData["direct"] ? "class='direct'" : ""}>
                <img class="profileImage" 
                    src="${messageData.profileImage}" 
                    onerror="this.src='images/profiles/default.png';">
                <p class="messageText">
                    <span class="user"> 
                        ${ messageData["direct"] === "from" ? "from " : ""}
                        ${messageData.user} 
                        ${ messageData["direct"] === "sent" ? "to " : ""} 
                        ${ messageData["directTo"] ?  messageData["directTo"] : ""}
                    : </span>
                    
                    ${messageData.message}
                </p>
            </li>`);
    },

    user(userData){ 
        return(`
        <li class="chatUser ${ userData.id === user.userId ? "thisUser" : ""}" id="${userData.id}" >
            <img class="profileImage" src="${userData.profileImage}" onerror="this.src='images/profiles/default.png';">
            <p class="userName" onClick={sendDirect("${userData.id}")}>${userData.user}</p>
        </li>`);
    },
    group(groupPeople){

    },

    directText(toUser, toDisplay, toImage){
        return(`
            <div id="directMessageBox" class="directBox">
                <div>
                    ${toImage}
                    <button class="close_btn" onClick={cancelDirect(event)}>x</button>
                    <h4>${toDisplay}</h4>
                    <input type='text' id='directText'>
                    <button id="sendDirect_btn" onClick={submitDirect("${toUser}")}>SEND</button>
                </div>
            </div>
        `);
    }

}