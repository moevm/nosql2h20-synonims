//const fs = require('fs');

//file = `${__dirname}/synmaster.txt`;

var model = require('../model')

/*

exports.readData = function (dbUtils) {
    fs.readFile(file,"utf8", function(error,data){
        if(error) throw error;
        var lines = data.split('\n');
        var len = 0;
        for (let i = 0; i < lines.length; i++){
            var wordsArr = lines[i];
            if (wordsArr[wordsArr.length-1] == "\r"){
                wordsArr = wordsArr.slice(0,-1)
            }
            wordsArr = wordsArr.split("|");
            for (let j = 1; j < wordsArr.length; j++){
                Model.createRelation(dbUtils.getSession(), wordsArr[0], wordsArr[j], "Synonym");
            }
            len++;
            if (len % 1000 == 0){
                console.log(len);
            }
        }
    });
};

*/

exports.convertBaseToObject = async function (dbUtils) {
    const relArr = ["Synonyms", "Antonyms", "Wordforms"];

    return await model.returnAllNodesForParser(dbUtils.getSession())
        .then((result) => {
            var data = [];
            Promise.all(result.records.map(function(elem){
                elem
            }))
            .then(values => {
                console.log(values);
              })
              .catch(error => {
                console.log(error);
              });;
            /*
            result.records.forEach(element => {
                let word = element._fields[0];

                //console.log(word);
                let Synonyms = model.findRelation(dbUtils.getSession(),word, "Synonym");
                let Antonyms = model.findRelation(dbUtils.getSession(),word, "Antonym");
                let Wordforms = model.findRelation(dbUtils.getSession(),word, "Wordform");
                Promise.all([Synonyms, Antonyms , Wordforms]).then(values => { 

                    let RelObject = {};
          
                    values.forEach((element,i) => {
                      let relationList = [];
                      element.records.forEach(elem => {
                        relationList.push(elem._fields[0]);
                      });
                      RelObject[relArr[i]] = relationList;
                    });
          
                    return RelObject
          
                  }).then
                  .catch(error => {
                    console.log(error);
                  });
                

            });
            */
        })
        .catch(error => {
            console.log(error);
        })

}