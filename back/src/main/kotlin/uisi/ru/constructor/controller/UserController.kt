package uisi.ru.constructor.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.multipart.MultipartFile
import uisi.ru.constructor.model.*
import uisi.ru.constructor.repository.HistoryRepository
import uisi.ru.constructor.service.HistoryService
import uisi.ru.constructor.service.StudentService
import uisi.ru.constructor.service.UserService
import java.util.*

@Controller
@RequestMapping("/api/user")
class UserController(
    private val userService: UserService,
    private val studentsService: StudentService,
    private val historyService: HistoryService
) {
    @GetMapping("/getCols")
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

    @PostMapping("/download")
    fun downloadXlsx(@RequestBody request: HistoryRequest): ResponseEntity<Any> {
        return studentsService.createXlsx(request)
    }

    @PostMapping("/selfHistory")
    fun getHistiry(@RequestBody userUUID: String): ResponseEntity<Any> {
        return historyService.getSelfHistory(UUID.fromString(userUUID))
    }

    @PostMapping("/listStudents")
    fun getStudents(@RequestBody filter: List<Map<String, String?>>?): ResponseEntity<Any> {
        return studentsService.getStudents(filter)
    }
}