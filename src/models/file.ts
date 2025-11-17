export class File {
	readonly path: string
	readonly base64Content: string

	constructor(path: string, content: string) {
		this.path = path
		this.base64Content = File.base64Encode(content)
	}

	private static base64Encode(content: string): string {
		return Buffer.from(content).toString('base64')
	}
}
