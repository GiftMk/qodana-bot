import { createApp } from './create-app'
import { logger } from './logger'
import { respondToIssue } from './lib/respond-to-issue'
import { createContext } from './lib/create-context'

export const app = createApp()

app.webhooks.on('issues.opened', async ({ octokit, payload }) => {
	logger.info('Handling issues.opened event')

	const context = await createContext(
		octokit,
		payload.repository,
		payload.issue,
	)
	await respondToIssue(context)
})

app.webhooks.on('issues.reopened', async ({ octokit, payload }) => {
	logger.info('Handling issues.reopened event')

	const context = await createContext(
		octokit,
		payload.repository,
		payload.issue,
	)
	await respondToIssue(context)
})
