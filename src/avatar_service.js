/*
 * Includes
 */
var http = require('http'),
    express = require('express'),
    cronJob = require('cron').CronJob,
    routes = require(__dirname + '/routes'),
    config = require(__dirname + '/config/');

/*
 * Create express app
 */
var app = express();

/*
 * Routing
 */
app.post('/add/:id', routes.addAvatar);
app.delete('/delete/:id', routes.deleteAvatar);
app.get('/:id', routes.getAvatar);


/*
 * Refresh avatars from queue
 * cron schedule
 */
new cronJob('*/5 * * * * *', function(){
    console.log('Time to look for an avatar to refresh');
    routes.refreshAvatar();
}, null, true);


/*
 * Launch app
 */
http.createServer(app).listen(config.port, function() {
   console.log('Twitter Avatar service started on port ' + config.port);
});
