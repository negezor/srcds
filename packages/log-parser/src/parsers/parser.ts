export interface IBaseEvent<T, P> {
    type: T;
    receivedAt: Date;

    payload: P;
}

export interface IBaseParser<T extends IBaseEvent<string, unknown>> {
    type: T['type'];
    patterns: RegExp[];
    parse(groups: Record<string, string>): T['payload'];
}

export function defineParser<T extends IBaseEvent<string, unknown>>(parser: IBaseParser<T>): IBaseParser<T> {
    return parser;
}
