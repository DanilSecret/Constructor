package uisi.ru.constructor

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class ConstructorApplication

fun main(args: Array<String>) {
	runApplication<ConstructorApplication>(*args)
}
