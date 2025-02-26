import {SafeParseReturnType} from 'zod';
import {MatcherHintOptions} from 'jest-matcher-utils';
import {handleSafeParseError, isSafeParseError} from '../utils/error.utils';
import {formatExpectedResult} from '../utils/format.utils';
import {TO_THROW_ZOD_ERROR_MATCHER_NAME} from './to-throw-zod-error.matcher';

const TO_BE_VALID_ZOD_OBJECT_MATCHER_NAME = 'toBeValidZodObject';
const RECEIVED_ZOD_SAFE_PARSE_RETURN_TYPE = 'zodSafeParseReturnType';
const EXPECTED_ZOD_OUTPUT_OJBECT = 'zodOutputObject';

export function toBeValidZodObject(
	this: jest.MatcherContext,
	zodSafeParseReturnType: SafeParseReturnType<unknown, unknown>,
	zodOutputObject: Record<string, unknown> = {}
): jest.CustomMatcherResult {
	const options: MatcherHintOptions = {
		comment: 'Validate Zod object schema',
		isNot: this.isNot,
		promise: this.promise
	};
	const matcherHint = this.utils.matcherHint(
		TO_BE_VALID_ZOD_OBJECT_MATCHER_NAME,
		RECEIVED_ZOD_SAFE_PARSE_RETURN_TYPE,
		EXPECTED_ZOD_OUTPUT_OJBECT,
		options
	);

	const expectedZodOutputObjectKeys = Object.keys(zodOutputObject);

	if (options.isNot && expectedZodOutputObjectKeys.length === 0) {
		return {
			message: () =>
				matcherHint +
				'\n\n' +
				`This test is negated with the ".not" keyword and the "${EXPECTED_ZOD_OUTPUT_OJBECT}" object is undefined. Either make sure the received "${RECEIVED_ZOD_SAFE_PARSE_RETURN_TYPE}" is of type "SafeParseSuccess" or if you want to test Zod error messages use the "${TO_THROW_ZOD_ERROR_MATCHER_NAME}" matcher instead of "${TO_BE_VALID_ZOD_OBJECT_MATCHER_NAME}"`,
			pass: true
		};
	}

	if (isSafeParseError(zodSafeParseReturnType)) {
		return handleSafeParseError(this, zodSafeParseReturnType, {matcherHint});
	}

	const zodSafeParsedData = zodSafeParseReturnType.data as Record<string, unknown>;

	let pickedReceivedData: Record<string, unknown> = {};
	try {
		const expectedResultGivenKeys = expectedZodOutputObjectKeys;
		pickedReceivedData = expectedResultGivenKeys.reduce<
			Record<keyof typeof expectedResultGivenKeys, unknown>
		>(
			(expectedResults, key) => {
				if (typeof zodOutputObject[key] !== 'undefined' && !zodSafeParsedData.hasOwnProperty(key)) {
					throw new Error(
						`Property "${key}" provided in expected result, but this property does not exist in the received Zod input object. Either remove key "${key}" from your expected result, or make sure it's available in the received Zod input object`
					);
				}
				expectedResults[key as keyof typeof expectedResultGivenKeys] = zodSafeParsedData[key];
				return expectedResults;
			},
			{} as Record<keyof typeof expectedResultGivenKeys, unknown>
		);
	} catch (error) {
		const thrownError = error as Error;
		return {
			message: () => matcherHint + '\n\n' + `${thrownError.message}`,
			pass: false
		};
	}

	return {
		message: () =>
			matcherHint +
			'\n\n' +
			this.utils.printDiffOrStringify(
				zodOutputObject,
				zodSafeParsedData,
				'zodSafeParseData',
				EXPECTED_ZOD_OUTPUT_OJBECT,
				!!this.expand
			),
		pass: this.equals(pickedReceivedData, formatExpectedResult(zodOutputObject))
	};
}
