import type { Octokit } from '@octokit/core'
import { logger } from '../logger'
import { getErrorMessage } from '../utils'
import type { GitHubRepository } from '../types/github-payload'
import type { File } from './file'

type BranchParams = {
	octokit: Octokit
	repository: GitHubRepository
	ref: string
}

export class Branch {
	private readonly octokit: Octokit
	private readonly repository: GitHubRepository
	private readonly ref: string

	constructor(params: BranchParams) {
		this.octokit = params.octokit
		this.repository = params.repository
		this.ref = params.ref
	}

	async addFiles(...files: File[]): Promise<void> {
		try {
			for (const file of files) {
				await this.octokit.request(
					'PUT /repos/{owner}/{repo}/contents/{path}',
					{
						owner: this.repository.owner.login,
						repo: this.repository.name,
						path: file.path,
						branch: this.ref,
						message: 'Add file',
						content: file.base64Content,
					},
				)
			}
		} catch (error) {
			logger.error(`Failed to add files: ${getErrorMessage(error)}`)
			throw error
		}
	}
	async openPullRequest(title: string): Promise<string> {
		try {
			const { data } = await this.octokit.request(
				'POST /repos/{owner}/{repo}/pulls',
				{
					owner: this.repository.owner.login,
					repo: this.repository.name,
					title,
					body: 'Add Qodana workflow',
					head: this.ref,
					base: this.repository.default_branch,
				},
			)

			return data.html_url
		} catch (error) {
			logger.error(`Failed to create pull request: ${getErrorMessage(error)}`)
			throw error
		}
	}
}
