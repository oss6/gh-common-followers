'use strict';

var ghGot = require('gh-got');

module.exports = function (username1, username2, token, cb) {

    if (typeof username1 !== 'string' || typeof username2 !== 'string') {
        throw new Error('Type error: usernames must be of type `string`');
    }

    if (typeof token === 'function') {
        cb = token;
        token = null;
    }

    var followers1 = [],
        followers2 = [];

    ghGot('users/' + username1 + '/followers', {

        token: token

    }, function (err, data) {
        if (err) {
            cb(err);
            return;
        }

        console.log(data);
    });
};