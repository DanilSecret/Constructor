package uisi.ru.constructor.service

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.persistence.EntityManager
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import uisi.ru.constructor.builders.ReportDocBuilder
import uisi.ru.constructor.builders.StudentDataBuilder
import uisi.ru.constructor.model.*
import uisi.ru.constructor.repository.HistoryRepository
import uisi.ru.constructor.repository.StudentRepository
import uisi.ru.constructor.repository.UserRepository
import java.io.ByteArrayOutputStream
import java.io.InputStream
import java.text.SimpleDateFormat
import java.time.OffsetDateTime
import java.util.*

@Service
class StudentService(
    private val studentRepository: StudentRepository,
    private val userRepository: UserRepository,
    private val historyRepository: HistoryRepository,
    private val entityManager: EntityManager,
) {
    private val formatter = SimpleDateFormat("dd.MM.yyyy")

    fun uploadXlsx(file: InputStream): ResponseEntity<Any> {
        try {
            val workbook = XSSFWorkbook(file)
            val sheet = workbook.getSheetAt(0)

            val table: MutableList<Student> = emptyList<Student>().toMutableList()

            val names = sheet.getRow(0)?: return ResponseEntity.badRequest().body(ResponseMessage("Не заданы названия столбцов таблицы", false))
            if (names.physicalNumberOfCells != 38) { return ResponseEntity.badRequest().body(ResponseMessage("Некорректный формат таблицы", false)) }

            for (i in 1..sheet.lastRowNum) {
                val row = sheet.getRow(i)
                val rowBuilder = StudentDataBuilder()
                if (row != null) {
                    for (j in 0..row.lastCellNum-1) {
                        val cell = row.getCell(j)?: continue
                        cell.let {
                            rowBuilder.parseCell(cell)
                        }
                    }
                    val studId = rowBuilder.values[19] as String
                    val enrlOrderNumber = rowBuilder.values[18] as String
                    val existsStudent: Student? = studentRepository.getStudentByStudIdAndEnrlOrderNumber(studId, enrlOrderNumber)
                    val uuid = existsStudent?.uuid?: UUID.randomUUID()
                    table.add(rowBuilder.build(i+1, uuid))
                }
            }

            for (i in 0..table.size-1) {
                val row = table[i]
                try{ studentRepository.save(row) }
                catch (re: Exception) {throw RuntimeException("Ошибка при создании записи ${i+1}: ${re.message.toString()}")}
            }

            return ResponseEntity.ok().body(ResponseMessage("${table.size} записей успешно обработано", true))
        }
        catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseMessage(e.message.toString(), false))
        }
    }

    fun createXlsx(request: HistoryRequest): ResponseEntity<Any> {
        val user: User = userRepository.getUserByUuid(UUID.fromString(request.userUUID))?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseMessage("Не найден пользователь-заказчик", false))
        try {
            val builder = ReportDocBuilder(entityManager)

            request.filter.forEach { filter ->
                builder.addFilterGroup(request.col, filter)
            }

            val report = builder.build(request.joins, request.col)

            val exelConfig = ExcelConfig (
                col = request.col,
                filter = request.filter,
                joins = request.joins
            )

            val historyRecord = History (
                uuid = UUID.randomUUID(),
                user = user,
                request = exelConfig,
                date = OffsetDateTime.now()
            )

            historyRepository.save(historyRecord)

            val baos = ByteArrayOutputStream()
            report.use{ it.write(baos) }
            val file = baos.toByteArray()

            return ResponseEntity.ok()
                .header("Content-Disposition")
                .body(file)
        }
        catch (e: RuntimeException) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseMessage(e.message.toString(), false))}
    }

    fun getCols(): ResponseEntity<Any> {
        val colsRu = emptyList<Map<String, String>>().toMutableList()
        val cols = Columns.entries
        for (i in 0..cols.size-1){
            val map = emptyMap<String, String>().toMutableMap()
            map["id"] = i.toString()
            map["name"] = cols[i].desc
            colsRu.add(map)
        }
        return ResponseEntity.ok().body(colsRu)
    }

    fun getStudents(filter: List<Map<String, String?>>?):ResponseEntity<Any> {
        val builder = ReportDocBuilder(entityManager)
        val cols = listOf(
            "uuid", "surname", "name", "patronymic",
            "gender", "birthday", "phone", "regAddr",
            "actAddr", "passportSerial", "passportNumber",
            "passportDate", "passportSource", "snils",
            "medPolicy", "foreigner", "quota", "enrlDate",
            "enrlOrderDate", "enrlOrderNumber", "studId",
            "studIdDate", "group", "educationLevel", "fundSrc",
            "course", "studyForm", "program", "programCode",
            "profile", "duration", "regEndDate", "actEndDate",
            "orderEndDate", "orderEndNumber", "acadStartDate",
            "acadEndDate", "orderAcadDate", "orderAcadNumber"
        )

        if (filter == null) {

            val mapper = ObjectMapper()
            val rawStudents = studentRepository.findAll().mapNotNull { student: Student ->
                mapper.convertValue(student, object : TypeReference<Map<String, Any?>>() {})
            }
            val formatter = SimpleDateFormat("dd.MM.yyyy")
            val students = rawStudents.map { student: Map<String, Any?> ->
                student.map{ (key, value) ->
                    val stringValue = when (value) {
                        is Date -> formatter.format(value)
                        is Boolean -> if (value) "Да" else "Нет"
                        else -> value?.toString()
                    }
                    key to stringValue
                }.toMap().filterKeys { it == "uuid"|| it == "name" || it == "surname" || it == "patronymic" || it == "group" }
            }
            return ResponseEntity.ok().body(students)
        }
        filter.let {
            it.forEach {
                builder.addFilterGroup(cols, it)
            }
            val students = builder.data.map { student: Map<String, String?> ->
                student.filterKeys { it == "uuid"|| it == "Имя" || it == "Фамилия" || it == "Отчество (при наличии)" || it == "Группа (при наличии)" }.map {
                    (key,value) ->
                    val newKey = when(key) {
                        "uuid" -> "uuid"
                        "Имя" -> "name"
                        "Фамилия" -> "surname"
                        "Отчество (при наличии)" -> "patronymic"
                        "Группа (при наличии)" -> "group"
                        else -> return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseMessage("Не удалось преобразовать столбцы", false))
                    }
                    newKey to value
                }.toMap()
            }
            return ResponseEntity.ok().body(students)
        }
    }

    fun getStudent(uuid: UUID): ResponseEntity<Any> {
        val rawStudent = studentRepository.getStudentByUuid(uuid)?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseMessage("Студента не найдено", false))
        val mapper = ObjectMapper()

        val student = mapper.convertValue(rawStudent, object : TypeReference<Map<String, Any?>>() {})

        val parsedStudent = student.map { (key,value) ->
            val stringValue = when (value) {
                is Date -> formatter.format(value)
                is Boolean -> if (value) "Да" else "Нет"
                else -> value?.toString()
            }
            key to stringValue
        }.toMap()
        return ResponseEntity.ok().body(parsedStudent)
    }

    fun updateStudent(studentUpdate: StudentUpdate): ResponseEntity<Any> {
        val exists = studentRepository.getStudentByStudIdAndEnrlOrderNumber(studentUpdate.studId?: throw RuntimeException("Поле 'Номер студенческого билета' обязательно"),
            studentUpdate.enrlOrderNumber?: throw RuntimeException("Поле 'Номер приказа о зачислении' обязательно"))?:
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseMessage("Студента не найдено", false))

        val upd = exists.copy(
            uuid = exists.uuid,
            surname = studentUpdate.surname?: exists.surname,
            name = studentUpdate.name?: exists.name,
            patronymic = studentUpdate.patronymic ?: exists.patronymic,
            gender = studentUpdate.gender ?: exists.gender,
            birthday = studentUpdate.birthday ?: exists.birthday,
            phone = studentUpdate.phone ?: exists.phone,
            regAddr = studentUpdate.regAddr ?: exists.regAddr,
            actAddr = studentUpdate.actAddr ?: exists.actAddr,
            passportSerial = studentUpdate.passportSerial ?: exists.passportSerial,
            passportNumber = studentUpdate.passportNumber ?: exists.passportNumber,
            passportDate = studentUpdate.passportDate ?: exists.passportDate,
            passportSource = studentUpdate.passportSource ?: exists.passportSource,
            snils = studentUpdate.snils ?: exists.snils,
            medPolicy = studentUpdate.medPolicy ?: exists.medPolicy,
            foreigner = studentUpdate.foreigner ?: exists.foreigner,
            quota = studentUpdate.quota ?: exists.quota,
            enrlDate = studentUpdate.enrlDate ?: exists.enrlDate,
            enrlOrderDate = studentUpdate.enrlOrderDate ?: exists.enrlOrderDate,
            enrlOrderNumber = studentUpdate.enrlOrderNumber,
            studId = studentUpdate.studId,
            studIdDate = studentUpdate.studIdDate ?: exists.studIdDate,
            group = studentUpdate.group ?: exists.group,
            educationLevel = studentUpdate.educationLevel ?: exists.educationLevel,
            fundSrc = studentUpdate.fundSrc ?: exists.fundSrc,
            course = studentUpdate.course ?: exists.course,
            studyForm = studentUpdate.studyForm ?: exists.studyForm,
            program = studentUpdate.program ?: exists.program,
            programCode = studentUpdate.programCode ?: exists.programCode,
            profile = studentUpdate.profile ?: exists.profile,
            duration = studentUpdate.duration ?: exists.duration,
            regEndDate = studentUpdate.regEndDate ?: exists.regEndDate,
            actEndDate = studentUpdate.actEndDate ?: exists.actEndDate,
            orderEndDate = studentUpdate.orderEndDate ?: exists.orderEndDate,
            orderEndNumber = studentUpdate.orderEndNumber ?: exists.orderEndNumber,
            acadStartDate = studentUpdate.acadStartDate ?: exists.acadStartDate,
            acadEndDate = studentUpdate.acadEndDate ?: exists.acadEndDate,
            orderAcadDate = studentUpdate.orderAcadDate ?: exists.orderAcadDate,
            orderAcadNumber = studentUpdate.orderAcadNumber ?: exists.orderAcadNumber
        )

        studentRepository.save(upd)

        return ResponseEntity.ok().body(ResponseMessage("Данные успешно обновлены", true))
    }

    fun deleteStudent(uuid: UUID): ResponseEntity<Any> {
        val student = studentRepository.getStudentByUuid(uuid)?:
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseMessage("Студента не найдено", false))
        student.let {
            try {
                studentRepository.delete(student)
                return ResponseEntity.ok().body(ResponseMessage("Данные о студенте успешно удалены", true))
            }
            catch (e: Exception) {
                return ResponseEntity.internalServerError().body(ResponseMessage(e.message.toString(),false))}
        }
    }

    fun deleteAll(): ResponseEntity<Any> {
        try {
            studentRepository.deleteAll()
            return ResponseEntity.ok().body(ResponseMessage("Таблица очищена", true))
        }
        catch (e:Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseMessage(e.message.toString(), false))
        }
    }
}