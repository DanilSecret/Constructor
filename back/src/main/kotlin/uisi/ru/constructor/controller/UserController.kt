package uisi.ru.constructor.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.multipart.MultipartFile
import uisi.ru.constructor.service.StudentsService
import uisi.ru.constructor.service.UserService

@Controller
@RequestMapping("/api/v0.1/user")
class UserController(
    private val userService: UserService,
    private val studentsService: StudentsService
) {
    @PostMapping("/upload")
    fun uploadXlsx(file: MultipartFile) {
        studentsService.uploadXlsx(file.inputStream)
    }
}