document.addEventListener('DOMContentLoaded', () => {

    const ajaxSend = async (formData) => {
        const fetchResp = await fetch('/', {
            method: 'POST',
            headers: {
              'Action': 'search'
            },
            body: formData
        });
        console.log(formData.get("text"))
        if (!fetchResp.ok) {
            throw new Error(`Ошибка по адресу ${url}, статус ошибки ${fetchResp.status}`);
        }
        return await fetchResp.text();
    };

    var searchForm = document.getElementById("searchForm");

    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(searchForm);
        //console.log(formData.get("text"))

        ajaxSend(formData)
            .then((response) => {
                //console.log(response);
                searchForm.reset(); // очищаем поля формы 
            })
            .catch((err) => console.error(err))
    });

});