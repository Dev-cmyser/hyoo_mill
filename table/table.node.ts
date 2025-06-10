namespace $ {
	/** Table mode processor */
	export class $hyoo_mill_table extends $hyoo_mill_stream {

		@$mol_mem
		static stat() {
			return new Map<string, number>()
		}

		/** Process lines and format table */
		static process_table(lines: string[]) {
			const text = lines.join('')
			const tree = this.parse_tree(text)
			if (!tree) return

			const values = tree.select(null, null).kids.map(field => {
				const json = this.tree_to_json(field)
				let str = typeof json === 'string' ? json : JSON.stringify(json)

				let width = this.stat().get(field.type) ?? 0
				if (str.length > width) {
					this.stat().set(field.type, str.length)
				}

				if (!Number.isNaN(parseFloat(str))) {
					width = Math.max(width, 8)
				}

				return str.padEnd(width)
			})

			const color = 
				$hyoo_mill_stream_colors[tree.kids[0].type as keyof typeof $hyoo_mill_stream_colors] ??
				$hyoo_mill_stream_colors['']

			console.log(color(values.join(' ')))
		}

		/** Run table processor */
		static run() {
			super.run(lines => this.process_table(lines))
		}

	}
}