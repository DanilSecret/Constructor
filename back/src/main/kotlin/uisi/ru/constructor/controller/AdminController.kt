package uisi.ru.constructor.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import uisi.ru.constructor.component.JwtUtil
import uisi.ru.constructor.model.UserLogin
import uisi.ru.constructor.model.UserRegister
import uisi.ru.constructor.service.UserService

@RestController
@RequestMapping("/api/admin")
class AdminController(
    private val userService: UserService,
    private val jwtUtil: JwtUtil
) {
    @PostMapping("/register")
    fun register(@RequestBody user: UserRegister): ResponseEntity<Any> {
        return userService.register(user)
    }
}