import type { RequestContext } from '../types/request-context'
import type { IssueReaction } from '../types/issue-reaction'
import { getErrorMessage } from '../utils'
import { logger } from '../logger'

export const reactToIssue = async (
	{ issue, octokit }: RequestContext,
	reaction: IssueReaction,
) => {
	try {
		return await octokit.request(
			'POST /repos/{owner}/{repo}/issues/{issue_number}/reactions',
			{
				owner: issue.owner,
				repo: issue.repo,
				issue_number: issue.issue_number,
				content: reaction,
			},
		)
	} catch (error) {
		logger.error(`Failed to react to issue: ${getErrorMessage(error)}`)
		throw error
	}
}
