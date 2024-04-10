import { type Entity, entityRe, parseEntity, parseVector, vectorRe } from '../entities';
import { concatPattern } from '../helpers';
import { type IBaseEvent, defineParser } from './parser';

export type SuicideEventPayload = {
    player: Entity;

    how: 'world' | 'hegrenade' | 'inferno';
};

export type SuicideEvent = IBaseEvent<'suicide', SuicideEventPayload>;

// "PlayerName<93><STEAM_1:0:12345><TERRORIST>" [-1117 2465 -72] committed suicide with "world"
export const suicideParser = defineParser<SuicideEvent>({
    type: 'suicide',

    patterns: [
        concatPattern`^(?<player>${entityRe}) \\[(?<playerPosition>${vectorRe})\\] committed suicide with "(?<how>.+)"$`,
    ],

    parse({
        player,
        playerPosition,

        how,
    }) {
        return {
            player: {
                ...parseEntity(player),

                position: parseVector(playerPosition),
            },
            how: how as SuicideEventPayload['how'],
        };
    },
});
