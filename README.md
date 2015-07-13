# gh-common-followers
> Get GitHub common followers given two usernames


## Install

```
$ npm install --save gh-common-followers
```


## Usage

```js
var ghCommonFollowers = require('gh-common-followers');

ghCommonFollowers('paulirish', 'addyosmani', function (err, common_followers) {
	// Sanity check + do stuff with common_followers
});

// Limit specified
ghCommonFollowers('paulirish', 'addyosmani', 40, function (err, common_followers) {
	// Sanity check + do stuff with common_followers
});
```


## API

### ghCommonFollowers(username1, username2, [token], [limit], callback)

#### username1

*Required*
Type: `string`

Username 1

#### username2

*Required*
Type: `string`

Username 2

#### token

Type: `string`

GitHub [personal access token](https://github.com/settings/tokens/new).

#### limit

Type: `string`

Limits the number of followers to retrieve (for both users)

#### callback(err, common_followers)


## CLI

```
$ gh-common-followers --help

  Usage
    gh-common-followers <username1> <username2> [--token OAUTH-TOKEN]

```


## License

MIT © [Ossama Edbali](http://oss6.github.io)