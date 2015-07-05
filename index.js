'use strict';

var ghGot = require('gh-got');

var get_followers = function (username, token, callback) {
    ghGot('users/' + username + '/followers', { token: token }, callback);
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

    var followers1 = res1.data.items.map(function (user) {
        return user.login;
    });

    var followers2 = res2.data.items.map(function (user) {
        return user.login;
    });

    return [followers1, followers2];
};

function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        if (b.indexOf(e) !== -1) return true;
    });
}

module.exports = function (username1, username2, token, cb) {

    if (typeof username1 !== 'string' || typeof username2 !== 'string') {
        throw new Error('Type error: usernames must be of type `string`');
    }

    if (typeof token === 'function') {
        cb = token;
        token = null;
    }

    var result1, result2;

    get_followers(username1, token, function (err, data) {
        result1 = { err: err, data: data };

        get_followers(username2, token, function (err, data) {
            result2 = { err: err, data: data };

            var followers = intersect.apply(null, getResults(result1, result2, cb));
            cb(null, followers);
        });
    });
};
