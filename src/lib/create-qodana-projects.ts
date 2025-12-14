import z from 'zod'
import { env } from '../environment'
import type { RepositoryConfig } from '../models/repository-config'
import crypto from 'node:crypto'

const responseSchema = z.object({
	projectToken: z.string(),
})

export type ProjectTokens = Record<string, { name: string; value: string }>

export const createQodanaProjects = async (
	config: RepositoryConfig,
): Promise<ProjectTokens> => {
	const tokens: ProjectTokens = {}

	for (const project of config.projects) {
		const token = await createQodanaProject(config.team, project.name)
		tokens[project.name] = {
			name: `QODANA_${crypto.randomUUID()}`,
			value: token,
		}
	}

	return tokens
}

const createQodanaProject = async (teamName: string, projectName: string) => {
	const body = {
		teamName,
		projectName,
	}

	const response = await fetch(
		`https://${env.QODANA_CLOUD_URL}/api/v1/public/organizations/projects`,
		{
			method: 'POST',
			body: JSON.stringify(body),
		},
	)

	const result = responseSchema.safeParse(response)

	if (result.error) {
		throw new Error(
			`Failed to create Qodana project ${projectName} in team ${teamName}`,
		)
	}

	return result.data.projectToken
}
