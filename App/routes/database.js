var express = require('express');
var router = express.Router();


var model = require('../models/model')
var dbUtils = require('../neo4j/dbUtils')

var parser= require('../models/Parser/parser');



router.get('/',  function(req, res, next) {
    let relationsNum =  model.returnRelationNum(dbUtils.getSession());
    let nodes =  model.returnAllNodes(dbUtils.getSession());

    Promise.all([relationsNum, nodes]).then(values => { 
        relNum = values[0].records[0]._fields[0].toNumber();

        let nodeNum = 0;

        let nodeArr = [];


        values[1].records.forEach(element => {
            node = {text: element._fields[0], synonumNum: element._fields[1].toNumber(), antonymNum: element._fields[2].toNumber(), wordformNum: element._fields[3].toNumber()}
            nodeArr.push(node)
            nodeNum++;
        });;

        res.render('database',{nodeNum: nodeNum, relNum: relNum, nodeArr: nodeArr});
      })
      .catch(error => {
        console.log(error);
        res.sendStatus(404)
      });

});


router.get('/export',  function(req, res, next) {

  parser.convertBaseToObject(dbUtils)
    .then((data) => {
      //console.log(data)
      res.send(data);
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(404)
    });

});


router.post('/',  function(req, res, next) {  
  if (!req.body) return res.sendStatus(400)
  //console.log(req.body);
  parser.convertObjectToBase(dbUtils,req.body)
  .then(()=>{
    res.sendStatus(200);
  })
  .catch(error => {
    console.log(error);
    res.sendStatus(400);
  });
});


module.exports = router;