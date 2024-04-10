import { type Entity, entityRe, parseEntity } from '../entities';
import { concatPattern } from '../helpers';
import { type IBaseEvent, defineParser } from './parser';

export type PlayerUpdateEventPayload = {
    kind: 'change_name';

    player: Entity;

    newName: string;
};

export type PlayerUpdateEvent = IBaseEvent<'player_update', PlayerUpdateEventPayload>;

// "OldName<93><STEAM_1:0:12345><CT>" changed name to "NewName"
export const playerUpdateParser = defineParser<PlayerUpdateEvent>({
    type: 'player_update',

    patterns: [concatPattern`^(?<player>${entityRe}) changed name to "(?<newName>.+)"$`],

    parse({
        player,

        newName,
    }) {
        return {
            kind: 'change_name',

            player: parseEntity(player),

            newName,
        };
    },
});
