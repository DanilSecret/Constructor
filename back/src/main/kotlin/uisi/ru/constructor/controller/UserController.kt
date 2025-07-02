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
import uisi.ru.constructor.repository.HistoryRepository
import uisi.ru.constructor.service.HistoryService
import uisi.ru.constructor.service.StudentService
import uisi.ru.constructor.service.UserService
import java.text.SimpleDateFormat
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
    fun getHistory(@RequestBody request: SelfHistoryRequest): ResponseEntity<Any> {
        return historyService.getSelfHistory(UUID.fromString(request.uuid))
    }

    @PostMapping("/listStudents")
//    fun getStudents(@RequestBody filter: List<Map<String, String?>>?): ResponseEntity<Any> {
    fun getStudents(@RequestBody filter: ListStudentsRequest): ResponseEntity<Any> {
        val filterMap: List<Map<String, String?>> = listOf(
            mapOf("Фамилия" to filter.search),
            mapOf("Имя" to filter.search),
            mapOf("Отчество (при наличии)" to filter.search),
            mapOf("Группа (при наличии)" to filter.search))
        return studentsService.getStudents(filterMap)
    }

    @PutMapping("/update")
    fun updStudent(@RequestBody rawStudentUpdate: Map<String, String?>): ResponseEntity<Any> {
        val tableColumns: Map<String, String> = mapOf(
            "Фамилия" to "surname",
            "Имя" to "name",
            "Отчество (при наличии)" to "patronymic",
            "Пол" to "gender",
            "Дата рождения" to "birthday",
            "Номер телефона (при наличии)" to "phone",
            "Адрес местожительства по прописке" to "regAddr",
            "Адрес места жительства (фактический)" to "actAddr",
            "Серия паспорта (при наличии)" to "passportSerial",
            "Номер паспорта" to "passportNumber",
            "Дата выдачи паспорта" to "passportDate",
            "Кем выдан паспорт" to "passportSource",
            "СНИЛС (при наличии)" to "snils",
            "Номер медицинского полиса (при наличии)" to "medPolicy",
            "Иностранный гражданин" to "foreigner",
            "Особая квота (инвалид сирота)" to "quota",
            "Дата зачисления в образовательную организацию" to "enrlDate",
            "Дата приказа о зачислении" to "enrlOrderDate",
            "Номер приказа о зачислении" to "enrlOrderNumber",
            "Номер студенческого билета" to "studId",
            "Дата выдачи студенческого билета" to "studIdDate",
            "Группа (при наличии)" to "group",
            "Наименование уровня образования" to "educationLevel",
            "Источник финансирования" to "fundSrc",
            "Номер курса" to "course",
            "Форма обучения" to "studyForm",
            "Наименование направления" to "program",
            "Код направления" to "programCode",
            "Наименование образовательной программы (Профиль)" to "profile",
            "Срок реализации образовательной программы (кол-во месяцев)" to "duration",
            "Планируемая дата окончания обучения" to "regEndDate",
            "Дата завершения обучения или отчисления (при наличии)" to "actEndDate",
            "Дата приказа о завершении обучения или отчислении (при наличии)" to "orderEndDate",
            "Номер приказа о завершении обучения или отчислении (при наличии)" to "orderEndNumber",
            "Дата начала академического отпуска (при наличии)" to "acadStartDate",
            "Дата окончания академического отпуска (при наличии)" to "acadEndDate",
            "Дата приказа о предоставлении академического отпуска (при наличии)" to "orderAcadDate",
            "Номер приказа о предоставлении академического отпуска (при наличии)" to "orderAcadNumber"
        )
        val formatter = SimpleDateFormat("dd.MM.yyyy")

        val studentMap = studentsService.parseMap(rawStudentUpdate)

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

    @DeleteMapping("/delete")
    fun deleteStudent(@RequestBody rawStudent: Map<String, String?>): ResponseEntity<Any> {
        val student = studentsService.parseMap(rawStudent)
        if (!(student.containsKey("studId")&&student.containsKey("enrlOrderNumber"))) {
            return ResponseEntity.badRequest().body(ResponseMessage("Поля 'Номер студенческого билета' и 'Номер приказа о зачислении' обязательны"))
        }

        val mapper = ObjectMapper()
        try{
            val studentDelete: StudentUpdate = mapper.convertValue(student, StudentUpdate::class.java)
            return studentsService.updateStudent(studentDelete)
        }
        catch (e: Exception) {
            return ResponseEntity.internalServerError().body(ResponseMessage(e.message.toString(),false))
        }
    }
}