import { IBaseEvent, defineParser } from './parser';
import { concatPattern } from '../helpers';

export type ServerCVarEventPayload = {
	name: string;
	value: string;
};

export type ServerCVarEvent = IBaseEvent<'server_cvar', ServerCVarEventPayload>;

// "mp_fraglimit" = "0"
// server_cvar: "sv_cheats" "1"
export const serverCVarParser = defineParser<ServerCVarEvent>({
	type: 'server_cvar',

	patterns: [
		concatPattern`^server_cvar: "(?<name>[^"]+)" "(?<value>.+)"$`,
		concatPattern`^"(?<name>[^"]+)" = "(?<value>.+)"$`
	],

	parse({
		name,
		value
	}) {
		return {
			name,
			value
		};
	}
});
