/*
 * Heroku deployment configuration
 */
var conf = {
    port: process.env.PORT || 3000, // App port
    default_ttl: '10080',           // Default TTL for entries
    default_key_prefix: 'avatar:',  // Default Redis key prefix
    twitter: {                      // Twiter credentials
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    },
    redis: {                        // Redis connection
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
} // End conf
module.exports.conf = conf;