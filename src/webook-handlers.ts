import { app } from './app'
import { commentOnIssue } from './lib/comment-on-issue'
import { reactToIssue } from './lib/react-to-issue'
import { logger } from './logger'
import type { RequestContext } from './types/request-context'
import { parseRepoConfig } from './lib/parse-repo-config'
import { validateConfig } from './lib/validate-config'
import { codeBlock } from './lib/code-block'

app.webhooks.on('issues.opened', async ({ octokit, payload }) => {
	logger.info('Handling issues.opened event')

	const context: RequestContext = {
		issue: {
			owner: payload.repository.owner.login,
			repo: payload.repository.name,
			issue_number: payload.issue.number,
		},
		octokit,
	}

	reactToIssue(context, 'eyes')
	const repoConfig = await parseRepoConfig(payload.issue.body)
	const isConfigValid = await validateConfig(repoConfig)

	if (!isConfigValid) {
		await commentOnIssue(
			context,
			`Sorry, I couldn't interpret your issue description 😅.`,
			'If your repo is a monorepo, please provide a simple list of package names like so:',
			codeBlock('- frontend', '- backend', '- utils'),
			'Otherwise leave the description blank 😊',
		)

		return
	}

	await commentOnIssue(
		context,
		'Thanks for raising this issue!',
		`I'll get to work on it right away 🫡`,
	)
})
