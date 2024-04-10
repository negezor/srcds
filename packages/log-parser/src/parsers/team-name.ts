import { type ITeamEntity, parseTeam } from '../entities';
import { concatPattern } from '../helpers';
import { type IBaseEvent, defineParser } from './parser';

export type TeamNameEventPayload = {
    team: ITeamEntity;

    name: string;
};

export type TeamNameEvent = IBaseEvent<'team_name', TeamNameEventPayload>;

// Team playing "CT": Test
export const teamNameParser = defineParser<TeamNameEvent>({
    type: 'team_name',

    patterns: [concatPattern`^Team playing "(?<team>[^"]+)": (?<name>.+)$`],

    parse({
        team,

        name,
    }) {
        return {
            team: parseTeam(team),

            name,
        };
    },
});
