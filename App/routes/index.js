var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')

var model = require('../models/model')
var dbUtils = require('../neo4j/dbUtils')
var parser= require('../models/Parser/parser')


router.use(bodyParser.urlencoded({ extended: false}));
router.use(bodyParser.json());


const urlencodedParser = bodyParser.urlencoded({
  extended: false,
})


//parser.readData(dbUtils);


/* GET home page. */
router.get('/',  function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/', urlencodedParser, function(req, res, next) {
  if (!req.body) return res.sendStatus(400)
  //console.log(req.headers);
  console.log(req.body);
  if (req.headers.action = "search"){
    //console.log(req.body);
    //let result = model.findNode(dbUtils.getSession(),req.body.text);
    //console.log(result);
  }
  res.redirect('/');
});


module.exports = router;
