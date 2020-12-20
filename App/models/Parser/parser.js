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

exports.convertBaseToObject = function (dbUtils) {
    const relArr = ["Synonyms", "Antonyms", "Wordforms"];

    return model.returnAllNodesForParser(dbUtils.getSession())
        .then((result) => {

            return Promise.all(result.records.map(function(elem){
                var word = elem._fields[0];
                let Synonyms = model.findRelation(dbUtils.getSession(),word, "Synonym");
                let Antonyms = model.findRelation(dbUtils.getSession(),word, "Antonym");
                let Wordforms = model.findRelation(dbUtils.getSession(),word, "Wordform");
                return Promise.all([Synonyms, Antonyms , Wordforms]).then(values => { 

                    let RelObject = {};
          
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

            }))
            .then(values => {
                //console.log(values);
                return values
              })
              .catch(error => {
                console.log(error);
              });;
        }).then(values => {
            //console.log(values)
            return values;
        })
        .catch(error => {
            console.log(error);
        })

}


exports.convertObjectToBase = function(dbUtils, data) {


    return Promise.all(data.map((element) => {
        return model.createNode(dbUtils.getSession(),element.text);
    })).then(()=>{
        return Promise.all(data.map((elem) => {
            let Synonyms = Promise.all(elem.Synonyms.map((syn)=>{
                return model.createRelationParser(dbUtils.getSession(),elem.text,syn,"Synonym");
            }));
            let Antonyms = Promise.all(elem.Antonyms.map((ant)=>{
                return model.createRelationParser(dbUtils.getSession(),elem.text,ant,"Antonym");
            }))
            let Wordforms = Promise.all(elem.Wordforms.map((wordform)=>{
                return model.createRelationParser(dbUtils.getSession(),elem.text,wordform,"Wordform");
            }))
            return Promise.all([Synonyms,Antonyms,Wordforms]).catch(error => {
                console.log(error);
            });
        })).catch(error => {
            console.log(error);
        });
    }).catch(error => {
        console.log(error);
    });

}