namespace $ {
	export function $hyoo_mill_table() {
		const lines = [] as string[]

		const colors = {
			'': $mol_term_color.gray,
			come: $mol_term_color.blue,
			done: $mol_term_color.green,
			fail: $mol_term_color.red,
			warn: $mol_term_color.yellow,
			rise: $mol_term_color.magenta,
			area: $mol_term_color.cyan,
		}

		const stat = new Map<string, number>()

		function emit() {
			if (lines.length === 0) return

			const text = lines.join('')
			lines.length = 0

			try {
				var input = $$.$mol_tree2_from_string(text, `stdin`)
			} catch (error) {
				console.log($mol_term_color.gray(text))
				return
			}

			const values = input.select(null, null).kids.map(field => {
				try {
					var json = $$.$mol_tree2_to_json(field.kids[0])
				} catch (error: any) {
					json = $$.$mol_tree2_to_string(field)
				}

				let str = typeof json === 'string' ? json : JSON.stringify(json)

				let width = stat.get(field.type) ?? 0
				if (str.length > width) {
					stat.set(field.type, str.length)
				}

				if (!Number.isNaN(parseFloat(str))) {
					width = Math.max(width, 8)
				}

				str = str.padEnd(width)

				return str
			})

			const color = colors[input.kids[0].type as keyof typeof colors] || colors['']

			console.log(color(values.join(' ')))
		}

		process.stdin
			.pipe($node.split())
			.on('data', (line: string) => {
				if (line[0] !== '\t') emit()
				if (line) lines.push(line + '\n')
			})
			.on('error', (line: string) => {
				if (line[0] !== '\t') emit()
				if (line) lines.push(line + '\n')
			})
	}
}
