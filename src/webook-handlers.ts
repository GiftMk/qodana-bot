import { app } from './app'
import { env } from './environment'
import { logger } from './logger'

app.webhooks.on('issues.opened', async ({ octokit, payload }) => {
	logger.info('Handling issues.opened event')

	const body = [
		`# Sample GitHub App, ID: ${env.GITHUB_APP_IDENTIFIER}`,
		`## Let's make something cool!`,
	].join('\n')

	try {
		await octokit.request(
			'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
			{
				owner: payload.repository.owner.login,
				repo: payload.repository.name,
				issue_number: payload.issue.number,
				body,
			},
		)

		logger.info(`Commented on issue ${payload.issue.number}`)
	} catch (e) {
		const message = e instanceof Error ? e.message : JSON.stringify(e)
		logger.error(
			`Failed to comment on issue ${payload.issue.number}, the following error occurred: ${message}`,
		)
	}
})
