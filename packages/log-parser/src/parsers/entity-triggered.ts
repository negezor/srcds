import { type Entity, entityRe, parseEntity } from '../entities';
import { concatPattern } from '../helpers';
import { type IBaseEvent, defineParser } from './parser';

export type EntityTriggeredEventPayload = {
    entity: Entity;

    kind:
        | 'game_commencing'
        | 'match_start'
        | 'round_start'
        | 'round_end'
        | 'restart_round_(1_second)'
        | 'restart_round_(3_seconds)'
        | 'begin_bomb_defuse_with_kit'
        | 'begin_bomb_defuse_without_kit'
        | 'defused_the_bomb'
        | 'planted_the_bomb'
        | 'got_the_bomb'
        | 'dropped_the_bomb'
        | 'clantag';

    value: string;
};

export type EntityTriggeredEvent = IBaseEvent<'entity_triggered', EntityTriggeredEventPayload>;

// "Entity<93><STEAM_1:0:12345><CT>" triggered "Defused_The_Bomb"
// World triggered "Match_Start" on "de_inferno"
// World triggered "Round_Start"
// World triggered "Round_End"
// World triggered "Game_Commencing"
// "PlayerName<93><STEAM_1:0:12345><CT>" triggered "Begin_Bomb_Defuse_With_Kit"
// "PlayerName<93><STEAM_1:0:12345><CT>" triggered "Begin_Bomb_Defuse_Without_Kit"
// "PlayerName<93><STEAM_1:0:12345><CT>" triggered "Defused_The_Bomb"
// "Irwin<3><BOT><TERRORIST>" triggered "Planted_The_Bomb"
// "Opie<10><BOT><TERRORIST>" triggered "Dropped_The_Bomb"
// "Bob<5><BOT><TERRORIST>" triggered "Got_The_Bomb"
export const entityTriggeredParser = defineParser<EntityTriggeredEvent>({
    type: 'entity_triggered',

    patterns: [
        concatPattern`^(?<entity>${entityRe}) triggered "(?<kind>[^"]+)"(?: \\(value "(?<value>[^"]+)"\\))?$`,
        concatPattern`^(?<entity>${entityRe}) triggered "(?<kind>[^"]+)" on "(?<value>[^"]+)"$`,
    ],

    parse({
        entity,

        kind,
        value,
    }) {
        return {
            entity: parseEntity(entity),

            kind: kind.toLowerCase() as EntityTriggeredEventPayload['kind'],
            value,
        };
    },
});
