"use strict";

var Rule = require(__dirname + '/../rule.js');

function legacyJSONExport(xlds){
  var data = [];

  xlds.forEach(function(xld){
    data.push( new Rule(xld) );
  });

  return data;
}


module.exports = {
  build: legacyJSONExport,
  onSave: function(data){ return JSON.stringify(data); },
  filename: 'rules-legacy.json'
};