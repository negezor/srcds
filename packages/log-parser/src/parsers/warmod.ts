import { IBaseEvent, defineParser } from './parser';
import { concatPattern } from '../helpers';

export type WarmodEventPayload = Record<string, unknown>;

export type WarmodEvent = IBaseEvent<'warmod', WarmodEventPayload>;

// eslint-disable-next-line max-len
// [WarMod_BFG] {JSON}
export const WarmodParser = defineParser<WarmodEvent>({
	type: 'warmod',

	patterns: [
		concatPattern`^\\[WarMod_BFG\\] (?<payload>.+)$`
	],

	parse({
		payload
	}) {
		return JSON.parse(payload);
	}
});
