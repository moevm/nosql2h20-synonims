var express = require('express');
var router = express.Router();
//var bodyParser = require('body-parser')

var model = require('../models/model')
var dbUtils = require('../neo4j/dbUtils')
var parser= require('../models/Parser/parser');
const { search } = require('../app');


//router.use(bodyParser.urlencoded({ extended: false}));
//router.use(bodyParser.json());


//const urlencodedParser = bodyParser.urlencoded({
//  extended: false,
//})



//parser.readData(dbUtils);


/* GET home page. */
router.get('/',  function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/', function(req, res, next) {
  if (!req.body) return res.sendStatus(400)

  
  if (req.headers.action == "search"){
    let answer = model.findNode(dbUtils.getSession(),req.body.text);
    answer.then((result) => {
      if (result.records.length != 0){
        res.sendStatus(200)
      }  
      else (res.sendStatus(204)) 
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(404)
    });

  }
  else if (req.headers.action == "add"){
    let answer = model.createNode(dbUtils.getSession(),req.body.text);
    answer.then((result) => {
      res.sendStatus(200);
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(404)
    });
  }
  else if (req.headers.action == "delete"){
    let answer = model.deleteNode(dbUtils.getSession(),req.body.text);
    answer.then((result) => {
      res.sendStatus(200);
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(404)
    });
  }
  
});


module.exports = router;
