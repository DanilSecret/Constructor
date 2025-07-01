package uisi.ru.constructor.controller

import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.multipart.MultipartFile
import uisi.ru.constructor.model.*
import uisi.ru.constructor.service.StudentService
import uisi.ru.constructor.service.UserService
import java.util.UUID

@Controller
@RequestMapping("/api/user")
class UserController(
    private val userService: UserService,
    private val studentsService: StudentService
) {
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

    @GetMapping("getCols")
    fun getCols(): ResponseEntity<Any> {
        return studentsService.getCols()
    }

    @PostMapping("/upload")
    fun uploadXlsx(file: MultipartFile): ResponseEntity<Any> {
        if (file.isEmpty) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseMessage("Файл пустой или отсутствует",false))
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
            return ResponseEntity.badRequest().body(ResponseMessage(e.message.toString()))
        }
    }
}