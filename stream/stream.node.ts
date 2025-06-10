namespace $ {
	/** Input data line processor type */
	type $hyoo_mill_line_processor = (lines: string[]) => void

	/** Common colors for different log types */
	export const $hyoo_mill_stream_colors = {
		'': $mol_term_color.gray,
		come: $mol_term_color.blue,
		done: $mol_term_color.green,
		fail: $mol_term_color.red,
		warn: $mol_term_color.yellow,
		rise: $mol_term_color.magenta,
		area: $mol_term_color.cyan,
	} as const

	/** Start stream processing with given line processor */
	export function $hyoo_mill_stream(processor: $hyoo_mill_line_processor) {
		const lines: string[] = []

		function emit() {
			if (lines.length === 0) return
			processor(lines)
			lines.length = 0
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

	/** Parse text to tree safely */
	export function $hyoo_mill_stream_parse_tree(text: string) {
		try {
			return $$.$mol_tree2_from_string(text, 'stdin')
		} catch (error) {
			console.log($mol_term_color.gray(text))
			return null
		}
	}

	/** Convert tree node to JSON safely */
	export function $hyoo_mill_stream_tree_to_json(field: $.$mol_tree2) {
		try {
			return $$.$mol_tree2_to_json(field.kids[0])
		} catch (error) {
			return $$.$mol_tree2_to_string(field)
		}
	}
}
