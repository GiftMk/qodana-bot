import type { Endpoints } from '@octokit/types'

export type IssueReaction =
	Endpoints['POST /repos/{owner}/{repo}/issues/{issue_number}/reactions']['parameters']['content']
