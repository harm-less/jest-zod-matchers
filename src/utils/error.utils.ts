import {SafeParseError, SafeParseReturnType} from 'zod';
import {fromZodError} from 'zod-validation-error';

export function isSafeParseError(
	receivedSafeParseReturnType: SafeParseReturnType<unknown, unknown>
): receivedSafeParseReturnType is SafeParseError<unknown> {
	return receivedSafeParseReturnType.success === false;
}

export function handleSafeParseError(
	context: jest.MatcherContext,
	receivedResponse: SafeParseError<unknown>,
	{
		matcherHint
	}: {
		matcherHint: string;
	}
): jest.CustomMatcherResult {
	const receivedErrorMessage = getCleanZodError(receivedResponse).message;

	return {
		message: () =>
			matcherHint +
			'\n\n' +
			'Expected Zod schema input to be valid but a Zod error occured instead.' +
			'\n\n' +
			context.utils.BOLD_WEIGHT(`Zod error: ${receivedErrorMessage}`),
		pass: false
	};
}

export function getCleanZodError(receivedError: SafeParseError<unknown>) {
	return fromZodError(receivedError.error, {
		maxIssuesInMessage: 1,
		prefix: '',
		prefixSeparator: ''
	});
}
