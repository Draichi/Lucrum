# Buy Low Sell High

**Frontend** hackaton project

## Requirements
- Node >= 10.18
- Yarn 1.x
- Api key from [CryptoCompare](https://min-api.cryptocompare.com/pricing)

## Setup

Paste the API key in `config-example.js`

```js
const config = {
  cryptoCompareApiKey: '', // paste the api key here
};
```

Create `config.js` from `config-example.js`

```sh
cp config-example.js config.js
```

## Install dependencies

```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
yarn dev
```

### Lint the files
```bash
yarn lint
```

### Build the app for production
```bash
yarn build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
