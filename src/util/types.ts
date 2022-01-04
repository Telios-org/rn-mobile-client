type ResultSuccess<T> = { type: 'success'; value: T };

type ResultError = { type: 'error'; error: Error };

type Result<T> = ResultSuccess<T> | ResultError;
