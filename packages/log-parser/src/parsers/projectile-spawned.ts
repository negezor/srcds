import { IBaseEvent, defineParser } from './parser';
import { concatPattern } from '../helpers';
import {
	Vector,

	vectorRe,

	parseVector
} from '../entities';

export type SpawnedEventPayload = {
	item: string;
	position: Vector;
	velocity: Vector;
};

export type SpawnedEvent = IBaseEvent<'projectile_spawned', SpawnedEventPayload>;

// eslint-disable-next-line max-len
// Molotov projectile spawned at 470.226189 1001.444831 746.135715, velocity 225.051541 140.823573 -358.102564
export const SpawnedParser = defineParser<SpawnedEvent>({
	type: 'projectile_spawned',

	patterns: [
		concatPattern`^(?<item>.+) projectile spawned at (?<position>${vectorRe}), velocity (?<velocity>${vectorRe})$`
	],

	parse({
		item,
		position,
		velocity
	}) {
		return {
			item: item.toLowerCase(),
			position: parseVector(position),
			velocity: parseVector(velocity)
		};
	}
});
