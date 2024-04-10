import { Socket, createSocket } from 'dgram';
import { EventEmitter } from 'events';
import { promisify } from 'util';

import { arraify } from './helpers';
import { parsePacket } from './parser';
import {
	AllowArray,

	ILogEvent,
	ISrcdsLogReceiverServer,
	ISrcdsLogReceiverOptions
} from './types';

export interface SrcdsLogReceiver {
	on(event: 'error', listener: (error: Error) => void): this
	on(event: 'log', listener: (log: ILogEvent) => void): this;
}

export class SrcdsLogReceiver extends EventEmitter {
	protected socket: Socket | undefined;

	protected options: Required<ISrcdsLogReceiverOptions>;

	protected servers: Map<string, ISrcdsLogReceiverServer> = new Map();

	public constructor(options: ISrcdsLogReceiverOptions = {}) {
		super();

		this.options = {
			hostname: '0.0.0.0',
			port: 9871,
			onlyRegisteredServers: true,

			...options
		};
	}

	public listen(): Promise<void> {
		const { onlyRegisteredServers } = this.options;

		this.socket = createSocket('udp4', (original, receivedFrom) => {
			const server = this.servers.get(`${receivedFrom.address}:${receivedFrom.port}`);

			if (!server && onlyRegisteredServers) {
				return;
			}

			const receivedAt = new Date();

			try {
				const payload = parsePacket(original, server?.password);

				this.emit('log', {
					payload,

					receivedAt,
					receivedFrom,

					original
				});
			} catch (error) {
				this.emit('error', error);
			}
		});

		const { hostname, port } = this.options;

		return promisify<number, string>(this.socket.bind).call(this.socket, port, hostname);
	}

	public async close(): Promise<void> {
		if (!this.socket) {
			throw new Error('The connection is already closed');
		}

		await promisify(this.socket.close).call(this.socket);

		this.socket = undefined;
	}

	public addServers(servers: AllowArray<ISrcdsLogReceiverServer>): this {
		for (const server of arraify(servers)) {
			this.servers.set(`${server.hostname}:${server.port}`, server);
		}

		return this;
	}

	public deleteServers(servers: AllowArray<ISrcdsLogReceiverServer>): this {
		for (const server of arraify(servers)) {
			this.servers.delete(`${server.hostname}:${server.port}`);
		}

		return this;
	}
}
