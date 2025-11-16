import { createNodeMiddleware } from '@octokit/app'
import { createServer } from 'node:http'
import { env } from './environment'
import { app } from './app'
import { logger } from './logger'

createServer(createNodeMiddleware(app)).listen(env.SERVER_PORT, () => {
	logger.info(`Server started on http://localhost:${env.SERVER_PORT} 🔥`)
})
