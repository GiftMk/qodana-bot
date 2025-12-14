import YAML from 'yaml'
import { File } from '../models/file'
import { readTemplate } from './read-template'
import type { RepositoryConfig } from '../models/repository-config'
import type { ProjectTokens } from './create-qodana-projects'
import invariant from 'tiny-invariant'
import { env } from '../environment'

export const createWorkflowFile = (
	config: RepositoryConfig,
	projectTokens: ProjectTokens,
): File => {
	const workflowTemplate = readTemplate('pr-workflow.yml')
	const workflow = {
		...workflowTemplate,
		jobs: createWorkflowJobs(config, projectTokens),
	}

	return new File(
		'.github/workflows/qodana.yaml',
		YAML.stringify(workflow, { indent: 2 }),
	)
}

const createWorkflowJobs = (
	config: RepositoryConfig,
	projectTokens: ProjectTokens,
) => {
	return config.projects.map(project => {
		const token = projectTokens[project.name]?.name
		invariant(token, `Failed to get project token for project ${project.name}`)
		const template = project.isRoot ? 'job-root.yml' : 'job-package.yml'
		const variables = {
				'<QODANA_TOKEN>': token,
				"<QODANA_ENDPOINT>": env.QODANA_ENDPOINT,
				"<LANGUAGE>": project.language,
				'<PACKAGE_NAME>': project.name
		}

		return readTemplate(template, variables)
	})
}
