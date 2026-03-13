export function defaultLexicalJson() {
	return {
		root: {
			children: [
				{
					children: [],
					type: "paragraph",
					version: 1,
				},
			],
			type: "root",
			version: 1,
		},
	};
}

export function deepEqual(a: any, b: any): boolean {
	if (a === b) return true;

	if (
		typeof a === "object" &&
		a !== null &&
		typeof b === "object" &&
		b !== null
	) {
		const aKeys = Object.keys(a);
		const bKeys = Object.keys(b);

		if (aKeys.length !== bKeys.length) return false;

		for (const key of aKeys) {
			if (!deepEqual(a[key], b[key])) return false;
		}

		return true;
	}

	return false;
}
