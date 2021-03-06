#!/usr/bin/env node
'use strict';

var meow = require('meow');
var ghCF = require('./');

var cli = meow({
    help: [
        'Usage',
        '  $ gh-common-followers <username1> <username2> [--token=<token>] [--limit=<limit>]'
    ]
});

var username1 = cli.input[0],
    username2 = cli.input[1];

if (!username1 || !username2) {
    console.error('Supply usernames!');
    process.exit(1);
}

ghCF(username1, username2, cli.flags.token, cli.flags.limit, function (err, data) {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    // Output followers
    console.log(data);
});
