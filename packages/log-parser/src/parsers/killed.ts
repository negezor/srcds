import { type Entity, entityRe, parseEntity, parseVector, vectorRe } from '../entities';
import { concatPattern } from '../helpers';
import { type IBaseEvent, defineParser } from './parser';

export type KilledEventPayload = {
    attacker: Entity;

    victim: Entity;

    weaponName: string;
    modifiers: ('headshot' | 'penetrated' | 'throughsmoke' | 'noscope')[];
};

export type KilledEvent = IBaseEvent<'killed', KilledEventPayload>;

// "AttackerName<93><STEAM_1:0:12345><CT>" [698 2222 -69] killed "VictimName<94><STEAM_1:0:12345><TERRORIST>" [1303 2143 64] with "hkp2000" (throughsmoke headshot)
export const killedParser = defineParser<KilledEvent>({
    type: 'killed',

    patterns: [
        concatPattern`^(?<attacker>${entityRe}) \\[(?<attackerPosition>${vectorRe})\\] killed (?<victim>${entityRe}) \\[(?<victimPosition>${vectorRe})\\] with "(?<weaponName>[^"]+)"(?: \\((?<modifiers>[^\\)]+)\\))?$`,
    ],

    parse({
        attacker,
        attackerPosition,

        victim,
        victimPosition,

        weaponName,
        modifiers,
    }) {
        return {
            attacker: {
                ...parseEntity(attacker),

                position: parseVector(attackerPosition),
            },
            victim: {
                ...parseEntity(victim),

                position: parseVector(victimPosition),
            },

            weaponName,

            modifiers: (modifiers?.split(' ') ?? []) as KilledEventPayload['modifiers'],
        };
    },
});
