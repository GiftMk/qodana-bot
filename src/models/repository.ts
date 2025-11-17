import type { Octokit } from '@octokit/core'
import { getErrorMessage } from '../utils'
import { logger } from '../logger'
import { Branch } from './branch'
import type { GitHubRepository } from '../types/github-payload'

type RepositoryParams = {
	repository: GitHubRepository
	octokit: Octokit
}

export class Repository {
	private readonly octokit: Octokit
	private readonly repository: GitHubRepository
	private _sha: string | null = null

	constructor(params: RepositoryParams) {
		this.octokit = params.octokit
		this.repository = params.repository
	}

	private async getSha(): Promise<string> {
		if (!this._sha) {
			try {
				const { data } = await this.octokit.request(
					'GET /repos/{owner}/{repo}/branches/{branch}',
					{
						owner: this.repository.owner.login,
						repo: this.repository.name,
						branch: this.repository.default_branch,
					},
				)

				this._sha = data.commit.sha
			} catch (error) {
				logger.error(
					`Failed to get latest commit sha: ${getErrorMessage(error)}`,
				)
				throw error
			}
		}

		return this._sha
	}

	async createBranch(name: string): Promise<Branch> {
		const sha = await this.getSha()
		try {
			const { data } = await this.octokit.request(
				'POST /repos/{owner}/{repo}/git/refs',
				{
					owner: this.repository.owner.login,
					repo: this.repository.name,
					ref: `refs/heads/${name}`,
					sha,
				},
			)

			return new Branch({
				octokit: this.octokit,
				repository: this.repository,
				ref: data.ref,
			})
		} catch (error) {
			logger.error(`Failed to create branch: ${getErrorMessage(error)}`)
			throw error
		}
	}
}
