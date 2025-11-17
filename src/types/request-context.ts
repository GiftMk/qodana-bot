import type { Octokit } from '@octokit/core'
import type { Issue } from '../models/issue'
import type { Repository } from '../models/repository'

export type RequestContext = {
	issue: Issue
	repository: Repository
	octokit: Octokit
}
