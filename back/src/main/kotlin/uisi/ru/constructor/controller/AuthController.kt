package uisi.ru.constructor.controller

import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import uisi.ru.constructor.component.JwtUtil
import uisi.ru.constructor.model.UserLogin

@RestController
@RequestMapping
class AuthController(
    private val jwtUtil: JwtUtil
) {

    @GetMapping("/login")
    fun login(@RequestBody request: UserLogin): ResponseEntity<Any> {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("123")
    }
}