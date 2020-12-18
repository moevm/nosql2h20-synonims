var importButton = document.getElementById("importButton");
var exportButton = document.getElementById("exportButton");

var fileInput = document.getElementById("chooseFileInput");

var fileLabel = document.getElementById("fileLabel");

var invalidFeedback = document.getElementById("invalidFeedback");

var mainFile;


fileInput.addEventListener("change", ()=>{
    console.log(fileInput.files[0]);
    let file = fileInput.files[0]
    mainFile = null;
    if (file == null){
        return
    }
    fileLabel.innerText = file.name;
    if (file.type != "application/json"){
        fileInput.classList.remove("is-valid");
        fileInput.classList.add("is-invalid");
        invalidFeedback.style.display = "block"
        return
    }
    fileInput.classList.remove("is-invalid")
    fileInput.classList.add("is-valid");
    invalidFeedback.style.display = "none"
    mainFile = file;
    
})


exportButton.onclick = function(){
    if (mainFile == null){
        return;
    }

    getData()
        .then((response) => {
            console.log(response.status);
        })
        .catch((err) => console.error(err))
}

importButton.onclick = function(){
    if (mainFile == null){
        return;
    }

    const data = new FormData();
    data.append('file', mainFile);

    console.log(data);

    uploadFile(data)
        .then((response) => {
            console.log(response.status);

        })
        .catch((err) => console.error(err))

};


const uploadFile = async (data) => {
    const fetchResp = await fetch('/database', {
        method: 'POST',
        body: data
    });
    if (!fetchResp.ok) {
        throw new Error(`Ошибка по адресу ${url}, статус ошибки ${fetchResp.status}`);
    }
    return fetchResp;
}

const getData = async () => {
    const fetchResp = await fetch('/database/export', {
        method: 'GET'
    });
    if (!fetchResp.ok) {
        throw new Error(`Ошибка по адресу ${url}, статус ошибки ${fetchResp.status}`);
    }
    return fetchResp;
}