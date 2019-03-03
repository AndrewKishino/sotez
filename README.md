# Sotez - A JS Library for Tezos

# Getting Started
```js
npm install sotez
```

```js
import sotez from 'sotez';

sotez.node.query('/chains/main/blocks/head')
  .then(response => console.log(response));
```

Or import individule modules

```js
import { node, rpc } from 'sotez';

node.query('/chains/main/blocks/head')
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
