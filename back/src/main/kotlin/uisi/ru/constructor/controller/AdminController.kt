package uisi.ru.constructor.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import uisi.ru.constructor.component.JwtUtil
import uisi.ru.constructor.model.*
import uisi.ru.constructor.service.HistoryService
import uisi.ru.constructor.service.StudentService
import uisi.ru.constructor.service.UserService
import java.util.*

@RestController
@RequestMapping("/api/admin")
class AdminController(
    private val userService: UserService,
    private val jwtUtil: JwtUtil,
    private val historyService: HistoryService,
    private val studentService: StudentService
) {
    @PostMapping("/register")
    fun register(@RequestBody user: UserRegister): ResponseEntity<Any> {
        return userService.register(user)
    }

    @PutMapping("/update")
    fun updPassword(@RequestBody userUpdate: UserUpdate): ResponseEntity<Any> {
        return userService.update(userUpdate)
    }

    @GetMapping("/listUsers")
    fun getAllUsers(): ResponseEntity<Any> {
        return userService.getAllUsers()
    }

    @PostMapping("/getUser")
    fun getUser(@RequestBody uuid: UUIDRequest): ResponseEntity<Any> {
        return userService.getUser(UUID.fromString(uuid.uuid))
    }

    @DeleteMapping("/delete")
    fun deleteUser(@RequestBody userDelete: UUIDRequest): ResponseEntity<Any> {
        return userService.deleteUser(userDelete)
    }

    @DeleteMapping("/clear")
    fun clear(@RequestBody clearRequest: ClearRequest): ResponseEntity<Any> {
        when(clearRequest.table.uppercase()){
            Tables.HISTORY.toString() -> return historyService.deleteAll()
            Tables.STUDENTS.toString() -> return studentService.deleteAll()
            else -> return ResponseEntity.badRequest().body(ResponseMessage("Неверно задано название таблицы", false))
        }
    }
}