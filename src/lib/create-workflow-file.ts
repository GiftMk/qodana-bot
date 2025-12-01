import YAML from 'yaml'
import { File } from '../models/file'
import type { RepositoryConfig } from './repository-config'
import { readTemplate } from './readTemplate'
import { getPackageName } from './get-package-name'

export const createWorkflowFile = (config: RepositoryConfig): File => {
	const workflowTemplate = readTemplate('pr-workflow.yml')
	const workflow = { ...workflowTemplate, jobs: createWorkflowJobs(config) }

	return new File(
		'.github/workflows/qodana.yaml',
		YAML.stringify(workflow, { indent: 2 }),
	)
}

const createWorkflowJobs = (config: RepositoryConfig) => {
	if (!config.monorepo) {
		return [
			readTemplate('job.yml', {
				'<QODANA_TOKEN>': 'todo',
			}),
		]
	}

	const packages = Object.entries(config.packages)

	return packages.map(([path]) => {
		return readTemplate('job-monorepo.yml', {
			'<PACKAGE_NAME>': getPackageName(path),
			'<QODANA_TOKEN>': 'todo',
		})
	})
}
