# Sotez - A JS Library for Tezos
![npm](https://img.shields.io/npm/v/sotez.svg?logo=npm&color=blue)
[![Build Status](https://travis-ci.org/AndrewKishino/sotez.svg?branch=master)](https://travis-ci.org/AndrewKishino/sotez)

# Getting Started
```js
npm install sotez
```

```js
import Sotez from 'sotez';

const sotez = new Sotez('http://127.0.0.1:8732');

sotez.query('/chains/main/blocks/head')
  .then(response => console.log(response));
```

Or

```js
const Sotez = require('sotez').default;

const sotez = new Sotez('http://127.0.0.1:8732');

sotez.query('/chains/main/blocks/head')
  .then(response => console.log(response));
```

# Documentation
Documentation can be found [HERE](https://github.com/AndrewKishino/sotez/wiki).

# Development
```js
npm install
npm run build
```

## License
MIT
