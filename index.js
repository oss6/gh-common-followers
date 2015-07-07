'use strict';

var GitHubApi = require('github');

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: false,
    protocol: "https",
    timeout: 5000,
    headers: {
        "user-agent": "oss6"
    }
});

var intersect = function (a, b) {
    var result = [];
    while( a.length > 0 && b.length > 0 ) {
        if      (a[0] < b[0] ){ a.shift(); }
        else if (a[0] > b[0] ){ b.shift(); }
        else {
            result.push(a.shift());
            b.shift();
        }
    }

    return result;
};

var retrieve_rest = function (link, rest, cb) {
    (function _retrieve_rest (link) {
        if (!github.hasNextPage(link)) {
            cb(null, rest);
            return;
        }

        github.getNextPage(link, function (err, data) {

            rest.concat(data.map(function (user) {
                return user.login;
            }));
            _retrieve_rest(data.meta.link);
        });
    })(link);
};

var get_followers = function (username, cb) {
    github.user.getFollowers({
        user: username,
        per_page: 100
    }, function (err, data) {
        var users = data.map(function (user) {
            return user.login;
        });

        retrieve_rest(data.meta.link, users, cb);
    });
};

module.exports = function (username1, username2, limit, cb) {

    if (typeof username1 !== 'string' || typeof username2 !== 'string') {
        throw new Error('Type error: usernames must be of type `string`');
    }

    if (typeof limit === 'function') {
        cb = limit;
        limit = 100;
    }

    get_followers(username1, function (err, data) {
        console.log('======================== USER 1 ===============================');
        console.log(data);

        get_followers(username2, function (err, data) {
            console.log('======================== USER 2 ===============================');
            console.log(data);
        });
    });

};

var ghf = require('./');
ghf('oss6', 'sindresorhus', function (err, data) {

});