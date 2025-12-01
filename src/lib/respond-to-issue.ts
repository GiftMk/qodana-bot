import type { RequestContext } from '../types/request-context'
import { codeBlock } from './code-block'
import { createLinterFiles } from './create-linter-files'
import { createWorkflowFile } from './create-workflow-file'
import { quoteBlock } from './quote-block'
import { parseRepositoryConfig } from './repository-config'
import crypto from 'node:crypto'

export const respondToIssue = async ({ repository, issue }: RequestContext) => {
	if (!issue.matches('@qodana-bot')) {
		return
	}

	await issue.react('eyes')

	const config = parseRepositoryConfig(issue.body)

	if (!config) {
		await issue.comment(
			quoteBlock('Only supported languages are: c#, java, ts'),
			`Sorry, I couldn't interpret your issue description 😅.`,
			'If your repo is a monorepo, please provide a simple list of package names and their respective languages like so:',
			codeBlock(
				'packages/frontend: ts',
				'packages/backend: c#',
				'packages/utils: ts',
			),
			'Otherwise simply leave the language in the description.',
		)

		return
	}

	await issue.comment(
		`Let me cook 🍳`,
		quoteBlock('Sometimes I can take a min, please be patient 🤷‍♂️'),
	)

	const branch = await repository.createBranch(
		`qodana-setup-${crypto.randomUUID()}`,
	)
	const workflowFile = createWorkflowFile(config)
	const linterFiles = createLinterFiles(config)
	await branch.addFiles(workflowFile, ...linterFiles)
	const pullRequest = await branch.openPullRequest('Add Qodana workflow')

	await issue.comment(`Created pull request: ${pullRequest}`)
}
