document.addEventListener('DOMContentLoaded', () => {

    var mainContent = document.getElementById("mainContent");


    const deleteSearchRes = () =>{
        let elem = document.getElementById("searchRes")
        if (elem != null){
            mainContent.removeChild(elem);
        }
    }


    const createForm = (option, word) =>{
        let resBlock = document.createElement("form");
        resBlock.className = "pt-5 form-inline";
        let formGroup = document.createElement("div");
        formGroup.className = "form-group";
        let label = document.createElement("label");
        label.for = "notFoundWord text-info";
        label.className = "notFoundLabel"
        let input = document.createElement("input");
        input.className = "form-control-plaintext notFoundInput"
        input.value = word;
        input.name = "word"
        input.id = "notFoundWord";
        input.type = "text";
        input.readOnly = true;
        let button = document.createElement("button");
        button.className = "btn mb-3"
        button.type = "submit";

        if (option == 1){
            label.innerHTML = "Найдено";
            button.innerText = "Удалить";
            button.classList.add("btn-danger");
        }
        else if(option == 2){
            label.innerHTML = "Слово не найдено";
            button.innerText = "Добавить слово";
            button.classList.add("btn-success");
        }


        formGroup.appendChild(label);
        formGroup.appendChild(input);


        resBlock.appendChild(formGroup);
        resBlock.appendChild(button);

        return resBlock;
    }


    const createList = (type, arr) => {
        console.log(arr);
        let result = document.createElement("div");
        let label = document.createElement("h4")
        label.innerText = "type";
        let list = document.createElement("ul")
        list.className = "list-group";
        list.classList.add(type)

        arr.forEach(element => {
            item = document.createElement("li");
            item.className = "list-group-item"
            item.innerText = element;
            list.appendChild(item);
        });
        
        if (type == "Synonyms"){
            label.innerText = "Синонимы";
        }
        else if (type == "Antonyms"){
            label.innerText = "Антонимы";
        }
        else if (type == "Wordforms"){
            label.innerText = "Словоформы";
        }


    

        result.appendChild(label);
        result.appendChild(list)

        return result
    }

    const wordFound = (word, relationList) =>{
        let form = createForm(1, word);

        form.addEventListener('submit', function (e) {
            e.preventDefault();
    
            if (form.word.value == ""){
                return
            }
            var data = {text: form.word.value};
            
            ajaxSend(data, "delete")
                .then((response) => {
                    deleteSearchRes();
                    if(response.status == 200){
                        wordNotFound(form.word.value);
                    }
                })
                .catch((err) => console.error(err))
        });

        console.log(relationList);
        //relationList = JSON.parse(relationList);
        let searchRes = document.createElement("div");
        searchRes.id = "searchRes"
        searchRes.appendChild(form);

        const relArr = ["Synonyms", "Antonyms", "Wordforms"];

        let words = document.createElement("div");
        words.className = "row pt-5";
        relArr.forEach(element => {
            let col = document.createElement("div");
            col.className = "col-sm";
            col.appendChild(createList(element,relationList[element]));
            words.appendChild(col);
        });

        searchRes.appendChild(words);


        mainContent.appendChild(searchRes);
    }


    const wordNotFound = (word) =>{

        let form = createForm(2, word);

        form.addEventListener('submit', function (e) {
            e.preventDefault();
    
            if (form.word.value == ""){
                return
            }
            var data = {text: form.word.value};
            
    
            ajaxSend(data, "add")
                .then((response) => {
                    deleteSearchRes();
                    if(response.status == 200){
                        wordFound(form.word.value);
                    }
                    
                })
                .catch((err) => console.error(err))
        });


        form.id = "searchRes"
        mainContent.appendChild(form);
        
    }


    const ajaxSend = async (data, action) => {
        const fetchResp = await fetch('/', {
            method: 'POST',
            headers: {
            'content-type': 'application/json',
              'Action': action
            },
            body: JSON.stringify(data)
        });
        if (!fetchResp.ok) {
            throw new Error(`Ошибка по адресу ${url}, статус ошибки ${fetchResp.status}`);
        }
        return fetchResp;
    };


    var searchForm = document.getElementById("searchForm");

    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (searchForm.text.value == ""){
            return
        }
        var data = {text: searchForm.text.value};

        ajaxSend(data,"search")
            .then((response) => {
                deleteSearchRes();
                if (response.status == 204){
                    wordNotFound(searchForm.text.value);
                }
                else {
                    response.json().then((res)=>{
                        wordFound(searchForm.text.value, res);
                    })
                }
                //searchForm.reset(); // очищаем поля формы 
            })
            .catch((err) => console.error(err))
    });

});