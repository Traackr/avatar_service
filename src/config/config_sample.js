/*
 * Sample configuration
 */
var conf = {
    port: process.env.PORT || 3000, // App port
    default_ttl: '10080',           // Default TTL for entries
    default_key_prefix: 'avatar:',  // Default Redis key prefix
    twitter: {                      // Twiter credentials
        consumer_key: '',
        consumer_secret: '',
        access_token_key: '',
        access_token_secret: ''
    },
    redis: {                        // Redis connection
        host: '',
        port: ''
    }
} // End conf
module.exports.conf = conf;
