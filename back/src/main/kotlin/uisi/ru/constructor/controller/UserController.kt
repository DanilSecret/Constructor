package uisi.ru.constructor.controller

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.multipart.MultipartFile
import uisi.ru.constructor.model.*
import uisi.ru.constructor.service.HistoryService
import uisi.ru.constructor.service.StudentService
import java.text.SimpleDateFormat
import java.util.*

@Controller
@RequestMapping("/api/user")
class UserController(
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
    fun getHistory(@RequestBody request: UUIDRequest): ResponseEntity<Any> {
        return historyService.getSelfHistory(UUID.fromString(request.uuid))
    }

    @PostMapping("/listStudents")
//    fun getStudents(@RequestBody filter: MapRequest): ResponseEntity<Any> {
    fun getStudents(@RequestBody filter: ListStudentsRequest): ResponseEntity<Any> {
        val filterMap: List<Map<String, String?>> = listOf(
            mapOf("Фамилия" to filter.search),
            mapOf("Имя" to filter.search),
            mapOf("Отчество (при наличии)" to filter.search),
            mapOf("Группа (при наличии)" to filter.search))
        return studentsService.getStudents(filterMap)
    }

    @PostMapping("/getStudent")
    fun getStudent(@RequestBody uuid: UUIDRequest): ResponseEntity<Any> {
        return studentsService.getStudent(UUID.fromString(uuid.uuid))
    }

    @PutMapping("/update")
    fun updStudent(@RequestBody rawStudentUpdate: MapRequest): ResponseEntity<Any> {
        val formatter = SimpleDateFormat("dd.MM.yyyy")

        val studentMap = rawStudentUpdate.map.map { (key, value) ->
            val parsedValue = when (value?.lowercase()?.trim()) {
                "да" -> true
                "нет" -> false
                "true" -> true
                "false" -> false
                else -> {
                    formatter.isLenient = false
                    try {
                        formatter.parse(value?.trim())
                    }
                    catch (e: Exception){
                        if (key == "course") {
                            value?.trim()?.toInt()?.toShort()
                        }
                        else if (key == "duration") {
                            value?.trim()?.toInt()
                        }
                        else value?.trim()
                    }
                }
            }
            key to parsedValue
        }.toMap()

        if (!(studentMap.containsKey("studId")&&studentMap.containsKey("enrlOrderNumber"))) {
            return ResponseEntity.badRequest().body(ResponseMessage("Поля 'Номер студенческого билета' и 'Номер приказа о зачислении' обязательны"))
        }

        val mapper = ObjectMapper()
        try{
            val studentUpdate: StudentUpdate = mapper.convertValue(studentMap, StudentUpdate::class.java)
            return studentsService.updateStudent(studentUpdate)
        }
        catch (e: Exception) {
            return ResponseEntity.internalServerError().body(ResponseMessage(e.message.toString(),false))
        }
    }

    @GetMapping("/allHistory")
    fun getAllHistory(): ResponseEntity<Any> {
        return historyService.getAllHistory()
    }

    @DeleteMapping("/delete")
    fun deleteStudent(@RequestBody uuid: UUIDRequest): ResponseEntity<Any> {
        return studentsService.deleteStudent(UUID.fromString(uuid.uuid))
    }
}