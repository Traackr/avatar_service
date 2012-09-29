/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var config = require(__dirname + '/../config'),
    default_key_prefix = config.default_key_prefix,
    redis = require('redis'),
    redis_client = redis.createClient(
        config.redis.port, config.redis.host),
    twitter = require('ntwitter'),
    twitter_client = new twitter({
        consumer_key: config.twitter.consumer_key,
        consumer_secret: config.twitter.consumer_secret,
        access_token_key: config.twitter.access_token_key,
        access_token_secret: config.twitter.access_token_secret
    });

/*
 * Avatar Service object
 */
var AvatarService = {

    addAvatarWithTwitter: function(id, twitter, ttl) {

        console.log('Adding/updating entry: ' + id);
        console.log('Twitter handle: ' + twitter);

        // Create key for entry to add/update
        var key = default_key_prefix+id;

        // Calculate expire. Expire immedidaly since twitter info has
        // not been retrieved yet
        var expire_on = new Date().getTime(); // milliseconds
        console.log('Expire on: ' + new Date(expire_on));

        // Create avatar object.
        var avatar = {
            twitter_handle : twitter,
            ttl            : ttl,
            expire_on_time : expire_on,
            expire_on      : new Date(expire_on).toISOString()
         };

         // Add avatar to cache
         redis_client.set(key, JSON.stringify(avatar));
         
         // Update Twitter info (async)
         AvatarService.updateTwitter(id, key, avatar);

        return avatar;
    },

    addAvatarWithImageUrl: function(id, url_http, ttl) {

        console.log('Adding/updating entry: ' + id);
        console.log('Image URL: ' + url_http);

        // Create key for entry to add/update
        var key = default_key_prefix+id;

        // Calculate exipire
        var expire_on = new Date().getTime() + (ttl * 60 * 1000); // milliseconds
        console.log('Expire on: ' + new Date(expire_on));

        // Create avatar object
        var avatar = {
            original_avatar_url_http : url_http,
            small_avatar_url_http    : url_http,
            normal_avatar_url_http   : url_http,
            big_avatar_url_http      : url_http,
            ttl                      : ttl,
            expire_on_time           : expire_on,
            expire_on                : new Date(expire_on).toISOString()
         };

         // Add avatar to cache
         redis_client.set(key, JSON.stringify(avatar));

         return avatar;
    },

    getAvatar: function(id, size, successCallback, errorCallback) {

        console.log('Getting entry: ' + id);

        redis_client.get(default_key_prefix+id, function(err, entry){
            if ( entry == null ) {
                console.log('Entry not found');
                errorCallback();
                //res.writeHead(404);
                //res.end();
            }
            else {
                console.log('Entry found');
                var avatar = JSON.parse(entry);
                console.log('Expire on: ' + new Date(avatar.expire_on_time));
                if ( new Date().getTime() > avatar.expire_on_time ) {
                    console.log('Entry expired.');
                    if ( avatar.twitter_handle ) {
                        console.log('Entry uses Twitter. Adding entry to refresh queue');
                        // Push to the right on the queueu
                        redis_client.rpush('avatar_refresh_queue', id);
                    }
                }
                var redirect_url = null;
                if ( size == 'n' && avatar.normal_avatar_url_http )
                    redirect_url = avatar.normal_avatar_url_http
                if ( size == 's' && avatar.small_avatar_url_http )
                    redirect_url = avatar.small_avatar_url_http
                if ( size == 'b' && avatar.big_avatar_url_http )
                    redirect_url = avatar.big_avatar_url_http
                if ( size == 'o' && avatar.original_avatar_url_http )
                    redirect_url = avatar.original_avatar_url_http
                if ( redirect_url ) {
                    if ( successCallback) successCallback(avatar, redirect_url)
                    //res.writeHead(302, { 'Location': redirect_url });
                    //res.end();
                }
                else {
                    if ( errorCallback ) errorCallback();
                    //res.writeHead(404);
                    //res.end();
                }
            }

        });
    },

    deleteAvatar: function(id) {

        console.log('Deleting entry: ' + id);
        redis_client.del(default_key_prefix+id);
    },


    updateTwitter: function(id, key, avatar) {
         console.log('Calling Twitter API to retrieve image info for user: ' + avatar.twitter_handle);
         twitter_client.get('/users/show.json',
            {screen_name: avatar.twitter_handle},
            function(err, data) {
                if ( err ) {
                    console.log('Error calling Twitter.');
                    console.log('Putting entry back on the queue: ' + id);
                    // Push to the right on the queueu
                    redis_client.rpush('avatar_refresh_queue', id);
                }
                else {
                    console.log('Twitter profile data for: ' + data.name + ' (@' + data.screen_name + ')');
                    avatar.normal_avatar_url_http = data.profile_image_url;
                    avatar.small_avatar_url_http =
                        data.profile_image_url.replace(/(.+)_normal\.([a-zA-Z]{3})/, "$1_mini.$2");
                    avatar.big_avatar_url_http =
                        data.profile_image_url.replace(/(.+)_normal\.([a-zA-Z]{3})/, "$1_bigger.$2");
                    avatar.original_avatar_url_http =
                        data.profile_image_url.replace(/(.+)_normal\.([a-zA-Z]{3})/, "$1.$2");
                    // Calculate expire date
                    var exp = new Date().getTime() + (avatar.ttl * 60 * 1000); // milliseconds
                    avatar.expire_on_time = exp;
                    avatar.expire_on = new Date(exp).toISOString();
                    console.log('Entry: ' + key + ' - Set expire on: ' + new Date(exp));
                    // Add avatar to cache
                    redis_client.set(key, JSON.stringify(avatar));
                }
            }
        ); // End twitter REST API call
    },


    refreshAvatar: function() {
        // Pop from the left on the queue
        redis_client.lpop('avatar_refresh_queue', function(err, id){
            if ( id != null ) {
                var key = default_key_prefix + id;
                console.log('Found entry: '+ id);
                redis_client.get(default_key_prefix+id, function(err, value){
                    if ( value == null ) {
                        console.log('Entry does not exists anymore: avatar:'+id);
                    }
                    else {
                        var avatar = JSON.parse(value);
                        if ( new Date().getTime() > avatar.expire_on_time ) {
                            console.log('Entry is still expired: ' + avatar.expire_on);
                            if ( avatar.twitter_handle ) {
                                console.log('Entry uses Twitter. Getting latest data.');
                                AvatarService.updateTwitter(id, key, avatar);
                            }
                            else {
                                console.log('Entry does not use Twitter. Skipping');
                            }
                        }
                        else {
                            console.log('Entry has been updated');
                        }
                    }
                });
            }
        });
    },

    clearRefreshQueue: function() {
        redis_client.ltrim('avatar_refresh_queue', 1, 0)
    }

} // End AvatarService object

module.exports.service = AvatarService;