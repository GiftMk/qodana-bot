import type { RepoConfig } from '../types/repo-config'
import { logger } from '../logger'
import { getErrorMessage } from '../utils'

export const validateConfig = async (_: RepoConfig) => {
	try {
		return true
	} catch (error) {
		logger.error(`Failed to validate config: ${getErrorMessage(error)}`)
		throw error
	}
}
