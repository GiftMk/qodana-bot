import type { Octokit } from '@octokit/core'
import type { RequestContext } from '../types/request-context'

type GitHubPayload = {
	repository: {
		owner: {
			login: string
		}
		name: string
	}
	issue: {
		title: string
		number: number
		body: string | null
	}
}

export const createContext = (
	octokit: Octokit,
	payload: GitHubPayload,
): RequestContext => {
	return {
		issue: {
			owner: payload.repository.owner.login,
			repo: payload.repository.name,
			issue_number: payload.issue.number,
			title: payload.issue.title,
			body: payload.issue.body,
		},
		octokit,
	}
}
