import { IBaseEvent, defineParser } from './parser';
import { concatPattern } from '../helpers';
import {
	Entity,
	ITeamEntity,

	entityRe,

	parseEntity,
	parseTeam
} from '../entities';

export type SwitchedTeamEventPayload = {
	player: Entity;

	fromTeam: ITeamEntity;
	toTeam: ITeamEntity;
};

export type SwitchedTeamEvent = IBaseEvent<'switched_team', SwitchedTeamEventPayload>;

// "PlayerName<93><STEAM_1:0:12345>" switched from team <TERRORIST> to <CT>
export const switchedTeamParser = defineParser<SwitchedTeamEvent>({
	type: 'switched_team',

	patterns: [
		concatPattern`^(?<player>${entityRe}) switched from team <(?<fromTeam>[^>]+)> to <(?<toTeam>[^>]+)>$`
	],

	parse({
		player,

		fromTeam,
		toTeam
	}) {
		return {
			player: parseEntity(player),

			fromTeam: parseTeam(fromTeam),
			toTeam: parseTeam(toTeam)
		};
	}
});
