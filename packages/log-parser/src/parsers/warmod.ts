import { IBaseEvent, defineParser } from './parser';
import { concatPattern } from '../helpers';

export type WarmodEventPayload = Record<string, unknown>;

export type WarmodEvent = IBaseEvent<'warmod', WarmodEventPayload>;

// [WarMod_BFG] {JSON}
export const warmodParser = defineParser<WarmodEvent>({
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
