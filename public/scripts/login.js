const testImage = document.getElementById("testImage");
const defaultImage = "images/profiles/default.png";

document.getElementById("profile_image").addEventListener("blur", () =>{
    let tryImage = document.getElementById("profile_image").value;
    let errors = true;
    
    testImage.classList.remove("hidden");
    testImage.onerror = () =>{ 
        testImage.src = defaultImage;
    } 
    if( tryImage.indexOf(".png") > 0 || 
        tryImage.indexOf(".jpg") > 0 || 
        tryImage.indexOf(".jpeg")> 0 || 
        tryImage.indexOf(".gif") > 0){
        errors = false;
    } 
    if( !errors ){ testImage.src = tryImage; } 
});

document.getElementById("loginForm").addEventListener("submit", (event) =>{ 
    let displayName = escape(document.getElementById("display_name").value);
    document.getElementById("profile_image").value = document.getElementById("testImage").src;
    if( displayName.trim().length < 1){ 
        event.preventDefault(); 
    }
});