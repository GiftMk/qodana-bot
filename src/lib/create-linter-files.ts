import { File } from '../models/file'
import YAML from 'yaml'
import { readTemplate } from './read-template'
import type { RepositoryConfig } from '../models/repository-config'

export const createLinterFiles = (config: RepositoryConfig): File[] => {
	const distinctLanguages = new Set(config.projects.map(project => project.language))
	const files: File[] = []
	
	for (const language of distinctLanguages) {
		const file = new File(
				`qodana-${language}.yaml`,
				YAML.stringify(readTemplate(`qodana-${language}.yml`), {
					indent: 2,
				}),
			)

	
		files.push(file)
	}

	return files;
}
