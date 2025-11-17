import type { Octokit } from '@octokit/core'
import { logger } from '../logger'
import type { IssueReaction } from '../types/issue-reaction'
import { getErrorMessage } from '../utils'
import type { GitHubIssue, GitHubRepository } from '../types/github-payload'
import YAML from 'yaml'
import z from 'zod'

type IssueParams = {
	issue: GitHubIssue
	repository: GitHubRepository
	octokit: Octokit
}

export const issueBodySchema = z.union([
	z.object({
		monorepo: z.literal(true),
		packages: z.array(z.string()),
	}),
	z.object({
		monorepo: z.literal(false),
	}),
])

export type IssueBody = z.infer<typeof issueBodySchema>

export class Issue {
	private readonly octokit: Octokit
	private readonly repository: GitHubRepository
	private readonly issue: GitHubIssue
	private _body: IssueBody | null = null

	constructor(params: IssueParams) {
		this.octokit = params.octokit
		this.repository = params.repository
		this.issue = params.issue
	}

	get body(): IssueBody | null {
		if (!this.issue.body) {
			return null
		}

		if (!this._body) {
			this._body = Issue.parseBody(this.issue.body)
		}

		return this._body
	}

	private static parseBody(body: string | null): IssueBody | null {
		if (!body?.length) {
			return { monorepo: false }
		}

		try {
			const yaml = YAML.parse(body)
			const result = issueBodySchema.safeParse({ monorepo: true, ...yaml })
			if (!result.success) {
				throw new Error(result.error?.message)
			}

			return result.data
		} catch (error) {
			logger.error(`Failed to parse repo config: ${getErrorMessage(error)}`)
			return null
		}
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
