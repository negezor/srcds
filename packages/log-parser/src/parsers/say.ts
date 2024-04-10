import { type Entity, entityRe, parseEntity } from '../entities';
import { concatPattern } from '../helpers';
import { type IBaseEvent, defineParser } from './parser';

export type SayEventPayload = {
    player: Entity;

    to: 'global' | 'team';

    message: string;
};

export type SayEvent = IBaseEvent<'say', SayEventPayload>;

// "Player<93><STEAM_1:0:12345><CT>" say "hello"
// "Player<93><STEAM_1:0:12345><CT>" say_team "hello"
export const sayParser = defineParser<SayEvent>({
    type: 'say',

    patterns: [concatPattern`^(?<player>${entityRe}) (?<to>say|say_team) "(?<message>.+)"$`],

    parse({
        player,

        to,

        message,
    }) {
        return {
            player: parseEntity(player),

            to: to === 'say' ? 'global' : 'team',

            message,
        };
    },
});
