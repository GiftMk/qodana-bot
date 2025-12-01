import { File } from '../models/file'
import YAML from 'yaml'
import type { Language, RepositoryConfig } from './repository-config'
import { readTemplate } from './readTemplate'
import { getPackageName } from './get-package-name'

export const createLinterFiles = (config: RepositoryConfig): File[] => {
	if (!config.monorepo) {
		return [createLinterFile('qodana.yaml', config.language)]
	}

	const packages = Object.entries(config.packages)
	return packages.map(([path, language]) => {
		return createLinterFile(`qodana-${getPackageName(path)}.yaml`, language)
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
