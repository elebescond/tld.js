'use strict';

var fs = require('fs');
var Benchmark = require('benchmark');
var Tld = require('../lib/tld.js');
var rules = {
  json: require(__dirname + '/../dist/rules.json'),
  text: fs.readFileSync(__dirname + '/../dist/rules.txt').toString()
};

var onComplete = function onComplete() {
  console.log('Fastest', this.name, 'is ' + this.filter('fastest').pluck('name'));
};
var onCycle = function onCycle(event) {
  console.log(String(event.target));
};

function withJsonData(config){
  var tld = Tld.init();

  return Benchmark.extend(config, {
    fn: config.fn(tld),
    onStart: function(){
      tld.rules = rules.json;
    }
  });
}

function withTextData(config){
  var tld = Tld.init();

  return Benchmark.extend(config, {
    fn: config.fn(tld),
    onStart: function(){
      tld.updateFromText(rules.text);
    }
  });
}

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


(new Benchmark.Suite('Tld w/o Sld'))
  .add(withJsonData({
    name: 'json',
    fn: function(tld){
      return function(){
        return tld.getRulesForTldJSON('am');
      }
    }
  }))
  .add(withTextData({
    name: 'text',
    fn: function(tld){
      return function(){
        tld.getRulesForTld('am');
      }
    }
  }))
  .on('cycle', onCycle)
  .on('complete', onComplete)
  .run({ async: true });

(new Benchmark.Suite('Tld with regular Sld'))
  .add(withJsonData({
    name: 'json',
    fn: function(tld){
      return function(){
        return tld.getRulesForTldJSON('com');
      }
    }
  }))
  .add(withTextData({
    name: 'text',
    fn: function(tld){
      return function(){
        tld.getRulesForTld('com');
      }
    }
  }))
  .on('cycle', onCycle)
  .on('complete', onComplete)
  .run();

(new Benchmark.Suite('Tld with a lot of rules Sld'))
  .add(withJsonData({
    name: 'json',
    fn: function(tld){
      return function(){
        return tld.getRulesForTldJSON('jp');
      }
    }
  }))
  .add(withTextData({
    name: 'text',
    fn: function(tld){
      return function(){
        tld.getRulesForTld('jp');
      }
    }
  }))
  .on('cycle', onCycle)
  .on('complete', onComplete)
  .run();