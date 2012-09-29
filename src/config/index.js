/* 
 * Determine environment and load matching config
 */
var env = process.argv[2] || process.env.NODE_ENV ||  'local';
var config = require(__dirname + '/config_'+env).conf;
console.log('Env configured to: ' + env);

module.exports = config;
