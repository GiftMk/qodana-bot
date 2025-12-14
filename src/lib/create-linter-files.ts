import { File } from '../models/file'
import YAML from 'yaml'
import { readTemplate } from './read-template'
import { getPackageName } from './get-package-name'
import type { Language, RepositoryConfig } from '../models/repository-config'

export const createLinterFiles = (config: RepositoryConfig): File[] => {
	return config.projects.map(project => {
		return createLinterFile(
			`qodana-${getPackageName(project.path)}.yaml`,
			project.language,
		)
	})
}

const createLinterFile = (path: string, language: Language): File => {
	switch (language) {
		case 'c#':
			return new File(
				path,
				YAML.stringify(readTemplate('qodana-csharp.yml'), {
					indent: 2,
				}),
			)
		case 'java':
			return new File(
				path,
				YAML.stringify(readTemplate('qodana-java.yml'), {
					indent: 2,
				}),
			)
		case 'ts':
			return new File(
				path,
				YAML.stringify(readTemplate('qodana-ts.yml'), {
					indent: 2,
				}),
			)
		default:
			throw new Error(`Unsupported language: ${language}`)
	}
}
