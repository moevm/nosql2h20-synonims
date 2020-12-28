
var exportButton = document.getElementById("exportButton");

var fileInput = document.getElementById("fileInput");

let header = document.getElementById("header");
header.style.padding = "0 8%"


var invalidFeedback = document.getElementById("invalidFeedback");

var regexp = document.getElementById("regexp");
regexp.onkeyup = function tableSearch() {
    var table = document.getElementById('table');
    var regPhrase = new RegExp(regexp.value, 'i');
    var flag = false;
    for (var i = 1; i < table.rows.length; i++) {
        flag = false;
        for (var j = table.rows[i].cells.length - 1; j >= 0; j--) {
            flag = regPhrase.test(table.rows[i].cells[j].innerHTML);
            if (flag) break;
        }
        if (flag) {
            table.rows[i].style.display = "";
        } else {
            table.rows[i].style.display = "none";
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const getSort = ({ target }) => {
        const order = (target.dataset.order = -(target.dataset.order || -1));
        const index = [...target.parentNode.cells].indexOf(target);
        const collator = new Intl.Collator(['en', 'ru'], { numeric: true });
        const comparator = (index, order) => (a, b) => order * collator.compare(
            a.children[index].innerHTML,
            b.children[index].innerHTML
        );

        for(const tBody of target.closest('table').tBodies)
            tBody.append(...[...tBody.rows].sort(comparator(index, order)));

        for(const cell of target.parentNode.cells)
            cell.classList.toggle('sorted', cell === target);
    };

    document.querySelectorAll('.table_sort thead').forEach(tableTH => tableTH.addEventListener('click', () => getSort(event)));
})

fileInput.addEventListener("change", ()=>{
    //console.log(fileInput.files[0]);
    let file = fileInput.files[0]
    if (file == null){
        return
    }
    //fileLabel.innerText = file.name;
    if (file.type != "application/json"){
        fileInput.classList.remove("is-valid");
        fileInput.classList.add("is-invalid");
        invalidFeedback.innerText = "Please choose json file."
        invalidFeedback.style.display = "block"
        return
    }
    fileInput.classList.remove("is-invalid")
    fileInput.classList.add("is-valid");
    invalidFeedback.style.display = "none"


    let reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function() {
        console.log(reader.result);
        uploadFile(reader.result)
        .then((response) => {
            if (response.status != 200){
                invalidFeedback.innerText = "Error";
                invalidFeedback.style.display = "block";
            }
            invalidFeedback.style.display = "none"
            location.reload();
        })
        .catch((err) => console.error(err))
    
      };
    
      reader.onerror = function() {
        console.log(reader.error);
      };


    
})



exportButton.onclick = function(){
    getData()
        .then((response) => {
                response.blob().then((res) => {
                    console.log(res)
                    var link = document.createElement('a');
                    document.body.appendChild(link);
                    link.download = "database.json";
                    link.href = window.URL.createObjectURL(res);
                    link.click();
                    document.body.removeChild(link); 
                })

        })
        .catch((err) => console.error(err))
}


const uploadFile = async (data) => {
    const fetchResp = await fetch('/database', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
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

