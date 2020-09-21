import {
	IBaseParser,

	assistParser,
	attackedParser,
	connectionParser,
	entityTriggeredParser,
	killedParser,
	playerUpdateParser,
	projectileSpawnedParser,
	purchasedParser,
	rconParser,
	sayParser,
	scoredParser,
	serverCVarParser,
	ServerLogParser,
	suicideParser,
	switchedTeamParser,
	teamNameParser,
	teamTriggeredParser,
	threwParser,
	validatedParser,
	warmodParser,

	AssistEvent,
	AttackedEvent,
	ConnectionEvent,
	EntityTriggeredEvent,
	KilledEvent,
	PlayerUpdateEvent,
	ProjectileSpawnedEvent,
	PurchasedEvent,
	RconEvent,
	SayEvent,
	ScoredEvent,
	ServerCVarEvent,
	ServerLogEvent,
	SuicideEvent,
	SwitchedTeamEvent,
	TeamNameEvent,
	TeamTriggeredEvent,
	ThrewEvent,
	ValidatedEvent,
	WarmodEvent
} from './parsers';

export const defaultParsers = [
	assistParser,
	attackedParser,
	connectionParser,
	entityTriggeredParser,
	killedParser,
	playerUpdateParser,
	projectileSpawnedParser,
	purchasedParser,
	rconParser,
	sayParser,
	scoredParser,
	serverCVarParser,
	ServerLogParser,
	suicideParser,
	switchedTeamParser,
	teamNameParser,
	teamTriggeredParser,
	threwParser,
	validatedParser,
	warmodParser
];

export type Events =
| AssistEvent
| AttackedEvent
| ConnectionEvent
| EntityTriggeredEvent
| KilledEvent
| PlayerUpdateEvent
| ProjectileSpawnedEvent
| PurchasedEvent
| RconEvent
| SayEvent
| ScoredEvent
| ServerCVarEvent
| ServerLogEvent
| SuicideEvent
| SwitchedTeamEvent
| TeamNameEvent
| TeamTriggeredEvent
| ThrewEvent
| ValidatedEvent
| WarmodEvent;

const { length: LENGTH_OF_DATE } = '10/20/2020 - 10:30:50: ';

export interface IParseOptions {
	parsers?: IBaseParser<Events>[];
}

export function parse(
	rawLog: string,
	{
		parsers = defaultParsers
	}: IParseOptions = {}
): Events | undefined {
	const receivedAt = new Date(
		rawLog
			.substring(0, LENGTH_OF_DATE - 2)
			.replace(' - ', ' ')
	);

	const log = rawLog.substring(LENGTH_OF_DATE);

	for (const parser of parsers) {
		const pattern = parser.patterns.find(item => (
			item.test(log)
		));

		if (pattern === undefined) {
			continue;
		}

		const groups = log.match(pattern)!.groups!;

		const payload = parser.parse(groups);

		return {
			type: parser.type,

			receivedAt,

			payload
		} as Events;
	}

	return undefined;
}
