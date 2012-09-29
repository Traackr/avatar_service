
/*
 * Defines functions used for routes
 */

var url = require('url'),
    querystring = require('querystring'),
    config = require(__dirname + '/../config/'),
    default_ttl = config.default_ttl,
    avatar_service = require(__dirname + '/../lib/').AvatarService;


/*
 * Add/update an avatar
 */
module.exports.addAvatar = function(req, res) {

    if ( req.params.id ) {
        console.log('Adding ID: ' + req.params.id);
    }
    var id = req.params.id;
    var query_params = querystring.parse(url.parse(req.url).query);

    console.log('Adding/updating entry: ' + id);

    var ttl = query_params.ttl || default_ttl;
    console.log('Setting TTL to: ' + ttl);

    // Twitter
    var avatar = null;
    if ( query_params.twitter ) {
        console.log('Found Twitter handle: ' + query_params.twitter);
        avatar = avatar_service.addAvatarWithTwitter(id, query_params.twitter, ttl);
        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify(avatar));
    }
    // Image URL
    else if ( query_params.url_http ) {
        console.log('Found image URL: ' + query_params.url_http);
        avatar = avatar_service.addAvatarWithImageUrl(id, query_params.url_http, ttl);
        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify(avatar));
    }
    // Missing param
    else {
        console.log('No \'twitter\' or \'url_http\' parameter specified');
        res.writeHead(400, {
            "Content-Type": "application/json"
        });
        res.end('{"error": "Missing parameter"}');
    }
}; // End addAvatar


/*
 * Delete an avatar entry
 */
module.exports.deleteAvatar = function(req, res) {
    var id = req.params.id;
    console.log('Deleting entry: ' + id);

    avatar_service.deleteAvatar(id);

    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    res.end('{"msg": "Entry deleted: ' + id + '"}');
}; // End deleteAvatar


/*
 * Get an avatar entry
 */
module.exports.getAvatar = function(req, res) {

    var id = req.params.id;
    var query_params = querystring.parse(url.parse(req.url).query);

    var size = query_params.s || 'n';
    avatar_service.getAvatar(id, size,
        function(avatar, redirect_url) {
            if ( query_params.debug ) {
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify(avatar));
            }
            else {
                res.writeHead(302, { 'Location': redirect_url });
                res.end();
            }
        },
        function() {
            if ( query_params.debug ) {
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });
                res.end('{"msg": "Entry not found: ' + id + '"}');
            }
            else {
                res.writeHead(404);
                res.end();
            }
        });
}; // End getAvatar


/*
 * Refresh an expired avatar (from the queue)
 */
module.exports.refreshAvatar = function() {

     avatar_service.refreshAvatar();

 }; // End refreshAvatar