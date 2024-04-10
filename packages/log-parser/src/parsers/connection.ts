import { type IPlayerEntity, entityRe, parseEntity } from '../entities';
import { concatPattern } from '../helpers';
import { type IBaseEvent, defineParser } from './parser';

export interface IConnectionConnectedEvent {
    kind: 'connected';
    player: IPlayerEntity;
    address: string;
}

export interface IConnectionEnteredEvent {
    kind: 'entered';
    player: IPlayerEntity;
}

export interface IConnectionDisconnectedEvent {
    kind: 'disconnected';
    player: IPlayerEntity;
    reason: string;
}

export type ConnectionEventPayload = IConnectionConnectedEvent | IConnectionEnteredEvent | IConnectionDisconnectedEvent;

export type ConnectionEvent = IBaseEvent<'connection', ConnectionEventPayload>;

const basePattern = concatPattern`^(?<player>${entityRe})`;

// "ConnectionPlayer<93><STEAM_1:0:12345><>" connected, address ""
// "Walt<96><BOT><>" connected, address ""
// "Albert<95><BOT><>" entered the game
// "Bert<122><BOT><>" disconnected (reason "Server shutting down")
// "ConnectionPlayer<113><STEAM_1:0:12345><>" disconnected (reason "Server shutting down")
export const connectionParser = defineParser<ConnectionEvent>({
    type: 'connection',

    patterns: [
        concatPattern`${basePattern} (?<kind>entered) the game$`,
        concatPattern`${basePattern} (?<kind>connected), address "(?<address>[^"]*)"$`,
        concatPattern`${basePattern} (?<kind>disconnected) \\(reason "(?<reason>[^"]*)"\\)$`,
    ],

    parse({ player: rawPlayer, kind, address, reason }) {
        const player = parseEntity(rawPlayer) as IPlayerEntity;

        return {
            kind: kind as ConnectionEventPayload['kind'],
            player,
            address,
            reason,
        };
    },
});
