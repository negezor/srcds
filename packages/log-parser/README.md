<p align="center">
<a href="https://www.npmjs.com/package/@srcds/log-log-parser"><img src="https://img.shields.io/npm/v/@srcds/log-parser.svg?style=flat-square" alt="NPM version"></a>
<a href="https://www.npmjs.com/package/@srcds/log-parser"><img src="https://img.shields.io/npm/dt/@srcds/log-parser.svg?style=flat-square" alt="NPM downloads"></a>
</p>

log-parser SRCDS logs

# Installation
> **[Node.js](https://nodejs.org/) 14.0.0 or newer is required**  

### Yarn
```
yarn add @srcds/log-parser
```

### NPM
```
npm i @srcds/log-parser
```

## Example usage

```ts
import { parse } from '@srcds/log-parser';

async function run() {
	const parsed = parse('10/20/2020 - 10:30:50: "AttackerName<93><STEAM_1:0:12345><CT>" [698 2222 -69] killed "Lester<97><BOT><TERRORIST>" [1303 2143 64] with "hkp2000" (headshot)');

	console.log(parsed);
	// 	{
	// 	"type": "killed",
	// 	"receivedAt": "2020-10-19T23:30:50.000Z",
	// 	"payload": {
	// 		"attacker": {
	// 			"kind": "player",
	// 			"entityId": 93,
	// 			"playerId": "STEAM_1:0:12345",
	// 			"name": "AttackerName",
	// 			"team": {
	// 				"id": 3,
	// 				"name": "COUNTER_TERRORISTS"
	// 			},
	// 			"position": [698, 2222, -69]
	// 		},
	// 		"victim": {
	// 			"kind": "player",
	// 			"entityId": 97,
	// 			"playerId": "BOT",
	// 			"name": "Lester",
	// 			"team": {
	// 				"id": 2,
	// 				"name": "TERRORISTS"
	// 			},
	// 			"position": [1303, 2143, 64]
	// 		},
	// 		"weaponName": "hkp2000",
	// 		"modifiers": ["headshot"]
	// 	}
	// }
}

run().catch(console.log);
```
