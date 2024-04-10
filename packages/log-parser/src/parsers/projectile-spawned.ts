import { type Vector, parseVector, vectorRe } from '../entities';
import { concatPattern } from '../helpers';
import { type IBaseEvent, defineParser } from './parser';

export type ProjectileSpawnedEventPayload = {
    item: string;
    position: Vector;
    velocity: Vector;
};

export type ProjectileSpawnedEvent = IBaseEvent<'projectile_spawned', ProjectileSpawnedEventPayload>;

// Molotov projectile projectilespawned at 470.226189 1001.444831 746.135715, velocity 225.051541 140.823573 -358.102564
export const projectileSpawnedParser = defineParser<ProjectileSpawnedEvent>({
    type: 'projectile_spawned',

    patterns: [
        concatPattern`^(?<item>.+) projectile spawned at (?<position>${vectorRe}), velocity (?<velocity>${vectorRe})$`,
    ],

    parse({ item, position, velocity }) {
        return {
            item: item.toLowerCase(),
            position: parseVector(position),
            velocity: parseVector(velocity),
        };
    },
});
