export type ResultSuccess<T> = { type: 'success'; value: T };

export type ResultError = { type: 'error'; error: Error };

export type Result<T> = ResultSuccess<T> | ResultError;

export type IconAccessory = { name: string; color?: string; size?: number };
