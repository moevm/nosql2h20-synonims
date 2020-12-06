var env = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var neo4j = require('neo4j-driver');

var driver = neo4j.driver(config.neo4j, neo4j.auth.basic(config.username, config.password));



exports.getSession = function () {
    return driver.session();
};

