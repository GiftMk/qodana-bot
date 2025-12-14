import fs from 'node:fs'
import YAML from 'yaml'

export const readTemplate = (
	filename: string,
	variableReplacements?: Record<string, string>,
) => {
	let template = fs.readFileSync(`./templates/${filename}`, 'utf-8')

	if (variableReplacements) {
		Object.entries(variableReplacements).forEach(([key, value]) => {
			template = template.replaceAll(key, value)
		})
	}

	return YAML.parse(template)
}
