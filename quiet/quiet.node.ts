namespace $ {
	export function $hyoo_mill_quiet() {
		const DEBUG = false // Флаг для отладки
		const lines = [] as string[]
		const printedErrors = new Set<string>()

		const colors = {
			fail: $mol_term_color.red,
		}

		// Сообщения, которые нужно игнорировать
		const ignoredMessages = new Set(['Run', 'Built', 'Connect'])

		// Обертка для логирования
		const logger = {
			debug: (...args: any[]) => {
				if (DEBUG) console.log(...args)
			},
			log: (...args: any[]) => console.log(...args),
			error: (...args: any[]) => console.error(...args),
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

			logger.debug('DEBUG: Processing input block')
			const firstBlock = input.kids[0]
			logger.debug('DEBUG: First block type =', firstBlock?.type)

			// Проверяем блок done на наличие loopback
			if (firstBlock?.type === 'done') {
				const loopbackField = firstBlock.kids.find(field => field.type === 'loopback')
				if (loopbackField) {
					logger.debug('DEBUG: Found done block with loopback, full block:', firstBlock)
					// Выводим весь блок done как есть
					logger.log(text)
				}
			}

			// Обработка сообщения об ошибке
			const messageField = firstBlock?.kids.find(field => field.type === 'message')
			logger.debug('DEBUG: Message field =', messageField)

			if (messageField) {
				let errorMessage = ''
				try {
					var json = $$.$mol_tree2_to_json(messageField.kids[0])
					errorMessage = typeof json === 'string' ? json : JSON.stringify(json)
				} catch (error: any) {
					errorMessage = $$.$mol_tree2_to_string(messageField)
				}

				errorMessage = errorMessage.trim()

				// Игнорируем определенные сообщения
				if (ignoredMessages.has(errorMessage)) {
					return
				}

				// Берем только первую часть сообщения об ошибке (до первого at)
				const errorKey = errorMessage.split(' at ')[0]
				logger.debug('DEBUG: Error key:', errorKey)

				// Выводим ошибку только если её основная часть ещё не была выведена
				if (errorKey && !printedErrors.has(errorKey)) {
					logger.error(colors.fail(errorMessage))
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
