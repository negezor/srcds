import { type Entity, entityRe, parseEntity } from '../entities';
import { concatPattern } from '../helpers';
import { type IBaseEvent, defineParser } from './parser';

export interface IValidatedValidEventPayload {
    kind: 'valid';

    player: Entity;
}

export interface IValidatedFailedEventPayload {
    kind: 'failed';

    player: {
        name: string;
    };

    code: number;
}

export type ValidatedEventPayload = IValidatedValidEventPayload | IValidatedFailedEventPayload;

export type ValidatedEvent = IBaseEvent<'validated', ValidatedEventPayload>;

// "PlayerName<93><STEAM_1:0:12345><>" STEAM USERID validated
// STEAMAUTH: Client PlayerName received failure code 6
export const validatedParser = defineParser<ValidatedEvent>({
    type: 'validated',

    patterns: [
        concatPattern`^(?<player>${entityRe}) STEAM USERID validated$`,
        concatPattern`^STEAMAUTH: Client (?<playerName>.+) received failure code (?<code>\\d+)$`,
    ],

    parse({
        player,

        playerName,
        code,
    }) {
        if (player) {
            return {
                kind: 'valid',

                player: parseEntity(player),
            };
        }

        return {
            kind: 'failed',

            player: {
                name: playerName,
            },

            code: code !== undefined ? Number(code) : code,
        };
    },
});
