var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')

var Model = require('../models/model')
var dbUtils = require('../neo4j/dbUtils')
var parser= require('../models/Parser/parser')

const urlencodedParser = bodyParser.urlencoded({
  extended: false,
})


parser.readData(dbUtils);


/* GET home page. */
router.get('/',  function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', urlencodedParser, function(req, res, next) {
  if (!req.body) return res.sendStatus(400)
  //Model.create(dbUtils.getSession(),req.body.text)
  //Model.create(dbUtils.getSession(),req.body.text + "tttttt")
  console.log(req.body.text);
  console.log(req.body.text + "tttttt");
  Model.createRelation(dbUtils.getSession(),req.body.text,req.body.text + "tttttt", "Synonym");
  res.redirect('/');
});

module.exports = router;
