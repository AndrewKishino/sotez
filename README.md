# sotez
A JS Library for Tezos

```js
npm install --save sotez

import sotez from 'sotez';

sotez.node.query('/blocks/head')
  .then(response => console.log(response));
```

Or import individule modules

```js
import { node } from 'sotez';

node.query('/blocks/head')
  .then(response => console.log(response));
```

## Contributing

## License

MIT
