import { IBaseEvent, defineParser } from './parser';
import { concatPattern } from '../helpers';
import {
	Entity,

	entityRe,
	vectorRe,

	parseEntity,
	parseVector
} from '../entities';

export type ThrewEventPayload = {
	player: Entity;

	item: string;
};

export type ThrewEvent = IBaseEvent<'threw', ThrewEventPayload>;

// eslint-disable-next-line max-len
// "PlayerName<93><STEAM_1:0:12345><CT>" threw molotov [-2035 1521 35]
export const ThrewParser = defineParser<ThrewEvent>({
	type: 'threw',

	patterns: [
		concatPattern`^(?<player>${entityRe}) threw (?<item>.+) \\[(?<playerPosition>${vectorRe})\\]$`
	],

	parse({
		player,
		playerPosition,

		item
	}) {
		return {
			player: {
				...parseEntity(player),

				position: parseVector(playerPosition)
			},
			item
		};
	}
});
