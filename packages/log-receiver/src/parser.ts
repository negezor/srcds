import { ParseError, ParseErrorCode } from './errors';

const packetHeader = Buffer.alloc(4, 255);

const MAGIC_END_HEADER = 'L ';
const { length: magicEndHeaderLength } = MAGIC_END_HEADER;

export enum PacketCredentialByte {
	PASSWORD = 0x53,
	NO_PASSWORD = 0x52
}

export const extractPassword = (message: Buffer, endHeaderPosition: number): string => (
	message.slice(magicEndHeaderLength + 1, endHeaderPosition).toString()
);

export const extractPayload = (message: Buffer, endHeaderPosition: number): string => (
	message.slice(endHeaderPosition + magicEndHeaderLength, message.length - 2).toString()
);

export const validatePassword = (
	message: Buffer,
	endHeaderPosition: number,
	password?: string
): void => {
	const { 4: credentialByte } = message;

	const hasPassword = password !== undefined;

	if (credentialByte === PacketCredentialByte.NO_PASSWORD) {
		if (hasPassword) {
			throw new ParseError({
				message: 'The server did not send the password',
				code: ParseErrorCode.INVALID_PASSWORD
			});
		}

		return;
	}

	if (credentialByte !== PacketCredentialByte.PASSWORD) {
		throw new ParseError({
			message: 'Unknown credential type',
			code: ParseErrorCode.INVALID_PASSWORD
		});
	}

	if (!hasPassword) {
		throw new ParseError({
			message: 'Password not set',
			code: ParseErrorCode.INVALID_PASSWORD
		});
	}

	const receivedPassword = extractPassword(message, endHeaderPosition);

	if (password !== receivedPassword) {
		throw new ParseError({
			message: 'Passwords do not match',
			code: ParseErrorCode.WRONG_PASSWORD
		});
	}
};

export const parsePacket = (message: Buffer, password?: string): string => {
	if (message.length < 16) {
		throw new ParseError({
			message: 'Package less than 16 bytes',
			code: ParseErrorCode.TOO_SHORT
		});
	}

	if (message.slice(0, packetHeader.length).compare(packetHeader) !== 0) {
		throw new ParseError({
			message: 'Header content does not match',
			code: ParseErrorCode.BAD_HEADER
		});
	}

	const endHeaderPosition = message.indexOf(MAGIC_END_HEADER);

	if (endHeaderPosition < 0) {
		throw new ParseError({
			message: 'Header ending not found',
			code: ParseErrorCode.BAD_HEADER
		});
	}

	validatePassword(message, endHeaderPosition, password);

	return extractPayload(message, endHeaderPosition);
};
