const basePlayerRe = /"(?<name>.+)<(?<entityId>\d*)><(?<playerId>(?:STEAM_[0-5]:[01]:\d+|BOT|Console))>(?:<(?<team>[^>]*)>)?"/;
const baseEntityRe = /"chicken<(?<entityId>\d+)>"/;
const baseWorldRe = /World/;

export const entityRe = /".+<\d*><(?:STEAM_[0-5]:[01]:\d+|BOT|Console)>(?:<[^>]*>)?"|"chicken<\d+>"|World/;
export const vectorRe = /\[?[-.\d]+ [-.\d]+ [-.\d]+\]?/;

export enum Team {
	UNASSIGNED = 0,
	SPECTATOR = 1,

	// CS:GO
	TERRORISTS = 2,
	COUNTER_TERRORISTS = 3,

	// TF2
	// RED = 2,
	// BLUE = 3,

	UNKNOWN = 999
}

const teamMapper: Record<string, Team> = {
	Unassigned: Team.UNASSIGNED,
	Spectator: Team.SPECTATOR,

	TERRORIST: Team.TERRORISTS,
	CT: Team.COUNTER_TERRORISTS,

	Red: Team.TERRORISTS,
	Blue: Team.COUNTER_TERRORISTS
};

export type Vector = [number, number, number];

export interface ITeamEntity {
	id: number;
	name: string;
}

export interface IWorldEntity {
	kind: 'world';
}

export interface IChickenEntity {
	kind: 'chicken';

	entityId: number;
}

export interface IPlayerEntity {
	kind: 'player';

	entityId: number;
	playerId: string;

	name: string;

	position?: Vector;

	team: ITeamEntity;
}

export type Entity = IWorldEntity | IChickenEntity | IPlayerEntity;

export const parseTeam = (rawTeam: string): ITeamEntity => {
	const id = teamMapper[rawTeam] ?? Team.UNKNOWN;

	return {
		id,
		name: Team[id]
	};
};

export const parseEntity = (rawEntity: string): Entity => {
	if (baseWorldRe.test(rawEntity)) {
		return {
			kind: 'world'
		};
	}

	if (baseEntityRe.test(rawEntity)) {
		const { entityId } = rawEntity.match(baseEntityRe)!.groups! as {
			entityId: string;
		};

		return {
			kind: 'chicken',

			entityId: Number(entityId)
		};
	}

	if (basePlayerRe.test(rawEntity)) {
		const {
			entityId,
			playerId,

			name,
			team: rawTeam
		} = rawEntity.match(basePlayerRe)!.groups as {
			entityId: string;
			playerId: string;

			name: string;
			team: string;
		};

		const team = parseTeam(rawTeam);

		return {
			kind: 'player',

			entityId: Number(entityId),
			playerId,

			name,

			team
		};
	}

	throw new Error(`Failed parse entity "${rawEntity}"`);
};

export const parseVector = (rawVector: string): Vector => (
	rawVector.split(' ').map(Number) as Vector
);
