'use strict';

var ghGot = require('gh-got');

var defaults = {
    token: null,
    perPage1: 100,
    page1: 1,
    perPage2: 100,
    page2: 1
};

var extend = function (defaults, options) {
    var extended = {};
    var prop;
    for (prop in defaults) {
        if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
            extended[prop] = defaults[prop];
        }
    }
    for (prop in options) {
        if (Object.prototype.hasOwnProperty.call(options, prop)) {
            extended[prop] = options[prop];
        }
    }
    return extended;
};

var get_followers = function (username, opts, callback) {
    ghGot('users/' + username + '/followers', {
        token: opts.token,
        query: {
            per_page: opts.perPage,
            page: opts.page
        }
    }, callback);
};

var getResults = function (res1, res2, cb) {
    if (res1.err) {
        cb(res1.err);
        return;
    }

    if (res2.err) {
        cb(res2.err);
        return;
    }

    var followers1 = res1.data.map(function (user) {
        return user.login;
    });

    var followers2 = res2.data.map(function (user) {
        return user.login;
    });

    return [followers1, followers2];
};

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

module.exports = function (username1, username2, opts, cb) {

    if (typeof username1 !== 'string' || typeof username2 !== 'string') {
        throw new Error('Type error: usernames must be of type `string`');
    }

    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }

    opts = extend(defaults, opts);

    var result1, result2;

    // Get first user's followers
    get_followers(username1, {
        perPage: opts.perPage1,
        page: opts.page1,
        token: opts.token
    }, function (err, data) {
        result1 = { err: err, data: data };

        // Get second user's followers
        get_followers(username2, {
            perPage: opts.perPage2,
            page: opts.page2,
            token: opts.token
        }, function (err, data) {
            result2 = { err: err, data: data };

            var followers = intersect.apply(null, getResults(result1, result2, cb));
            cb(null, followers);
        });
    });
};

var ghCF = require('./');
ghCF('addyosmani', 'sindresorhus', function (err, data) {
    console.log(data);
});