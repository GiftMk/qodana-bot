import { logger } from '../logger'
import { repoConfigSchema, type RepoConfig } from '../types/repo-config'
import YAML from 'yaml'
import { getErrorMessage } from '../utils'

export const parseRepoConfig = async (
	content: string | null,
): Promise<RepoConfig> => {
	if (!content?.length) {
		return { monorepo: false }
	}

	try {
		const yaml = YAML.parse(content)
		return repoConfigSchema.parse({ monorepo: true, ...yaml })
	} catch (error) {
		logger.error(`Failed to parse repo config: ${getErrorMessage(error)}`)
		throw error
	}
}
