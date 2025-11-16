import 'dotenv/config'
import { cleanEnv, num, str, url } from 'envalid'

export const env = cleanEnv(process.env, {
	GITHUB_APP_IDENTIFIER: str(),
	PRIVATE_KEY_FILE: str(),
	GITHUB_WEBHOOK_SECRET: str(),
	WEBHOOK_PROXY_URL: url({ default: undefined }),
	SERVER_PORT: num({ default: 3000 }),
	OAUTH_CLIENT_ID: str({ default: '' }),
	OAUTH_CLIENT_SECRET: str({ default: '' }),
})
