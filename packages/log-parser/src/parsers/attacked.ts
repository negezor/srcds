import { type Entity, entityRe, parseEntity, parseVector, vectorRe } from '../entities';
import { concatPattern } from '../helpers';
import { type IBaseEvent, defineParser } from './parser';

export type AttackedEventPayload = {
    attacker: Entity;

    victim: Entity;

    weaponName: string;

    damageAmount: number;
    damageArmourAmount: number;

    remainingHealth: number;
    remainingArmour: number;

    hitGroup: string;
};

export type AttackedEvent = IBaseEvent<'attacked', AttackedEventPayload>;

// "AttackerName<93><STEAM_1:0:12345><CT>" [820 2225 -34] attacked "VictimName<94><STEAM_1:0:12345><TERRORIST>" [1001 2164 0] with "ak47" (damage "34") (damage_armor "4") (health "29") (armor "95") (hitgroup "stomach")
export const attackedParser = defineParser<AttackedEvent>({
    type: 'attacked',

    patterns: [
        concatPattern`^(?<attacker>${entityRe}) \\[(?<attackerPosition>${vectorRe})\\] attacked (?<victim>${entityRe}) \\[(?<victimPosition>${vectorRe})\\] with "(?<weaponName>[^"]+)" \\(damage "(?<damageAmount>[^"]+)"\\) \\(damage_armor "(?<damageArmourAmount>[^"]+)"\\) \\(health "(?<remainingHealth>[^"]+)"\\) \\(armor "(?<remainingArmour>[^"]+)"\\) \\(hitgroup "(?<hitGroup>[^"]+)"\\)$`,
    ],

    parse({
        attacker,
        attackerPosition,

        victim,
        victimPosition,

        weaponName,

        damageAmount,
        damageArmourAmount,

        remainingHealth,
        remainingArmour,

        hitGroup,
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

            damageAmount: Number(damageAmount),
            damageArmourAmount: Number(damageArmourAmount),

            remainingHealth: Number(remainingHealth),
            remainingArmour: Number(remainingArmour),

            hitGroup,
        };
    },
});
