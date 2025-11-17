import { logger } from '../logger'
import { repoConfigSchema, type RepoConfig } from '../types/repo-config'
import YAML from 'yaml'
import { getErrorMessage } from '../utils'

export const parseRepoConfig = async (
	content: string | null | undefined,
): Promise<RepoConfig | null> => {
	if (!content?.length) {
		return { monorepo: false }
	}

	try {
		const yaml = YAML.parse(content)
		const result = repoConfigSchema.safeParse({ monorepo: true, ...yaml })
		if (!result.success) {
			throw new Error(result.error?.message)
		}

		return result.data
	} catch (error) {
		logger.error(`Failed to parse repo config: ${getErrorMessage(error)}`)
		return null
	}
}
