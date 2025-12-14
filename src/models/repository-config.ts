import z from 'zod'
import YAML from 'yaml'
import { logger } from '../logger'
import { getErrorMessage } from '../utils'

const languageSchema = z.enum(['c#', 'java', 'ts'])

export type Language = z.infer<typeof languageSchema>

const schema = z.object({
	team: z.string(),
	projects: z.record(z.string(), languageSchema),
})

type Project = {
	language: Language
	name: string
	path: string
	isRoot: boolean
}

export class RepositoryConfig {
	readonly team: string
	readonly projects: Project[]

	constructor(team: string, projects: Project[]) {
		this.team = team
		this.projects = projects
	}

	get isSingleLanguage(): boolean {
		return (
			this.projects.length === 1 &&
			!!this.projects[0] &&
			RepositoryConfig.isRoot(this.projects[0].path)
		)
	}

	private static isRoot(path: string): boolean {
		return path === './'
	}

	private static getPackageName(path: string) {
		const name = path.split('/').pop()

		if (!name) {
			throw new Error(
				`Failed to get package name. Invalid package path: ${path}`,
			)
		}

		return name
	}

	static from(body: string): RepositoryConfig | null {
		if (!body?.length) {
			return null
		}

		try {
			const yaml = YAML.parse(body)
			const result = schema.safeParse(yaml)

			if (!result.success) {
				throw new Error(result.error?.message)
			}

			const projects: Project[] = Object.entries(result.data.projects).map(
				([path, language]) => ({
					path,
					language,
					name: RepositoryConfig.getPackageName(path),
					isRoot: RepositoryConfig.isRoot(path),
				}),
			)

			return new RepositoryConfig(result.data.team, projects)
		} catch (error) {
			logger.error(
				`Failed to parse repo config '${body}': ${getErrorMessage(error)}`,
			)
			return null
		}
	}
}
