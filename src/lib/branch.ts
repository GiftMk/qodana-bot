import type { Octokit } from '@octokit/core'
import { logger } from '../logger'
import { getErrorMessage } from '../utils'
import type { GitHubRepository } from '../types/github-payload'

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

	async addFile(path: string, content: string) {
		try {
			const { data } = await this.octokit.request(
				'POST /repos/{owner}/{repo}/contents/{path}',
				{
					owner: this.repository.owner.login,
					repo: this.repository.name,
					path,
					branch: this.ref,
					message: 'Add file',
					content: Buffer.from(content).toString('base64'),
				},
			)

			return data.content.sha
		} catch (error) {
			logger.error(`Failed to add file: ${getErrorMessage(error)}`)
			throw error
		}
	}
}
