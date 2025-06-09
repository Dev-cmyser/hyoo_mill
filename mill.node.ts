namespace $ {
	const mode = process.argv[2]

	switch (mode) {
		case 'table':
			$hyoo_mill_table()
			break

		default:
			console.error('Supported modes: table')
	}
}
