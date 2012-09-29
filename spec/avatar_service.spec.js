
// Service instance
var service = require(__dirname + '/../src/lib/').AvatarService;


var runner = jasmine.getEnv().currentRunner();
var oldCallback = runner.finishCallback;
runner.finishCallback = function () {
    oldCallback.apply(this, arguments);
    process.exit(0);
};

describe("Avatar Service - Add/Update", function() {

    // Tear down
    afterEach(function() {
        service.deleteAvatar('00000');
        service.clearRefreshQueue();
    });

    // Test add with image
    // When adding with an image, avatar is added to cache right
    // away and all image sizes use the same image
    it('Add avatar with image', function() {
        var avatar = service.addAvatarWithImageUrl('00000', 'http://cnn.com', '9999');
        expect(avatar).not.toBeNull();
        
        expect(avatar.ttl).toEqual('9999');

        // Check expire_on. allow 100ms between now and and it was computed
        var expire = new Date().getTime()+ (avatar.ttl * 60 * 1000); // milliseconds
        expect(avatar.expire_on_time).toBeDefined();
        expect(expire - avatar.expire_on_time).toBeLessThan(100);
        expect(avatar.expire_on).toBeDefined();
        expect(avatar.expire_on).toEqual(new Date(avatar.expire_on_time).toISOString());

        expect(avatar.original_avatar_url_http).toEqual('http://cnn.com');
        expect(avatar.small_avatar_url_http).toEqual('http://cnn.com');
        expect(avatar.normal_avatar_url_http).toEqual('http://cnn.com');
        expect(avatar.big_avatar_url_http).toEqual('http://cnn.com');
    });

    // Test add with twitter. Images are not set in the object returned
    it('Add avatar with Twitter', function() {
        var avatar = service.addAvatarWithTwitter('00000', 'dchancogne', '9999');
        expect(avatar).not.toBeNull();
        expect(avatar.ttl).toEqual('9999');

        // Check expire_on. Avatat object returned to expire immediatly
        // since twitter image has not been added yet
        var expire = new Date().getTime();
        expect(avatar.expire_on_time).toBeDefined();
        expect(expire - avatar.expire_on_time).toBeLessThan(100);
        expect(avatar.expire_on).toBeDefined();
        expect(avatar.expire_on).toEqual(new Date(avatar.expire_on_time).toISOString());

        expect(avatar.original_avatar_url_http).not.toBeDefined();
        expect(avatar.small_avatar_url_http).not.toBeDefined();
        expect(avatar.normal_avatar_url_http).not.toBeDefined();
        expect(avatar.big_avatar_url_http).not.toBeDefined();
    });

}); // End suite add/update


describe("Avatar Service - Get", function() {

    // Tear down
    afterEach(function() {
        service.deleteAvatar('00000');
        service.clearRefreshQueue();
    });

    it('Retrieve avatar - URL Image', function() {
        service.addAvatarWithImageUrl('00000', 'http://cnn.com', '9999');

        var found_avatar = false;
        var avatar = null;
        var url = null;
        // run getAvatar()
        runs(function() {
            service.getAvatar('00000', 'o',
                function(a, u) {found_avatar = true; avatar = a; url = u;},
                function() {found_avatar = false}
            );
        });
        // Wait for result
        waitsFor(function() { return found_avatar }, "Getting added avatar", 500);

        // Test results
        runs(function() {
            expect(avatar).not.toBeNull();
            expect(url).not.toBeNull();
            expect(url).toEqual('http://cnn.com');
            expect(avatar.ttl).toEqual('9999');

            // Check expire_on. allow 100ms between now and and it was computed
            var expire = new Date().getTime()+ (avatar.ttl * 60 * 1000); // milliseconds
            expect(avatar.expire_on_time).toBeDefined();
            expect(expire - avatar.expire_on_time).toBeLessThan(100);
            expect(avatar.expire_on).toBeDefined();
            expect(avatar.expire_on).toEqual(new Date(avatar.expire_on_time).toISOString());

            expect(avatar.original_avatar_url_http).toEqual('http://cnn.com');
            expect(avatar.small_avatar_url_http).toEqual('http://cnn.com');
            expect(avatar.normal_avatar_url_http).toEqual('http://cnn.com');
            expect(avatar.big_avatar_url_http).toEqual('http://cnn.com');
        });
        
    });

    it('Retrieve avatar - Twitter', function() {
        service.addAvatarWithTwitter('00000', 'dchancogne', '9999');
        
        var found_avatar = false;
        var avatar = null;
        var url = null;
        // run getAvatar()
        waitsFor(
            function() {
                service.getAvatar('00000', 'o',
                    function(a, u) {found_avatar = true; avatar = a; url = u;},
                    function() { }
                );
                return found_avatar
            },
            "Getting added avatar", 500);

        // Test results
        runs(function() {
            expect(avatar).not.toBeNull();
            expect(url).not.toBeNull();
            expect(avatar.ttl).toEqual('9999');

            // Check expire_on. allow 100ms between now and and it was computed
            var expire = new Date().getTime()+ (avatar.ttl * 60 * 1000); // milliseconds
            expect(avatar.expire_on_time).toBeDefined();
            expect(expire - avatar.expire_on_time).toBeLessThan(100);
            expect(avatar.expire_on).toBeDefined();
            expect(avatar.expire_on).toEqual(new Date(avatar.expire_on_time).toISOString());

            expect(avatar.original_avatar_url_http).toBeDefined();
            expect(avatar.small_avatar_url_http).toBeDefined();
            expect(avatar.normal_avatar_url_http).toBeDefined();
            expect(avatar.big_avatar_url_http).toBeDefined();
        });

    });

}); // End suite get

describe("Avatar Service - Delete", function() {

    // Tear down
    afterEach(function() {
        service.clearRefreshQueue();
    });

    it('Delete avatar', function() {
       service.addAvatarWithImageUrl('00000', 'http://cnn.com', '9999');
       service.deleteAvatar('00000');
       // Attempt to retrieve
       var found_avatar = true;
       runs(function() {
            service.getAvatar('00000', 'o',
                function(a, u) { },
                function() {found_avatar = false}
            );
        });
        // Wait for result
        waitsFor(function() { return !found_avatar }, "Getting removed avatar", 750);
         // Test results
        runs(function() {
            expect(found_avatar).toBe(false);
        });
    });

});