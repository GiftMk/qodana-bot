import type { Octokit } from '@octokit/core'
import type { IssuePayload } from './issue-payload'

export type RequestContext = {
	issue: IssuePayload
	octokit: Octokit
}
