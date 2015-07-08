'use strict';

var GitHubApi = require('github'),

    github = new GitHubApi({
        version: "3.0.0",
        protocol: "https",
        timeout: 8000,
        headers: {
            "user-agent": "https://github.com/oss6/gh-common-followers"
        }
    }),

    intersect = function (a, b) {
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
    },

    retrieveRest = function (link, arr, limit, cb) {
        (function _retrieveRest (link) {
            if (arr.length > limit) {
                arr = arr.slice(0, limit);
                cb(null, arr);
                return;
            }

            if (!github.hasNextPage(link)) {
                cb(null, arr);
                return;
            }

            github.getNextPage(link, function (err, data) {
                if (err) {
                    cb(err);
                    return;
                }

                arr = arr.concat(data.map(function (user) {
                    return user.login;
                }));
                _retrieveRest(data.meta.link);
            });
        })(link);
    },

    getFollowers = function (username, limit, cb) {
        github.user.getFollowers({
            user: username,
            per_page: 100
        }, function (err, data) {
            var users = data.map(function (user) {
                return user.login;
            });

            if (users.length > limit) {
                cb(null, users.slice(0, limit));
                return;
            }

            retrieveRest(data.meta.link, users, limit, function (err, data) {
                if (err) {
                    cb(err);
                    return;
                }

                cb(null, data);
            });
        });
    };

module.exports = function (username1, username2, token, limit, cb) {

    if (typeof username1 !== 'string' || typeof username2 !== 'string') {
        throw new Error('Type error: usernames must be of type `string`');
    }

    if (typeof limit === 'function') {
        cb = limit;
        limit = 250;
    }

    // Get followers of the two users
    getFollowers(username1, limit, function (err1, data1) {
        if (err1) {
            cb(err1);
            return;
        }

        getFollowers(username2, limit, function (err2, data2) {
            if (err2) {
                cb(err2);
                return;
            }

            cb(null, intersect(data1, data2))
        });
    });

};