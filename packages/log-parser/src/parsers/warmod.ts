import { concatPattern } from '../helpers';
import { type IBaseEvent, defineParser } from './parser';

export type WarmodEventPayload = Record<string, unknown>;

export type WarmodEvent = IBaseEvent<'warmod', WarmodEventPayload>;

// [WarMod_BFG] {JSON}
export const warmodParser = defineParser<WarmodEvent>({
    type: 'warmod',

    patterns: [concatPattern`^\\[WarMod_BFG\\] (?<payload>.+)$`],

    parse({ payload }) {
        return JSON.parse(payload);
    },
});
