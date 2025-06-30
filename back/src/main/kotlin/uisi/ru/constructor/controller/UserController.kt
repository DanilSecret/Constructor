package uisi.ru.constructor.controller

import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.multipart.MultipartFile
import uisi.ru.constructor.model.UserRegister
import uisi.ru.constructor.model.DevResponse
import uisi.ru.constructor.model.ResponseError
import uisi.ru.constructor.model.Roles
import uisi.ru.constructor.service.StudentsService
import uisi.ru.constructor.service.UserService
import java.util.*

@Controller
@RequestMapping("/api/user")
class UserController(
    private val userService: UserService,
    private val studentsService: StudentsService
) {
    @PostMapping("/logout")
    fun logout(@RequestBody response: HttpServletResponse): ResponseEntity<Any> {
        val cookie = Cookie("token",null)
        cookie.path = "/"
        cookie.maxAge = 0
        cookie.isHttpOnly = true
        response.addCookie(cookie)

        return ResponseEntity.ok().build()
    }

    @PostMapping("/upload")
    fun uploadXlsx(file: MultipartFile): ResponseEntity<Any> {
        if (file.isEmpty) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseError("Файл пустой или отсутствует"))
        }
        return studentsService.uploadXlsx(file.inputStream)
    }

    @GetMapping("/dev")
    fun dev(@RequestBody dev: UserRegister): ResponseEntity<Any> {
        val passwordEncoder = BCryptPasswordEncoder()
        try {
            return ResponseEntity.ok().body(DevResponse(
                uuid = UUID.randomUUID(),
                email = dev.email,
                password = passwordEncoder.encode(dev.password),
                role = Roles.valueOf(dev.role).toString()
            ))
        }
        catch (e: Exception) {
            return ResponseEntity.badRequest().body(ResponseError(e.message.toString()))
        }
    }
}