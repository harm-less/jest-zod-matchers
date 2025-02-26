import {toBeValidZodObject} from './matchers/to-be-valid-zod-object.matcher';
import {toThrowZodError} from './matchers/to-throw-zod-error.matcher';

declare global {
	namespace jest {
		interface Matchers<R> {
			toBeValidZodObject<Response extends Record<string, unknown>>(
				zodOutputObject?: Partial<Response>
			): R;
			toThrowZodError(expectedError: string): R;
		}
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getJestZodMatchers(this: any) {
	return {
		toBeValidZodObject,
		toThrowZodError
	};
}
