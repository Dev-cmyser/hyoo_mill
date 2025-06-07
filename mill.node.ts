namespace $ {
	const mode = process.argv[2]

	switch (mode) {
		case 'table':
			$hyoo_mill_table()
			break

		case 'quiet':
			console.error('Mode `quiet` is not implemented yet')
			process.exit(1)

		default:
			console.error('Supported modes: table, quiet')
			process.exit(1)
	}
}
