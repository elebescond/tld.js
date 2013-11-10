"use strict";

var fs = require('fs');
var tld = require('./lib/tld.js').init();

tld.updateFromText(fs.readFileSync('./dist/rules.txt').toString());

module.exports = tld;
