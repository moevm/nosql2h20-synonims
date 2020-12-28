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
        label.for = "foundWord text-info";
        label.className = "foundLabel"
        let input = document.createElement("input");
        input.className = "form-control-plaintext foundInput zero-border"
        input.value = word;
        input.name = "word"
        input.id = "foundWord";
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


    const createRelForm = (text, option, id) => {

        let item_form = document.createElement("form")
        item_form.className = "form w-100";

        let input_form_group = document.createElement("div");
        input_form_group.className = "input-group"

        let input_form = document.createElement("input");
        input_form.type = "text";
        input_form.name = "text";

        let input_form_group_append = document.createElement("div");
        input_form_group_append.className = "input-group-append";

        let button_form_delete = document.createElement("button");
        button_form_delete.type = "submit";


        if (option == "add"){
            input_form.className = "form-control zero-border";
            input_form.placeholder = "Добавить новый"
            input_form["aria-describedby"] = "button-addon" + id;
            button_form_delete.className = "btn btn-outline-success zero-border";
            button_form_delete.innerText = "+"
            button_form_delete.id = "button-addon" + id;

        }
        else {
            input_form.readOnly = true;
            input_form.className = "zero-border form-control-plaintext side-padding";
            input_form.value = text;
            input_form["aria-describedby"] = "button-addon" + text + id;
            button_form_delete.className = "btn btn-outline-danger zero-border";
            button_form_delete.innerText = "-"
            button_form_delete.id = "button-addon" + text + id;

        }


        input_form_group_append.appendChild(button_form_delete);

        input_form_group.appendChild(input_form);
        input_form_group.appendChild(input_form_group_append);

        item_form.appendChild(input_form_group);


        return item_form;
    }


    const createList = (type, arr) => {
        let result = document.createElement("div");
        let label = document.createElement("h4")
        label.innerText = "type";
        let list = document.createElement("ul")
        list.id = type
        list.className = "list-group";
        list.classList.add(type)

        arr.forEach((element, i) => {
            let item = document.createElement("li");
            item.className = "list-group-item zero-padding"

            let item_form = createRelForm(element, "delete", type);

            item_form.addEventListener('submit', function (e) {
                e.preventDefault();
        
                let text = item_form.text.value;
    
                var data = {text1 : document.getElementById("foundWord").value ,text2: text, type: item_form.parentNode.parentNode.id.slice(0, -1)};
        
                ajaxSend(data,"deleteRelation")
                .then((response) => {
                    item_form.parentNode.parentNode.removeChild(item_form.parentNode)
                })
                .catch((err) => console.error(err))
    
            });


            item.appendChild(item_form);

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


        let item_add = document.createElement("li");
        item_add.className = "list-group-item zero-padding"


        let form_add = createRelForm("", "add", type);

        form_add.addEventListener('submit', function (e) {
            e.preventDefault();

            let text = form_add.text.value;

            if (text == ""){
                return
            }

            let nodeList = form_add.parentNode.parentNode.childNodes;


            for (let i = 0; i < nodeList.length -1; i++){
                if (nodeList[i].firstChild.text.value == text){
                    console.log("repeat")
                    return
                }
            }

            let type = form_add.parentNode.parentNode.id;

            var data = {text1 : document.getElementById("foundWord").value ,text2: text, type: type.slice(0, -1)};
    
            ajaxSend(data,"addRelation")
            .then((response) => {
                let item = document.createElement("li");
                item.className = "list-group-item zero-padding"
                let item_form  = createRelForm(text,"delete", type)

                item_form.addEventListener('submit', function (e) {
                    e.preventDefault();
            
                    let text = item_form.text.value;
        
                    var data = {text1 : document.getElementById("foundWord").value ,text2: text, type: item_form.parentNode.parentNode.id.slice(0, -1)};
            
                    ajaxSend(data,"deleteRelation")
                    .then((response) => {
                        item_form.parentNode.parentNode.removeChild(item_form.parentNode)
                    })
                    .catch((err) => console.error(err))
        
                });
                item.appendChild(item_form);
                form_add.parentNode.parentNode.insertBefore(item, form_add.parentNode)
                form_add.reset();
            })
            .catch((err) => console.error(err))

        });

        item_add.appendChild(form_add)

        list.appendChild(item_add);
        
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
                    wordFound(form.word.value, {Synonyms: [], Antonyms: [], Wordforms: []})
                    
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
        var word = searchForm.text.value.toLowerCase();
        var data = {text: word};

        ajaxSend(data,"search")
            .then((response) => {
                deleteSearchRes();
                if (response.status == 204){
                    wordNotFound(word);
                }
                else {
                    response.json().then((res)=>{
                        wordFound(word, res);
                    })
                }
                //searchForm.reset(); // очищаем поля формы 
            })
            .catch((err) => console.error(err))
    });

});