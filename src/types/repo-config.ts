import z from 'zod'

export const repoConfigSchema = z.union([
	z.object({
		monorepo: z.literal(true),
		packages: z.array(z.string()),
	}),
	z.object({
		monorepo: z.literal(false),
	}),
])

export type RepoConfig = z.infer<typeof repoConfigSchema>
