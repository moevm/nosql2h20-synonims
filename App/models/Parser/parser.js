const fs = require('fs');

file = `${__dirname}/synmaster.txt`;

var Model = require('../model')



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