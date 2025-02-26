import {SafeParseReturnType} from 'zod';
import {MatcherHintOptions} from 'jest-matcher-utils';
import {getCleanZodError, isSafeParseError} from '../utils/error.utils';

export const TO_THROW_ZOD_ERROR_MATCHER_NAME = 'toThrowZodError';
export const RECEIVED_ZOD_SAFE_PARSE_RETURN_TYPE = 'zodSafeParseReturnType';
export const EXPECTED_ZOD_ERROR_OJBECT = 'expectedErrorMessage';

export function toThrowZodError(
	this: jest.MatcherContext,
	zodSafeParseReturnType: SafeParseReturnType<unknown, unknown>,
	expectedErrorMessage: string
): jest.CustomMatcherResult {
	const isNot = this.isNot || false;
	const options: MatcherHintOptions = {
		comment: 'Zod schema validation error message equality',
		isNot,
		promise: this.promise
	};
	const matcherHint = this.utils.matcherHint(
		TO_THROW_ZOD_ERROR_MATCHER_NAME,
		RECEIVED_ZOD_SAFE_PARSE_RETURN_TYPE,
		EXPECTED_ZOD_ERROR_OJBECT,
		options
	);

	if (!isSafeParseError(zodSafeParseReturnType)) {
		return {
			message: () =>
				matcherHint +
				'\n\n' +
				`Expected an error to have been thrown with the following message: \n${this.utils.printExpected(
					expectedErrorMessage
				)} \n\nBut no error was throw.`,
			pass: false
		};
	}

	const cleanZodError = getCleanZodError(zodSafeParseReturnType);
	const {message: receivedMessage} = cleanZodError;
	const pass = this.equals(receivedMessage, expectedErrorMessage);

	const message = pass
		? () =>
				matcherHint +
				'\n\n' +
				'Expected a Zod error to have been thrown, but it should not equal the expected error' +
				'\n\n' +
				this.utils.printDiffOrStringify(
					expectedErrorMessage,
					receivedMessage,
					'Expected',
					'Received',
					!!this.expand
				)
		: () =>
				matcherHint +
				'\n\n' +
				this.utils.printDiffOrStringify(
					expectedErrorMessage,
					receivedMessage,
					'Expected',
					'Received',
					!!this.expand
				);

	return {message, pass};
}
