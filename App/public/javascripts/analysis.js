let header = document.getElementById("header");
header.style.padding = "0 8%"

var analysisButton = document.getElementById("analysisButton");
var analysisInput = document.getElementById("analysisInput");
var mynetwork = document.getElementById("mynetwork")
mynetwork.style.display = "none";


analysisButton.onclick = function(){
    let text = analysisInput.textContent;
    console.log(text);

    
    mynetwork.style.display = (mynetwork.style.display == "none") ? "block" : "none";

}

