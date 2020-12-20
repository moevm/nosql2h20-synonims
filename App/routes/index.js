var express = require('express');
var router = express.Router();

var model = require('../models/model')
var dbUtils = require('../neo4j/dbUtils')



/* GET home page. */
router.get('/',  function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/', function(req, res, next) {
  if (!req.body) return res.sendStatus(400)

  const relArr = ["Synonyms", "Antonyms", "Wordforms"];
  
  if (req.headers.action == "search"){


    model.findNode(dbUtils.getSession(),req.body.text)
    .then((result) => {
      if (result.records.length != 0){

        let Synonyms = model.findRelation(dbUtils.getSession(),req.body.text, "Synonym");
        let Antonyms = model.findRelation(dbUtils.getSession(),req.body.text, "Antonym");
        let Wordforms = model.findRelation(dbUtils.getSession(),req.body.text, "Wordform");

        Promise.all([Synonyms, Antonyms , Wordforms]).then(values => { 

          var relations = {};

          values.forEach((element,i) => {
            let relationList = [];
            element.records.forEach(elem => {
              relationList.push(elem._fields[0]);
            });
            relations[relArr[i]] = relationList;
          });

          res.send(JSON.stringify(relations))

        })
        .catch(error => {
          console.log(error);
          res.sendStatus(404)
        });

      }  
      else (res.sendStatus(204)) 
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(404)
    });

  }
  else if (req.headers.action == "add"){
    model.createNode(dbUtils.getSession(),req.body.text)
     .then((result) => {
      res.sendStatus(200);
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(404)
    });
  }
  else if (req.headers.action == "delete"){
    model.deleteNode(dbUtils.getSession(),req.body.text)
     .then((result) => {
      res.sendStatus(200);
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(404)
    });
  }

  else if (req.headers.action == "addRelation"){
    model.createRelation(dbUtils.getSession(),req.body.text1,req.body.text2,req.body.type)
    .then((result) => {
     res.sendStatus(200);
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(404)
    });
  }

  else if (req.headers.action == "deleteRelation"){
    model.deleteRelation(dbUtils.getSession(),req.body.text1,req.body.text2,req.body.type)
    .then((result) => {
     res.sendStatus(200);
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(404)
    });
  }
  
});


module.exports = router;
