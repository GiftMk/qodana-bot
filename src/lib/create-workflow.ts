import type { RepoConfig } from '../types/repo-config'
import qodanaJob from '../resource/qodana-job.json'
import qodanaJobMonorepo from '../resource/qodana-job-monorepo.json'
import qodanaWorkflow from '../resource/pr-workflow.json'
import YAML from 'yaml'

export const createWorkflow = (config: RepoConfig) => {
	const workflow = { ...qodanaWorkflow, jobs: createWorkflowJobs(config) }
	return YAML.stringify(workflow, { indent: 2 })
}

const createWorkflowJobs = (config: RepoConfig) => {
	if (!config.monorepo) {
		return [qodanaJob]
	}

	return config.packages.map(name =>
		replaceVariable('<PACKAGE_NAME>', name, qodanaJobMonorepo),
	)
}

const replaceVariable = (variable: string, value: string, object: object) => {
	const string = JSON.stringify(object)
	return JSON.parse(string.replace(variable, value))
}
