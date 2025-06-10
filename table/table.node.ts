namespace $ {
	export function $hyoo_mill_table() {
		const stat = new Map<string, number>()

		$hyoo_mill_stream(lines => {
			const text = lines.join('')
			const tree = $hyoo_mill_stream_parse_tree(text)
			if (!tree) return

			const values = tree.select(null, null).kids.map(field => {
				const json = $hyoo_mill_stream_tree_to_json(field)
				let str = typeof json === 'string' ? json : JSON.stringify(json)

				let width = stat.get(field.type) ?? 0
				if (str.length > width) {
					stat.set(field.type, str.length)
				}

				if (!Number.isNaN(parseFloat(str))) {
					width = Math.max(width, 8)
				}

				return str.padEnd(width)
			})

			const color = $hyoo_mill_stream_colors[tree.kids[0].type as keyof typeof $hyoo_mill_stream_colors] ?? 
				$hyoo_mill_stream_colors['']

			console.log(color(values.join(' ')))
		})
	}
}