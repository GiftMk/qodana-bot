import { logger } from '../logger'
import { getErrorMessage } from '../utils'
import YAML from 'yaml'
import z from 'zod'

const languageSchema = z.enum(['c#', 'java', 'ts'])

export type Language = z.infer<typeof languageSchema>

const packagesSchema = z.record(z.string(), languageSchema)

const schema = z.union([
	z.object({
		monorepo: z.literal(true),
		packages: packagesSchema,
	}),
	z.object({
		monorepo: z.literal(false),
		language: languageSchema,
	}),
])

export type RepositoryConfig = z.infer<typeof schema>

export const parseRepositoryConfig = (
	body: string | null,
): RepositoryConfig | null => {
	if (!body?.length) {
		return null
	}

	try {
		const yaml = YAML.parse(body)

		if (typeof yaml === 'string') {
			return { monorepo: false, language: yaml as Language }
		}

		const result = schema.safeParse({
			monorepo: true,
			packages: yaml,
		})
		if (!result.success) {
			throw new Error(result.error?.message)
		}

		return result.data
	} catch (error) {
		logger.error(
			`Failed to parse repo config '${body}': ${getErrorMessage(error)}`,
		)
		return null
	}
}
