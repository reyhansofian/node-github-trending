# Node Github Trending

Get today Github trending open-source repository.

## How to use

1. Install by run `npm install --save node-github-trending`
2. Instantiate the package

```js
const Client = require('node-github-trending').Client;
// or you can destructure it
const { Client } = require('node-github-trending');

const client = new Client();
```

3. Get the trending repository

```js
// Get trending repository for all language
const fetch = client.fetch();

// or you can specify the language
const fetch = client.fetch('javascript');

fetch
    .then(data => {
        console.log(data);
    });

// Response
// [
//  {
//    title: 'kadira-open / kadira-server',
//    url: 'https://github.com//kadira-open/kadira-server',
//    summary: 'Source code to Kadira APM',
//    metadata: {
//      programmingLanguage: 'JavaScript',
//      stars: '46',
//      forks: '12'
//    }
//  }
//  ...
// ]

```
