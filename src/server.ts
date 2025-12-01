import { createNodeMiddleware } from '@octokit/app'
import { app } from './app'
import express from 'express'

export const server = express()
server.use(createNodeMiddleware(app))
