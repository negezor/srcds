import { LogReceiverError } from './error';

export enum ParseErrorCode {
	TOO_SHORT = 'TOO_SHORT',
	BAD_HEADER = 'BAD_HEADER',
	BAD_PACKET = 'BAD_PACKET',
	WRONG_PASSWORD = 'WRONG_PASSWORD',
	INVALID_PASSWORD = 'INVALID_PASSWORD',
	INVALID_PAYLOAD = 'INVALID_PAYLOAD'
}

export class ParseError extends LogReceiverError {
	public code!: ParseErrorCode;
}
