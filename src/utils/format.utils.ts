export function formatExpectedResult(obj: Record<string, unknown>): Record<string, unknown> {
	for (const propertyName in obj) {
		if (obj.hasOwnProperty(propertyName)) {
			const propertyValue = obj[propertyName];
			if (propertyValue instanceof Date) {
				obj[propertyName] = propertyValue.toISOString();
			} else if (typeof propertyValue === 'object' && propertyValue) {
				formatExpectedResult(propertyValue as Record<string, unknown>);
			}
		}
	}
	return obj;
}
