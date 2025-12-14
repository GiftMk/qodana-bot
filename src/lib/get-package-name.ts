export const getPackageName = (path: string) => {
	const name = path.split('/').pop()

	if (!name) {
		throw new Error(`Failed to get package name. Invalid package path: ${path}`)
	}

	return name
}
