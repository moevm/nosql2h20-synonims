let header = document.getElementById("header");
header.style.padding = "0 8%"

var analysisButton = document.getElementById("analysisButton");
var analysisInput = document.getElementById("analysisInput");
var mynetwork = document.getElementById("mynetwork")
mynetwork.style.display = "none";




analysisButton.onclick = function(){
    let text = analysisInput.value;
    if (text == "") return;
    postText(text)
    .then((response) => {
        response.json().then((res) => {
            setGraph(res);
        })
    })
    .catch((err) => console.error(err))

    
    mynetwork.style.display = (mynetwork.style.display == "none") ? "block" : "none";

}

const postText = async (data) => {
    const fetchResp = await fetch('/analysis', {
        method: 'POST',
        body: data
    });
    if (!fetchResp.ok) {
        throw new Error(`Ошибка по адресу ${url}, статус ошибки ${fetchResp.status}`);
    }
    return fetchResp;
}

const relArr = ["Synonyms", "Antonyms", "Wordforms"];

function setGraph(graph){
    var nodes = [];
    graph.nodes.forEach(element => {
        nodes.push({ id: element, label: element, font: {
            size: 18,
            color: "black",
          }})
    });
    var nodes = new vis.DataSet(nodes);

    var edges = [];
    for(let i = 0; i < 3; i++){
        graph[relArr[i]].forEach(element => {
            let color;
            switch (i) {
                case 0:
                    color = "#008000"
                    break;
                case 1:
                    color = "#ff0000"
                    break;
                case 2:
                    color = "#8b00ff"
                    break;

            }
            edges.push({from: element[0], to: element[1], label: relArr[i].slice(0,-1), color: color});
        });
    }

    var edges = new vis.DataSet(edges);

      // create a network
      var container = document.getElementById("mynetwork");
      var data = {
        nodes: nodes,
        edges: edges
      };
      var options = {};
      var network = new vis.Network(container, data, {"physics": {"barnesHut": {"springLength":200, "springConstant": 0.04}}});

      mynetwork.style.display = "block";
}