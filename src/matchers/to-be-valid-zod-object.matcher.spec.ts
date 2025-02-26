import {ZodEffects, ZodString, z} from 'zod';
import {parseObjectSchema} from '../utils/parse.utils';
import {toBeValidZodObject} from './to-be-valid-zod-object.matcher';

describe('"toBeValidZodObject" matcher', () => {
	let FooSchema: z.ZodObject<{
		foo: z.ZodString;
	}>;
	let TransformSchema: z.ZodObject<{
		foo: ZodEffects<ZodString, string, string>;
	}>;

	beforeEach(() => {
		expect.extend({toBeValidZodObject});

		FooSchema = z.object({
			foo: z.string()
		});
		TransformSchema = z.object({
			foo: z.string().transform((value) => `<${value}>`)
		});
	});

	test('parsed object to be valid', () => {
		expect(parseObjectSchema(FooSchema, {foo: 'bar'})).toBeValidZodObject();
	});

	test('parsed object with expected result to be valid', () => {
		expect(parseObjectSchema(FooSchema, {foo: 'bar'})).toBeValidZodObject<
			z.infer<typeof FooSchema>
		>({foo: 'bar'});
	});

	test('parsed object with transformed key to be valid', () => {
		expect(parseObjectSchema(TransformSchema, {foo: 'bar'})).toBeValidZodObject<
			z.infer<typeof FooSchema>
		>({foo: '<bar>'});
	});

	test('invalid parsed object not to be valid', () => {
		expect(parseObjectSchema(FooSchema, {foo: 'bar'})).not.toBeValidZodObject<
			z.infer<typeof FooSchema>
		>({foo: 'baz'});
	});

	describe('errors', () => {
		it('should throw error an error as the input is invalid', () => {
			expect(() =>
				expect(parseObjectSchema(FooSchema, {bar: 'foo'})).toBeValidZodObject()
			).toThrowErrorMatchingSnapshot();
		});

		test('invalid parsed object with expected result', () => {
			expect(() =>
				expect(parseObjectSchema(FooSchema, {foo: 'bar'})).toBeValidZodObject<
					z.infer<typeof FooSchema>
				>({foo: 'baz'})
			).toThrowErrorMatchingSnapshot();
		});

		test('invalid parsed object with transformed key', () => {
			expect(() =>
				expect(parseObjectSchema(TransformSchema, {foo: 'bar'})).toBeValidZodObject<
					z.infer<typeof FooSchema>
				>({foo: '<baz>'})
			).toThrowErrorMatchingSnapshot();
		});

		test('negated validation but without supplying zod output object', () => {
			expect(() =>
				expect(parseObjectSchema(FooSchema, {foo: 'bar'})).not.toBeValidZodObject<
					z.infer<typeof FooSchema>
				>()
			).toThrowErrorMatchingSnapshot();
		});

		test('zod object to not be valid', () => {
			expect(() =>
				expect(parseObjectSchema(FooSchema, {foo: 'bar'})).not.toBeValidZodObject<
					z.infer<typeof FooSchema>
				>({foo: 'bar'})
			).toThrowErrorMatchingSnapshot();
		});

		it('should throw an error if an expected property is not set in the received object', () => {
			expect(() =>
				expect(parseObjectSchema(FooSchema, {foo: 'bar'})).toBeValidZodObject({bar: 'bar'})
			).toThrowErrorMatchingSnapshot();
		});
	});
});
