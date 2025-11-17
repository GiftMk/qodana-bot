import qodanaJob from '../resources/qodana-job.json'
import qodanaJobMonorepo from '../resources/qodana-job-monorepo.json'
import qodanaWorkflow from '../resources/pr-workflow.json'
import YAML from 'yaml'
import type { IssueBody } from '../models/issue'
import { File } from '../models/file'

export const createWorkflowFile = (body: IssueBody): File => {
	const workflow = { ...qodanaWorkflow, jobs: createWorkflowJobs(body) }

	return new File(
		'.github/workflows/qodana.yml',
		YAML.stringify(workflow, { indent: 2 }),
	)
}

const createWorkflowJobs = (body: IssueBody) => {
	if (!body.monorepo) {
		return [qodanaJob]
	}

	return body.packages.map(name =>
		replaceVariable('<PACKAGE_NAME>', name, qodanaJobMonorepo),
	)
}

const replaceVariable = (variable: string, value: string, object: object) => {
	const string = JSON.stringify(object)
	return JSON.parse(string.replace(variable, value))
}
