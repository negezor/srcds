import { concatPattern } from '../helpers';
import { type IBaseEvent, defineParser } from './parser';

export type RconEventPayload = {
    address: string;
    command: string;
};

export type RconEvent = IBaseEvent<'rcon', RconEventPayload>;

// rcon from "127.0.0.1:49987": command "say hello"
export const rconParser = defineParser<RconEvent>({
    type: 'rcon',

    patterns: [
        concatPattern`^rcon from "${/(?<address>\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5})/}": command "(?<command>.+)"$`,
    ],

    parse({ address, command }) {
        return {
            address,
            command,
        };
    },
});
