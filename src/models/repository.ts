import type { Octokit } from '@octokit/core'
import { getErrorMessage } from '../utils'
import { logger } from '../logger'
import { Branch } from './branch'
import type { GitHubRepository } from '../types/github-payload'
import sodium from 'libsodium-wrappers'

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

	private async getPublicKey() {
		try {
			const response = await this.octokit.request(
				'GET /repos/{owner}/{repo}/actions/secrets/public-key',
				{
					owner: 'OWNER',
					repo: 'REPO',
					headers: {
						'X-GitHub-Api-Version': '2022-11-28',
					},
				},
			)

			return {
				id: response.data.key_id,
				value: response.data.key,
			}
		} catch (error) {
			logger.error(
				`Failed to get repository public key: ${getErrorMessage(error)}`,
			)
			throw error
		}
	}

	private async encryptSecret(key: string, secret: string) {
		return sodium.ready.then(() => {
			const keyBuffer = sodium.from_base64(key, sodium.base64_variants.ORIGINAL)
			const secretBuffer = sodium.from_string(secret)
			const encrypted = sodium.crypto_box_seal(secretBuffer, keyBuffer)

			return sodium.to_base64(encrypted, sodium.base64_variants.ORIGINAL)
		})
	}

	async createSecret(name: string, value: string): Promise<void> {
		try {
			const publicKey = await this.getPublicKey()
			const encryptedSecret = await this.encryptSecret(publicKey.value, value)

			await this.octokit.request(
				'PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}',
				{
					owner: this.repository.owner.login,
					repo: this.repository.name,
					secret_name: name,
					encrypted_value: encryptedSecret,
					key_id: publicKey.id,
				},
			)
		} catch (error) {
			logger.error(
				`Failed to create repository secret: ${getErrorMessage(error)}`,
			)
			throw error
		}
	}
}
