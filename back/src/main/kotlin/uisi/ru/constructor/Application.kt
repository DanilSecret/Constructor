package uisi.ru.constructor

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.PropertySource

@SpringBootApplication
@PropertySource("application.yml")
class ConstructorApplication

	fun main(args: Array<String>) {
		runApplication<ConstructorApplication>(*args)
	}
