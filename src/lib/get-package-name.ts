import { logger } from '../logger'

export const getPackageName = (path: string) => {
	const name = path.split('/').pop()

	if (!name) {
		throw new Error(`Failed to get package name. Invalid package path: ${path}`)
	}

	logger.info(`Getting package name for path: ${path}`)

	return name
}
