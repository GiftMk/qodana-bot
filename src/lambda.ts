import serverlessHttp from 'serverless-http'
import { logger } from './logger'
import { server } from './server'

export const handle = serverlessHttp(server, {
	provider: 'aws',
})

export const handler = async (event: object, context: object) => {
	logger.info('Lambda function started 🔥')
	return await handle(event, context)
}
