namespace $ {
	export function $hyoo_mill_quiet() {
		const lines = [] as string[]

		const colors = {
			fail: $mol_term_color.red,
		}

		function emit() {
			if (lines.length === 0) return

			const text = lines.join('')
			lines.length = 0

			try {
				var input = $$.$mol_tree2_from_string(text, `stdin`)
			} catch (error) {
				// В тихом режиме ошибки парсинга тоже показываем
				console.error($mol_term_color.red(`Parse error: ${error}`))
				return
			}

			// Проверяем первое поле на тип 'fail'
			const firstField = input.kids[0]
			if (firstField?.type !== 'fail') return

			// Извлекаем только поле message - основную суть ошибки
			const messageField = input.select('message', null).kids[0]
			let errorMessage = ''

			if (messageField) {
				try {
					var json = $$.$mol_tree2_to_json(messageField.kids[0])
				} catch (error: any) {
					json = $$.$mol_tree2_to_string(messageField)
				}

				errorMessage = typeof json === 'string' ? json : JSON.stringify(json)
			}

			if (errorMessage.trim()) {
				console.error(colors.fail(errorMessage.trim()))
			}
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