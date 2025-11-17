import type { RequestContext } from '../types/request-context'
import { logger } from '../logger'
import { getErrorMessage } from '../utils'

export const commentOnIssue = async (
	{ issue, octokit }: RequestContext,
	...lines: string[]
) => {
	try {
		return await octokit.request(
			'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
			{
				owner: issue.owner,
				repo: issue.repo,
				issue_number: issue.issue_number,
				body: lines.join('\n'),
			},
		)
	} catch (error) {
		logger.error(`Failed to comment on issue: ${getErrorMessage(error)}`)
		throw error
	}
}
