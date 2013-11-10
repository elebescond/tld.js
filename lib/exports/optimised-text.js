"use strict";

var Rule = require(__dirname + '/../rule.js');

/**
 * The optimised version works as following
 *
 * ```text
 * <Tld> <TldBit> <SldBit><Sld> <SldBit><Sld> …
 * ```
 *
 * Refer to Rule
 * @param xlds
 * @returns {Array}
 */
function optimisedTextExport(xlds){
  var data = {};

  xlds.forEach(function(xld){
    var rule = new Rule(xld);

    if (!data[rule.firstLevel]){
      data[rule.firstLevel] = [rule.firstLevel, rule.getFlag()];
    }

    if (rule.secondLevel){
      data[rule.firstLevel].push(rule.getFlag()+rule.secondLevel);
    }
  });

  // Compressing data
  return Object.keys(data).map(function(tld){
    return data[tld].join(' ');
  });
}


module.exports = {
  build: optimisedTextExport,
  onSave: function(data){ return data.join("\n"); },
  filename: 'rules.txt'
};