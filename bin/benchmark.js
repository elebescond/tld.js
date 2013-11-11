'use strict';

var fs = require('fs');
var Benchmark = require('benchmark');
var Tld = require('../lib/tld.js');
var rules = {
  json: require(__dirname + '/../dist/rules.json'),
  text: fs.readFileSync(__dirname + '/../dist/rules.txt').toString()
};
var instances = {
  json: null,
  text: null
};

var onComplete = function onComplete() {
  console.log('Fastest', this.name, 'is ' + this.filter('fastest').pluck('name'));
};
var onCycle = function onCycle(event) {
  console.log(String(event.target));
};

/*
 Constructor
 */
(new Benchmark.Suite('Constructor'))
  .add('json', function(){
    var tld = Tld.init();
    tld.rules = rules.json;
  })
  .add('text', function(){
    var tld = Tld.init();
    tld.updateFromText(rules.text);
  })
  .on('cycle', onCycle)
  .on('complete', onComplete)
  .run({ async: true });