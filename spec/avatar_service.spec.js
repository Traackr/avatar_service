
// Service instance
var service = require(__dirname + '/../src/lib/').AvatarService;


///var runner = jasmine.getEnv().currentRunner();
//
//runner.finishCallback = function() {
//    console.log('Done!!');
//    process.exit(0);
//};


describe("Avatar Service - Add/Update", function() {

    // Tear down
    afterEach(function() {
        service.deleteAvatar('00000');
    });

    it('Add avatar with image', function() {
        var avatar = service.addAvatarWithImageUrl('00000', 'http://cnn.com', '9999');
        expect(avatar).not.toBeNull();
        expect(avatar.ttl).toEqual('9999');
        expect(avatar.original_avatar_url_http).toBeDefined();
        expect(avatar.original_avatar_url_http).toEqual('http://cnn.com');
        expect(avatar.small_avatar_url_http).toBeDefined();
        expect(avatar.small_avatar_url_http).toEqual('http://cnn.com');
        expect(avatar.normal_avatar_url_http).toBeDefined();
        expect(avatar.normal_avatar_url_http).toEqual('http://cnn.com');
        expect(avatar.big_avatar_url_http).toBeDefined();
        expect(avatar.big_avatar_url_http).toEqual('http://cnn.com');
    });
});

xdescribe("Avatar Service - Get", function() {

});

xdescribe("Avatar Service - Delete", function() {

});

xdescribe("Avatar Service - Refresh", function() {

});


xdescribe("Avatar Service", function() {


    afterEach(function() {
        service.deleteAvatar('00000');
    });


    it('Add avatar with image', function() {
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
        waitsFor(function() { return found_avatar }, "Failed to find added avatar", 1000);

        runs(function() {
            expect(found_avatar).toBe(true);
            expect(avatar.ttl).toEqual('9999');
            expect(avatar.original_avatar_url_http).toBeDefined();
            expect(avatar.original_avatar_url_http).toEqual('http://cnn.com');
            expect(avatar.small_avatar_url_http).toBeDefined();
            expect(avatar.small_avatar_url_http).toEqual('http://cnn.com');
            expect(avatar.normal_avatar_url_http).toBeDefined();
            expect(avatar.normal_avatar_url_http).toEqual('http://cnn.com');
            expect(avatar.big_avatar_url_http).toBeDefined();
            expect(avatar.big_avatar_url_http).toEqual('http://cnn.com');
            expect(url).toEqual('http://cnn.com');
        });
        
    }); // End avatar with image


    it('Add avatar with twitter', function() {
        service.addAvatarWithTwitter('00000', 'dchancogne', '9999');
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
        waitsFor(function() { return found_avatar }, "Failed to find added avatar", 3000);

        runs(function() {
            expect(found_avatar).toBe(true);
            expect(avatar.ttl).toEqual('9999');
            expect(avatar.original_avatar_url_http).toBeDefined();
            expect(avatar.small_avatar_url_http).toBeDefined();
            expect(avatar.normal_avatar_url_http).toBeDefined();
            expect(avatar.big_avatar_url_http).toBeDefined();
        });
    }); // End avatar with twitter

});

