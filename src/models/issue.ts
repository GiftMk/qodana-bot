import type { Octokit } from '@octokit/core'
import { logger } from '../logger'
import type { IssueReaction } from '../types/issue-reaction'
import { getErrorMessage } from '../utils'
import type { GitHubIssue, GitHubRepository } from '../types/github-payload'

type IssueParams = {
	issue: GitHubIssue
	repository: GitHubRepository
	octokit: Octokit
}

export class Issue {
	private readonly octokit: Octokit
	private readonly repository: GitHubRepository
	private readonly issue: GitHubIssue
	public readonly body: string | null

	constructor(params: IssueParams) {
		this.octokit = params.octokit
		this.repository = params.repository
		this.issue = params.issue
		this.body = params.issue.body
	}

	async react(reaction: IssueReaction) {
		try {
			const { data } = await this.octokit.request(
				'POST /repos/{owner}/{repo}/issues/{issue_number}/reactions',
				{
					owner: this.repository.owner.login,
					repo: this.repository.name,
					issue_number: this.issue.number,
					content: reaction,
				},
			)

			return data
		} catch (error) {
			logger.error(`Failed to react to issue: ${getErrorMessage(error)}`)
			throw error
		}
	}

	async comment(...lines: string[]) {
		try {
			const { data } = await this.octokit.request(
				'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
				{
					owner: this.repository.owner.login,
					repo: this.repository.name,
					issue_number: this.issue.number,
					body: lines.join('\n'),
				},
			)

			return data
		} catch (error) {
			logger.error(`Failed to comment on issue: ${getErrorMessage(error)}`)
			throw error
		}
	}

	matches(targetTitle: string): boolean {
		return this.issue.title.toLowerCase().includes(targetTitle.toLowerCase())
	}
}
