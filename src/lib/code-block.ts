export const codeBlock = (...lines: string[]): string => {
	return ['```', ...lines, '```'].join('\n')
}
