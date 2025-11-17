import type { RequestContext } from '../types/request-context'
import { codeBlock } from './code-block'
import { createWorkflowFile } from './create-workflow-file'

const TARGET_ISSUE_TITLE = 'qodana setup bot'
const BRANCH_NAME = 'qodana-setup'

export const respondToIssue = async ({ repository, issue }: RequestContext) => {
	if (!issue.matches(TARGET_ISSUE_TITLE)) {
		return
	}

	await issue.react('eyes')

	if (!issue.body) {
		await issue.comment(
			`Sorry, I couldn't interpret your issue description 😅.`,
			'If your repo is a monorepo, please provide a simple list of package names like so:',
			codeBlock('- frontend', '- backend', '- utils'),
			'Otherwise leave the description blank',
		)

		return
	}

	await issue.comment(`Let me cook 🍳`)

	const branch = await repository.createBranch(BRANCH_NAME)
	const workflowFile = createWorkflowFile(issue.body)
	await branch.addFile(workflowFile)
}
