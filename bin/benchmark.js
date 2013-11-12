'use strict';

var fs = require('fs');
var Benchmark = require('benchmark');
var Tld = require('../lib/tld.js');
var rules = {
  json: require(__dirname + '/../dist/rules.json'),
  text: fs.readFileSync(__dirname + '/../dist/rules.txt').toString()
};

var onComplete = function onComplete() {
  console.log(this.name, 'winner is ' + this.filter('fastest').pluck('name'));
};
var onCycle = function onCycle(event) {
  console.log(event.currentTarget.name + ' - ' + event.target);
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
  .run();


(new Benchmark.Suite('google.am'))
  .add(withJsonData({
    name: 'json',
    fn: function(tld){
      return function(){
        tld.getDomain('www.google.am');
      }
    }
  }))
  .add(withTextData({
    name: 'text',
    fn: function(tld){
      return function(){
        tld.getDomain('www.google.am');
      }
    }
  }))
  .on('cycle', onCycle)
  .on('complete', onComplete)
  .run();

(new Benchmark.Suite('google.com'))
  .add(withJsonData({
    name: 'json',
    fn: function(tld){
      return function(){
        tld.getDomain('www.google.com');
      }
    }
  }))
  .add(withTextData({
    name: 'text',
    fn: function(tld){
      return function(){
        tld.getDomain('www.google.com');
      }
    }
  }))
  .on('cycle', onCycle)
  .on('complete', onComplete)
  .run();

(new Benchmark.Suite('google.blogspot.jp'))
  .add(withJsonData({
    name: 'json',
    fn: function(tld){
      return function(){
        tld.getDomain('www.google.blogspot.jp');
      }
    }
  }))
  .add(withTextData({
    name: 'text',
    fn: function(tld){
      return function(){
        tld.getDomain('www.google.blogspot.jp');
      }
    }
  }))
  .on('cycle', onCycle)
  .on('complete', onComplete)
  .run();