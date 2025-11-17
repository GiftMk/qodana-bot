import type { Octokit } from '@octokit/core'
import type { RequestContext } from '../types/request-context'
import type { GitHubIssue } from '../types/github-payload'
import type { GitHubRepository } from '../types/github-payload'
import { Issue } from './issue'
import { Repository } from './repository'

export const createContext = async (
	octokit: Octokit,
	repository: GitHubRepository,
	issue: GitHubIssue,
): Promise<RequestContext> => {
	return {
		octokit,
		repository: new Repository({ octokit, repository }),
		issue: new Issue({ octokit, repository, issue }),
	}
}
