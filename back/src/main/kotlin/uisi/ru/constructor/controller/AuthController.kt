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
import uisi.ru.constructor.service.UserService

@RestController
@RequestMapping("/api/v0.1/auth")
class AuthController(
    private val userService: UserService
) {

    @GetMapping("/login")
    fun login(@RequestBody request: UserLogin): ResponseEntity<Any> {
        return userService.login(request)
    }
}