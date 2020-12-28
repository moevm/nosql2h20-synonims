var express = require('express');
var router = express.Router();

var model = require('../models/model')
var dbUtils = require('../neo4j/dbUtils')


const relArr = ["Synonyms", "Antonyms", "Wordforms"];

router.get('/',  function(req, res, next) {
    res.render('analysis');
});




router.post('/',  function(req, res, next) {  
  if (!req.body) return res.sendStatus(400);
  let wordArr = tokenize(req.body);

  
  Promise.all(wordArr.map(element => {
    return model.findNode(dbUtils.getSession(),element).then((result) => {
      if (result.records.length != 0){
        let word = result.records[0]._fields[0];
        
        let Synonyms = model.findRelation(dbUtils.getSession(),word, "Synonym");
        let Antonyms = model.findRelation(dbUtils.getSession(),word, "Antonym");
        let Wordforms = model.findRelation(dbUtils.getSession(),word, "Wordform");
        return Promise.all([Synonyms, Antonyms , Wordforms]).then((values) => {
          let RelObject = {}
          
          values.forEach((element,i) => {
            let relationList = [];
            element.records.forEach(elem => {
              relationList.push(elem._fields[0]);
            });
            RelObject[relArr[i]] = relationList;
          });


          return RelObject
        }).then(result => {
          result.text = word;
          return result             
        })
        .catch(error => {
            console.log(error);
        });
      }
      else return null;
    }).then((res) => {return res})
    .catch(error => {
      console.log(error);
  });
  })).then((values) => {
    let graph = {}
    graph.nodes = [];
    for (let i= 0; i< 3; i++){
      graph[relArr[i]] = [];
    }
    values.forEach(element => {
      if (element != null){
        graph.nodes.push(element.text);
      }
    });
    values.forEach(word => {
      if (word != null){
        for (let i= 0; i< 3; i++){
          
          word[relArr[i]].forEach(element => {
            if (graph.nodes.includes(element)){
                graph[relArr[i]].push([word.text,element])
            }
          }
          );
        }
      }
    });
    res.send(graph);
  })
  .catch(error => {
    console.log(error);
    res.sendStatus(404);
});
  

});


function tokenize(text){
  var Az = require('az');
  var tokens = Az.Tokens(text).done(["WORD"]);
  var wordArr = new Set();
  tokens.forEach(token => {
    let word = token.toString().toLowerCase();
    if (word.length > 2){
      wordArr.add(token.toString().toLowerCase());
    }
  });

  return Array.from(wordArr);
}

module.exports = router;