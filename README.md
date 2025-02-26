# jest-zod-matchers

> Custom [Jest](https://jestjs.io/en/) matchers to help validate Zod schemas and to prevent having a lot of boilerplate

[Basic Usage](#basic-usage) | [API](#api) | [Installation](#installation) | [License](#license)

## Basic Usage

First, add the custom matchers to Jest. A convenient way to do this is via a setup file included in [`setupFilesAfterEnv`](https://jestjs.io/docs/en/configuration.html#setupfilesafterenv-array):

```ts
import {getJestZodMatchers} from 'jest-zod-matchers';
expect.extend(getJestZodMatchers());
```

Now you can use the custom matchers in your tests:

```ts
expect(safeParsedZodObjectSchema).toBeValidZodObject({foo: 'bar'});
expect(safeParsedZodSchema).toThrowZodError('Zod error');
```

## API

### `toBeValidZodObject(zodOutputObject?: Record<string, unknown>)`

Validates a safe parsed Zod schema and checks whether or not it's the expected successful result.

#### Arguments

- `zodOutputObject` - _Optional_ An object expecting key/value pairs. If `zodOutputObject` is not provided, the parsed result should at least be valid. If `zodOutputObject` is provided, it will check if all the given keys exist and if their values match the parsed result.

#### Examples

```js
expect(safeParsedZodObjectSchema).toBeValidZodObject(); // expects a valid parse result
expect(safeParsedZodObjectSchema).toBeValidZodObject({foo: 'bar'}); // expects "foo" to be available in the parsed result and its value be a string of "bar"
```

<hr />

### `toThrowZodError(expectedErrorMessage?: string)`

Expects a safe parsed Zod schema to throw at least one error. If at least one is thrown, the first error will be tested.

#### Arguments

- `expectedErrorMessage` - _Optional_ An error string. If `expectedErrorMessage` is not provided, the parsed result should at least throw any error. If `expectedErrorMessage` is provided, it will check if the first thrown error matches the value of `expectedErrorMessage`.

<hr />

## Installation

```
npm install -D jest-zod-matchers
```

## License

MIT
