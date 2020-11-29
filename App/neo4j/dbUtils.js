var env = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var neo4j = require('neo4j-driver');

var driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "12345678"));



exports.getSession = function () {
    return driver.session();
};

