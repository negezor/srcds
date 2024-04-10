import { concatPattern } from '../helpers';
import { type IBaseEvent, defineParser } from './parser';

export interface IServerLogFileStartedEvent {
    kind: 'log_file';
    state: 'started';
    filePath: string;
    gamePath: string;
    version: string;
}

export interface IServerLogFileClosedEvent {
    kind: 'log_file';
    state: 'closed';
}

export type ServerLogFileEvent = IServerLogFileStartedEvent | IServerLogFileClosedEvent;

export interface IServerLogMapLoadingEvent {
    kind: 'map';
    state: 'loading';
    map: string;
}

export interface IServerLogMapStartedEvent {
    kind: 'map';
    state: 'started';
    map: string;
    crc: string;
}

export type ServerLogMapEvent = IServerLogMapLoadingEvent | IServerLogMapStartedEvent;

export interface IServerLogMessagEvent {
    kind: 'message';
    message: string;
}

export type ServerLogEventPayload = ServerLogFileEvent | ServerLogMapEvent | IServerLogMessagEvent;

export type ServerLogEvent = IBaseEvent<'server_log', ServerLogEventPayload>;

// Log file started (file "logs\L172_028_192_001_27015_202009211728_000.log") (game "C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo") (version "7929")
// Log file closed
// Loading map "de_inferno"
// Started map "de_inferno" (CRC "-896074606")
// server_message: "quit"
// server_message: "restart"
export const ServerLogParser = defineParser<ServerLogEvent>({
    type: 'server_log',

    patterns: [
        concatPattern`^Log file (?<logState>started|closed)(?: \\(file "(?<filePath>.+)"\\) \\(game "(?<gamePath>.+)"\\) \\(version "(?<version>.+)"\\))?$`,
        concatPattern`^(?<mapState>Loading|Started) map "(?<map>.+)"(?: \\(CRC "(?<crc>.+)"\\))?$`,
        concatPattern`^server_message: "(?<message>.+)"$`,
    ],

    parse({
        logState,
        filePath,
        gamePath,
        version,

        mapState,
        map,
        crc,

        message,
    }) {
        if (logState !== undefined) {
            return {
                kind: 'log_file',
                state: logState as ServerLogFileEvent['state'],
                filePath,
                gamePath,
                version,
            };
        }

        if (mapState !== undefined) {
            return {
                kind: 'map',
                state: mapState.toLowerCase() as ServerLogMapEvent['state'],
                map,
                crc,
            };
        }

        return {
            kind: 'message',
            message,
        };
    },
});
