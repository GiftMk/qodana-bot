export const getErrorMessage = (error: unknown) => {
	return error instanceof Error ? error.message : JSON.stringify(error)
}
