# srcds
Source Dedicated Server toolkit

## Example usage

```ts
import { SrcdsLogReceiver } from '@srcds/log-receiver';
import { parse } from '@srcds/log-parser';

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

	const pared = parse(log.payload);
	
	console.log('Parsed', pared);
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
