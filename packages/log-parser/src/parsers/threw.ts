import { type Entity, entityRe, parseEntity, parseVector, vectorRe } from '../entities';
import { concatPattern } from '../helpers';
import { type IBaseEvent, defineParser } from './parser';

export type ThrewEventPayload = {
    player: Entity;

    item: string;
};

export type ThrewEvent = IBaseEvent<'threw', ThrewEventPayload>;

// "PlayerName<93><STEAM_1:0:12345><CT>" threw molotov [-2035 1521 35]
export const threwParser = defineParser<ThrewEvent>({
    type: 'threw',

    patterns: [concatPattern`^(?<player>${entityRe}) threw (?<item>.+) \\[(?<playerPosition>${vectorRe})\\]$`],

    parse({
        player,
        playerPosition,

        item,
    }) {
        return {
            player: {
                ...parseEntity(player),

                position: parseVector(playerPosition),
            },
            item,
        };
    },
});
