import {z} from 'zod';
import {parseObjectSchema} from '../utils/parse.utils';
import {toThrowZodError} from './to-throw-zod-error.matcher';

describe('"zodParseToThrowError" matcher', () => {
	let FooSchema: z.ZodObject<{
		foo: z.ZodString;
	}>;

	beforeEach(() => {
		expect.extend({toThrowZodError});

		FooSchema = z.object({
			foo: z.string()
		});
	});

	it('should have the expected Zod error due to an incorrect schema', () => {
		expect(parseObjectSchema(FooSchema, {foo: 10})).toThrowZodError(
			'Expected string, received number at \"foo\"'
		);
	});

	it('should not have the expected Zod error due to an incorrect schema', () => {
		expect(parseObjectSchema(FooSchema, {foo: 10})).not.toThrowZodError('Other error');
	});

	describe('errors', () => {
		it('should throw an error as the input is valid', () => {
			expect(() =>
				expect(parseObjectSchema(FooSchema, {foo: 'bar'})).toThrowZodError(
					'This will not be triggered'
				)
			).toThrowErrorMatchingSnapshot();
		});

		it('should throw an error as the Zod error should not be the same as the expected error', () => {
			expect(() =>
				expect(parseObjectSchema(FooSchema, {foo: 10})).not.toThrowZodError(
					'Expected string, received number at \"foo\"'
				)
			).toThrowErrorMatchingSnapshot();
		});
	});
});
