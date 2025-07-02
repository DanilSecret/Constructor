package uisi.ru.constructor.controller

import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import uisi.ru.constructor.component.JwtUtil
import uisi.ru.constructor.model.UserLogin
import uisi.ru.constructor.service.UserService

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val userService: UserService
) {

    @PostMapping("/login")
    fun login(@RequestBody request: UserLogin, response: HttpServletResponse): ResponseEntity<Any> {
        return userService.login(request, response)
    }

    @DeleteMapping("/logout")
    fun logout(response: HttpServletResponse): ResponseEntity<Any> {
        val cookie = Cookie("token",null).apply {
            isHttpOnly = true;
            path = "/"
            maxAge = 0
        }
        response.addCookie(cookie)

        return ResponseEntity.ok().build()
    }
}