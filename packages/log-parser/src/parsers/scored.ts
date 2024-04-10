import { type IBaseEvent, defineParser } from './parser';
import { concatPattern } from '../helpers';
import { type ITeamEntity, parseTeam } from '../entities';

export type ScoredEventPayload = {
	team: ITeamEntity;

	score: number;
	playerCount: number;
};

export type ScoredEvent = IBaseEvent<'scored', ScoredEventPayload>;

// Team "CT" scored "6" with "5" players
export const scoredParser = defineParser<ScoredEvent>({
	type: 'scored',

	patterns: [
		concatPattern`^Team "(?<team>[^"]+)" scored "(?<score>[^"]+)" with "(?<playerCount>[^"]+)" players$`
	],

	parse({
		team,

		score,
		playerCount
	}) {
		return {
			team: parseTeam(team),

			score: Number(score),
			playerCount: Number(playerCount)
		};
	}
});
