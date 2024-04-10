const basePlayerRe =
    /"(?<name>.+)<(?<entityId>\d*)><(?<steamId>(?:STEAM_[0-5]:[01]:\d+|BOT|Console))>(?:<(?<team>[^>]*)>)?"/;
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

    UNKNOWN = 999,
}

const teamMapper: Record<string, Team> = {
    Unassigned: Team.UNASSIGNED,
    Spectator: Team.SPECTATOR,

    TERRORIST: Team.TERRORISTS,
    CT: Team.COUNTER_TERRORISTS,

    Red: Team.TERRORISTS,
    Blue: Team.COUNTER_TERRORISTS,
};

export type Vector = [number, number, number];

export interface ITeamEntity {
    id: number;
    name: string;
}

export interface IWorldEntity {
    kind: 'world';
}

export interface IConsoleEntity {
    kind: 'console';
}

export interface IChickenEntity {
    kind: 'chicken';

    entityId: number;
}

export interface IBasePlayerEntity {
    entityId: number;

    name: string;

    position?: Vector;

    team: ITeamEntity;
}

export interface IPlayerEntity extends IBasePlayerEntity {
    kind: 'player';

    steamId: string;
}

export interface IBotEntity extends IBasePlayerEntity {
    kind: 'bot';
}

export type Entity = IWorldEntity | IConsoleEntity | IChickenEntity | IPlayerEntity | IBotEntity;

export const parseTeam = (rawTeam: string): ITeamEntity => {
    const id = teamMapper[rawTeam] ?? Team.UNKNOWN;

    return {
        id,
        name: Team[id],
    };
};

export const parseEntity = (rawEntity: string): Entity => {
    if (baseWorldRe.test(rawEntity)) {
        return {
            kind: 'world',
        };
    }

    if (baseEntityRe.test(rawEntity)) {
        // biome-ignore lint/style/noNonNullAssertion: we already test by pattern
        const { entityId } = rawEntity.match(baseEntityRe)!.groups! as {
            entityId: string;
        };

        return {
            kind: 'chicken',

            entityId: Number(entityId),
        };
    }

    if (basePlayerRe.test(rawEntity)) {
        const {
            entityId: rawEntityId,
            steamId,

            name,
            team: rawTeam,
            // biome-ignore lint/style/noNonNullAssertion: we already test by pattern
        } = rawEntity.match(basePlayerRe)!.groups as {
            entityId: string;
            steamId: string;

            name: string;
            team: string;
        };

        if (steamId === 'Console') {
            return {
                kind: 'console',
            };
        }

        const entityId = Number(rawEntityId);
        const team = parseTeam(rawTeam);

        if (steamId === 'BOT') {
            return {
                kind: 'bot',

                entityId,

                name,

                team,
            };
        }

        return {
            kind: 'player',

            entityId,
            steamId,

            name,

            team,
        };
    }

    throw new Error(`Failed parse entity "${rawEntity}"`);
};

export const parseVector = (rawVector: string): Vector => rawVector.split(' ').map(Number) as Vector;
