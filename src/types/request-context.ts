import type { Octokit } from '@octokit/core'
import type { Issue } from '../lib/issue'
import type { Repository } from '../lib/repository'

export type RequestContext = {
	issue: Issue
	repository: Repository
	octokit: Octokit
}
