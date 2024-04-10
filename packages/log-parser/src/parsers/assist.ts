import { IBaseEvent, defineParser } from './parser';
import { concatPattern } from '../helpers';
import {
	Entity,

	entityRe,

	parseEntity
} from '../entities';

export type AssistEventPayload = {
	assistant: Entity;

	victim: Entity;
};

export type AssistEvent = IBaseEvent<'assist', AssistEventPayload>;

// "AssitantName<93><STEAM_1:0:12345><CT>" assisted killing "VictimName<92><STEAM_1:0:12345><TERRORIST>"
export const assistParser = defineParser<AssistEvent>({
	type: 'assist',

	patterns: [
		concatPattern`^(?<assistant>${entityRe}) assisted killing (?<victim>${entityRe})$`
	],

	parse({
		assistant,

		victim
	}) {
		return {
			assistant: parseEntity(assistant),
			victim: parseEntity(victim)
		};
	}
});
