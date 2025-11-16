import winston from 'winston'

export const logger = winston.createLogger({
	format: winston.format.combine(
		winston.format.json(),
		winston.format.timestamp(),
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'combined.log' }),
	],
})
