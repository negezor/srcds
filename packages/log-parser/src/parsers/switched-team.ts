import { type Entity, type ITeamEntity, entityRe, parseEntity, parseTeam } from '../entities';
import { concatPattern } from '../helpers';
import { type IBaseEvent, defineParser } from './parser';

export type SwitchedTeamEventPayload = {
    player: Entity;

    fromTeam: ITeamEntity;
    toTeam: ITeamEntity;
};

export type SwitchedTeamEvent = IBaseEvent<'switched_team', SwitchedTeamEventPayload>;

// "PlayerName<93><STEAM_1:0:12345>" switched from team <TERRORIST> to <CT>
export const switchedTeamParser = defineParser<SwitchedTeamEvent>({
    type: 'switched_team',

    patterns: [concatPattern`^(?<player>${entityRe}) switched from team <(?<fromTeam>[^>]+)> to <(?<toTeam>[^>]+)>$`],

    parse({
        player,

        fromTeam,
        toTeam,
    }) {
        return {
            player: parseEntity(player),

            fromTeam: parseTeam(fromTeam),
            toTeam: parseTeam(toTeam),
        };
    },
});
