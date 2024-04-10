import type { RemoteInfo } from 'node:dgram';

export type AllowArray<T> = T | T[];

export interface ISrcdsLogReceiverOptions {
    hostname?: string;
    port?: number;

    onlyRegisteredServers?: boolean;
}

export interface ILogEvent {
    payload: string;

    receivedAt: Date;
    receivedFrom: RemoteInfo;

    original: Buffer;
}

export interface ISrcdsLogReceiverServer {
    hostname: string;
    port: number;

    password?: string;
}
