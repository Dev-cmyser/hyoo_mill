namespace $ {
	export function $hyoo_mill_quiet() {
		const lines = [] as string[]
		// Set для хранения ключей основных сообщений об ошибках
		const printedErrors = new Set<string>()

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
				// В тихом режиме ошибки парсинга не показываем
				return
			}

			console.log('DEBUG: Processing input block')
			const firstBlock = input.kids[0]
			console.log('DEBUG: First block type =', firstBlock?.type)

			// Проверяем блок done на наличие loopback
			if (firstBlock?.type === 'done') {
				const loopbackField = firstBlock.kids.find(field => field.type === 'loopback')
				if (loopbackField) {
					console.log('DEBUG: Found done block with loopback, full block:', firstBlock)
					// Выводим весь блок done как есть
					console.log(text)
				}
			}

			// Обработка сообщения об ошибке
			const messageField = firstBlock?.kids.find(field => field.type === 'message')
			console.log('DEBUG: Message field =', messageField)

			if (messageField) {
				let errorMessage = ''
				try {
					var json = $$.$mol_tree2_to_json(messageField.kids[0])
					errorMessage = typeof json === 'string' ? json : JSON.stringify(json)
				} catch (error: any) {
					errorMessage = $$.$mol_tree2_to_string(messageField)
				}

				errorMessage = errorMessage.trim()

				// Извлекаем основную часть сообщения об ошибке (до подсказки про stacktraces)
				const errorKey = errorMessage.split('Set $mol_build_server.trace')[0].trim()
				console.log('DEBUG: Error key:', errorKey)

				// Выводим ошибку только если её основная часть ещё не была выведена
				if (errorKey && !printedErrors.has(errorKey)) {
					console.error(colors.fail(errorMessage))
					printedErrors.add(errorKey)
				}
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
