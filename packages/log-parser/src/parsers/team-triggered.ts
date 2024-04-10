import { type ITeamEntity, parseTeam } from '../entities';
import { concatPattern } from '../helpers';
import { type IBaseEvent, defineParser } from './parser';

export type TeamTriggeredEventPayload = {
    kind:
        | 'sfui_notice_terrorists_win'
        | 'sfui_notice_cts_win'
        | 'sfui_notice_target_bombed'
        | 'sfui_notice_target_saved'
        | 'sfui_notice_bomb_defused';

    team: ITeamEntity;

    counterTerroristScore: number;
    terroristScore: number;
};

export type TeamTriggeredEvent = IBaseEvent<'team_triggered', TeamTriggeredEventPayload>;

// Team "CT" triggered "SFUI_Notice_Bomb_Defused" (CT "7") (T "3")
export const teamTriggeredParser = defineParser<TeamTriggeredEvent>({
    type: 'team_triggered',

    patterns: [
        concatPattern`^Team "(?<team>[^"]+)" triggered "(?<kind>[^"]+)" \\(CT "(?<counterTerroristScore>\\d+)"\\) \\(T "(?<terroristScore>\\d+)"\\)$`,
    ],

    parse({
        kind,

        team,

        counterTerroristScore,
        terroristScore,
    }) {
        return {
            kind: kind.toLowerCase() as TeamTriggeredEventPayload['kind'],

            team: parseTeam(team),

            counterTerroristScore: Number(counterTerroristScore),
            terroristScore: Number(terroristScore),
        };
    },
});
