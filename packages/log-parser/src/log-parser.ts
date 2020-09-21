import * as rawParsers from './parsers';

const { length: LENGTH_OF_DATE } = '10/20/2020 - 10:30:50: ';

const parsers = Object.values(rawParsers)
	.filter(item => (
		typeof item === 'object'
		&& Reflect.has(item, 'type')
		&& Reflect.has(item, 'patterns')
		&& Reflect.has(item, 'parse')
	));

export function parse(rawLog: string) {
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
		};
	}

	return undefined;
}
