<p align="center">
<a href="https://www.npmjs.com/package/@srcds/log-receiver"><img src="https://img.shields.io/npm/v/@srcds/log-receiver.svg?style=flat-square" alt="NPM version"></a>
<a href="https://www.npmjs.com/package/@srcds/log-receiver"><img src="https://img.shields.io/npm/dt/@srcds/log-receiver.svg?style=flat-square" alt="NPM downloads"></a>
</p>

Receiver of SRCDS logs

# Installation
> **[Node.js](https://nodejs.org/) 14.0.0 or newer is required**  

### Yarn
```
yarn add @srcds/log-receiver
```

### NPM
```
npm i @srcds/log-receiver
```

## Example usage

```ts
import { SrcdsLogReceiver } from '@srcds/log-receiver';

const receiver = new SrcdsLogReceiver({
	// hostname: '0.0.0.0',
	// port: 9871,

	// onlyRegisteredServers: false
});

receiver.addServers({
    hostname: '127.0.0.1',
    port: 27015,

    // password: '1234'
});

receiver.on('log', (log) => {
	console.log('Log', log);
});

receiver.on('error', (error) => {
	console.log('error', error);
});

async function run() {
	await receiver.listen();

	console.log('Server running');
}

run().catch(console.log);
```
