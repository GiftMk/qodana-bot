import { server } from './server'
import { env } from './environment'
import { logger } from './logger'

server.listen(env.SERVER_PORT, () => {
	logger.info(`Server started on http://localhost:${env.SERVER_PORT} 🔥`)
})
