"use strict";

var request = require('request');
var fs = require('fs');
var parser = require(__dirname + '/../parsers/publicsuffix-org.js');

module.exports = function(grunt){
  var _ = grunt.util._;
  var async = grunt.util.async;

  /**
   *
   * @param {string} key
   * @return {object}
   */
  function computeConfiguration(key){
    var config = grunt.config.get(key || 'update') || {};
    var defaultConfig = require(__dirname + '/defaults.json');

    return _.extend(defaultConfig, config);
  }

  /**
   *
   * @param {string} provider
   * @param {object} config
   * @return {string}
   */
  function computeProvider(provider, config){
    var defaultProvider = config.default_provider;

    return provider && config.providers[provider] ? provider : defaultProvider;
  }

  grunt.registerTask('update', function tldUpdate(provider){
    var config, cacheFileLocation = __dirname + '/../../dist/rules.dat';

    config = computeConfiguration(this.name);
    provider = computeProvider(provider, config);

    async.waterfall([
      /*
       1. Download or read the local cache
       */
      function downloadData(done){
        fs.exists(cacheFileLocation, function(exists){
          if (exists){
            done();
          }
          else{
            grunt.log.writeln('Downloading rules from remote ['+ config.providers[provider] +']');
            request.get(config.providers[provider]).pipe(fs.createWriteStream(cacheFileLocation)).on('end', done);
          }
        });
      },

      /*
       2. Loading data from local cache
       */
      function loadingData(done){
        grunt.log.writeln('Loading rules from cache.');
        fs.readFile(cacheFileLocation, done);
      },

      /*
       3. Writing the several config files
       */
      function parseAndWrite(data, done) {
        var queue, tlds;

        tlds = parser.parse(data);
        queue = async.queue(function(exportTask, callback){
          var task_result = exportTask(tlds);
          var filename = task_result[0];
          var data = task_result[1];

          data = JSON.stringify(data);

          grunt.log.writeln('Writing rules in dist/'+filename);
          grunt.file.write('dist/'+filename, data);

          callback();
        }, 5);

        queue.drain = done;
        queue.push(require(__dirname + '/../exports/index.js'));
      }
    ], this.async());
  });
};