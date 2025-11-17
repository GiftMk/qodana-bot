export type GitHubRepository = {
	owner: {
		login: string
	}
	name: string
	default_branch: string
}

export type GitHubIssue = {
	title: string
	number: number
	body: string | null
}

export type GitHubPayload = {
	repository: GitHubRepository
	issue: GitHubIssue
}
