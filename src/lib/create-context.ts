import type { Octokit } from '@octokit/core'
import type { RequestContext } from '../types/request-context'
import type { GitHubIssue } from '../types/github-payload'
import type { GitHubRepository } from '../types/github-payload'
import { Issue } from '../models/issue'
import { Repository } from '../models/repository'

export const createContext = (
	octokit: Octokit,
	repository: GitHubRepository,
	issue: GitHubIssue,
): RequestContext => {
	return {
		octokit,
		repository: new Repository({ octokit, repository }),
		issue: new Issue({ octokit, repository, issue }),
	}
}
