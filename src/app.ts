import { App } from '@octokit/app'
import { env } from './environment'
import fs from 'node:fs'

const privateKey = fs.readFileSync(env.PRIVATE_KEY_FILE, 'utf-8')

export const app = new App({
	appId: env.GITHUB_APP_IDENTIFIER,
	privateKey,
	webhooks: { secret: env.GITHUB_WEBHOOK_SECRET },
	oauth: {
		clientId: env.OAUTH_CLIENT_ID,
		clientSecret: env.OAUTH_CLIENT_SECRET,
	},
})
