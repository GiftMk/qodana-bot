import YAML from 'yaml'
import { File } from '../models/file'
import { readTemplate } from './read-template'
import { getPackageName } from './get-package-name'
import type { RepositoryConfig } from '../models/repository-config'
import type { ProjectTokens } from './create-qodana-projects'

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

		if (!token) {
			throw new Error(`Failed to get project token for project ${project.name}`)
		}

		if (project.isRoot) {
			return readTemplate('job-root.yml', {
				'<QODANA_TOKEN>': token,
			})
		}

		return readTemplate('job-package.yml', {
			'<PACKAGE_NAME>': getPackageName(project.path),
			'<QODANA_TOKEN>': token,
		})
	})
}
