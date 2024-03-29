const sanitize = (toSanitize) => {
    let newString = "";
    if (!toSanitize || !toSanitize.length) return newString
    for(let i=0; i < toSanitize.length; i++){
        let sanObject = {
            "<" : "&lt;",
            ">" : "&gt;",
            "&" : "&amp;",
            '"' : "&quot;",
            "'" : "	&apos;"
        };
        if( sanObject[toSanitize[i]] ){
            newString = newString + sanObject[toSanitize[i]];
        } else{
            newString = newString + toSanitize[i];
        } 
    } 
    return newString;
}

module.exports = sanitize;