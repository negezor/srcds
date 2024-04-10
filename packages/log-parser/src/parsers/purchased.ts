import { type IBaseEvent, defineParser } from './parser';
import { concatPattern } from '../helpers';
import {
	type Entity,

	entityRe,

	parseEntity
} from '../entities';

export type PurchasedEventPayload = {
	player: Entity;

	weaponName: string;
};

export type PurchasedEvent = IBaseEvent<'purchased', PurchasedEventPayload>;

// "PlayerName<93><STEAM_1:0:12345><CT>" purchased "aug"
export const purchasedParser = defineParser<PurchasedEvent>({
	type: 'purchased',

	patterns: [
		concatPattern`^(?<player>${entityRe}) purchased "(?<weaponName>[^"]+)"$`
	],

	parse({
		player,

		weaponName
	}) {
		return {
			player: parseEntity(player),

			weaponName
		};
	}
});
