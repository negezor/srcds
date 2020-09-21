import { IBaseEvent, defineParser } from './parser';
import { concatPattern } from '../helpers';
import {
	Vector,

	vectorRe,

	parseVector
} from '../entities';

export type ProjectileSpawnedEventPayload = {
	item: string;
	position: Vector;
	velocity: Vector;
};

export type ProjectileSpawnedEvent = IBaseEvent<'projectile_spawned', ProjectileSpawnedEventPayload>;

// eslint-disable-next-line max-len
// Molotov projectile projectilespawned at 470.226189 1001.444831 746.135715, velocity 225.051541 140.823573 -358.102564
export const projectileSpawnedParser = defineParser<ProjectileSpawnedEvent>({
	type: 'projectile_spawned',

	patterns: [
		concatPattern`^(?<item>.+) projectile projectilespawned at (?<position>${vectorRe}), velocity (?<velocity>${vectorRe})$`
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
