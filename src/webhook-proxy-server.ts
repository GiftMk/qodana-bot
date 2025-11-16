import { SmeeClient } from 'smee-client'
import { env } from './environment'
import { exit } from 'process'
import { logger } from './logger'

if (!env.WEBHOOK_PROXY_URL) {
	logger.info(
		`Skipping Smee.io Webhook Proxy, WEBHOOK_PROXY_URL is not defined`,
	)
	exit()
}

const target = `http://localhost:${env.SERVER_PORT}/api/github/webhooks`

const smee = new SmeeClient({
	source: env.WEBHOOK_PROXY_URL,
	target,
	logger,
})

smee.start()
