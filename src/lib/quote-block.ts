export const quoteBlock = (...lines: string[]): string => {
	return `${['>', lines.join('\n')].join(' ')}\n`
}
