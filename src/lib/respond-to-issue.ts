import type { RequestContext } from '../types/request-context'
import { codeBlock } from './code-block'
import { commentOnIssue } from './comment-on-issue'
import { parseRepoConfig } from './parse-repo-config'
import { reactToIssue } from './react-to-issue'
import { validateConfig } from './validate-config'

const TARGET_ISSUE_TITLE = 'qodana setup bot'

export const respondToIssue = async (context: RequestContext) => {
	if (!context.issue.title.toLowerCase().includes(TARGET_ISSUE_TITLE)) {
		return
	}

	reactToIssue(context, 'eyes')
	const repoConfig = parseRepoConfig(context.issue?.body)
	const isConfigValid = repoConfig ? await validateConfig(repoConfig) : false

	if (!isConfigValid) {
		await commentOnIssue(
			context,
			`Sorry, I couldn't interpret your issue description 😅.`,
			'If your repo is a monorepo, please provide a simple list of package names like so:',
			codeBlock('- frontend', '- backend', '- utils'),
			'Otherwise leave the description blank',
		)

		return
	}

	await commentOnIssue(context, `Let me cook 🍳`)
}
