import {ParseParams, ZodRawShape, z} from 'zod';

export function parseObjectSchema(
	objectSchema: z.ZodObject<ZodRawShape>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value: any,
	params?: Partial<ParseParams>
) {
	return objectSchema.safeParse(value, params);
}
