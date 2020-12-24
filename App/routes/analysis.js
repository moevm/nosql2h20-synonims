var express = require('express');
var router = express.Router();

var model = require('../models/model')
var dbUtils = require('../neo4j/dbUtils')


router.get('/',  function(req, res, next) {
    res.render('analysis');
});




router.post('/',  function(req, res, next) {  
  if (!req.body) return res.sendStatus(400)

});


module.exports = router;