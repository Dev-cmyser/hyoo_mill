namespace $ {
	const modes: Record<string, () => void> = {
		table: () => $hyoo_mill_table.run(),
	}

	const mode = process.argv[2]
	const handler = modes[mode]

	if (handler) {
		handler()
	} else {
		const availableModes = Object.keys(modes).join(', ')
		console.error(`Supported modes: ${availableModes}`)
	}
}
