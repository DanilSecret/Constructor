package uisi.ru.constructor.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.convertValue
import jakarta.persistence.EntityManager
import org.apache.coyote.Response
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.DeleteMapping
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
import kotlin.math.E
import kotlin.reflect.full.memberProperties

@Service
class StudentService(
    private val studentRepository: StudentRepository,
    private val userRepository: UserRepository,
    private val historyRepository: HistoryRepository,
    private val entityManager: EntityManager,
) {
    private val tableColumns: Map<String, String> = mapOf(
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
    private val formatter = SimpleDateFormat("dd.MM.yyyy")

    fun parseMap(rawData: Map<String, String?>): Map<String, Any?> {
        val studentMap = rawData.mapNotNull { (key, value) ->
            val parsedKey = tableColumns[key]?: throw RuntimeException(
                "Не найдено ни 1 столбца соответствующего описанию $key")

            val parsedValue = when (value?.toLowerCase()?.trim()) {
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
                        if (parsedKey == "course") {
                            value?.trim()?.toInt()?.toShort()
                        }
                        else if (parsedKey == "duration") {
                            value?.trim()?.toInt()
                        }
                        else value?.trim()
                    }
                }
            }
            parsedKey to parsedValue
        }.toMap()

        return studentMap
    }

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
            val builder: ReportDocBuilder = ReportDocBuilder(entityManager)

            request.filter.forEach { filter ->
                builder.addFilterGroup(request.col, filter)
            }

            val report = builder.build(request.joins, request.col)

            val exelConfig = ExcelConfig (
                col = request.col,
                filter = request.filter,
                joins = request.joins
            )

            val historyRecord: History = History (
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
        val tableColumnsRev: Map<String, String> = mapOf(
            "uuid" to "uuid",
            "surname" to "Фамилия",
            "name" to "Имя",
            "patronymic" to "Отчество (при наличии)",
            "gender" to "Пол",
            "birthday" to "Дата рождения",
            "phone" to "Номер телефона (при наличии)",
            "regAddr" to "Адрес местожительства по прописке",
            "actAddr" to "Адрес места жительства (фактический)",
            "passportSerial" to "Серия паспорта (при наличии)",
            "passportNumber" to "Номер паспорта",
            "passportDate" to "Дата выдачи паспорта",
            "passportSource" to "Кем выдан паспорт",
            "snils" to "СНИЛС (при наличии)",
            "medPolicy" to "Номер медицинского полиса (при наличии)",
            "foreigner" to "Иностранный гражданин",
            "quota" to "Особая квота (инвалид сирота)",
            "enrlDate" to "Дата зачисления в образовательную организацию",
            "enrlOrderDate" to "Дата приказа о зачислении",
            "enrlOrderNumber" to "Номер приказа о зачислении",
            "studId" to "Номер студенческого билета",
            "studIdDate" to "Дата выдачи студенческого билета",
            "group" to "Группа (при наличии)",
            "educationLevel" to "Наименование уровня образования",
            "fundSrc" to "Источник финансирования",
            "course" to "Номер курса",
            "studyForm" to "Форма обучения",
            "program" to "Наименование направления",
            "programCode" to "Код направления",
            "profile" to "Наименование образовательной программы (Профиль)",
            "duration" to "Срок реализации образовательной программы (кол-во месяцев)",
            "regEndDate" to "Планируемая дата окончания обучения",
            "actEndDate" to "Дата завершения обучения или отчисления (при наличии)",
            "orderEndDate" to "Дата приказа о завершении обучения или отчислении (при наличии)",
            "orderEndNumber" to "Номер приказа о завершении обучения или отчислении (при наличии)",
            "acadStartDate" to "Дата начала академического отпуска (при наличии)",
            "acadEndDate" to "Дата окончания академического отпуска (при наличии)",
            "orderAcadDate" to "Дата приказа о предоставлении академического отпуска (при наличии)",
            "orderAcadNumber" to "Номер приказа о предоставлении академического отпуска (при наличии)"
        )
        val cols = tableColumnsRev.keys.toList()

        if (filter == null) {

            val mapper = ObjectMapper()
            val rawStudents = studentRepository.findAll().mapNotNull { student: Student ->
                mapper.convertValue(student, Map::class.java) as Map<String, Any?>
            }
            val formatter = SimpleDateFormat("dd.MM.yyyy")
            val students = rawStudents.mapNotNull { student: Map<String, Any?> ->
                student.map{ (key, value) ->
                    val newKey = tableColumnsRev[key]?: return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseMessage("Ошибка при получении данных:\nСтолбцу $key не соответствует ни 1 описание", false))
                    val stringValue = when (value) {
                        is Date -> formatter.format(value)
                        is Boolean -> if (value) "Да" else "Нет"
                        else -> value?.toString()
                    }
                    newKey to stringValue
                }.toMap().filterKeys { it == "uuid"|| it == "Имя" || it == "Фамилия" || it == "Отчество (при наличии)" || it == "Группа (при наличии)" }
            }
            return ResponseEntity.ok().body(students)
        }
        filter?.let {
            it.forEach {
                builder.addFilterGroup(cols, it)
            }
            val students = builder.data.map { student: Map<String, String?> ->
                student.filterKeys { it == "uuid"|| it == "Имя" || it == "Фамилия" || it == "Отчество (при наличии)" || it == "Группа (при наличии)" }
            }
            return ResponseEntity.ok().body(students)
        }
        return  ResponseEntity.internalServerError().body(ResponseMessage("Не удалось обработать фильтры", false))
    }

    fun getStudent(uuid: UUID): ResponseEntity<Any> {
        val rawStudent = studentRepository.getStudentByUuid(uuid)?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseMessage("Студента не найдено", false))
        val mapper = ObjectMapper()

        val student = mapper.convertValue(rawStudent, Map::class.java) as Map<String, Any?>


        val tableColumnsRev: Map<String, String> = mapOf(
            "uuid" to "uuid",
            "surname" to "Фамилия",
            "name" to "Имя",
            "patronymic" to "Отчество (при наличии)",
            "gender" to "Пол",
            "birthday" to "Дата рождения",
            "phone" to "Номер телефона (при наличии)",
            "regAddr" to "Адрес местожительства по прописке",
            "actAddr" to "Адрес места жительства (фактический)",
            "passportSerial" to "Серия паспорта (при наличии)",
            "passportNumber" to "Номер паспорта",
            "passportDate" to "Дата выдачи паспорта",
            "passportSource" to "Кем выдан паспорт",
            "snils" to "СНИЛС (при наличии)",
            "medPolicy" to "Номер медицинского полиса (при наличии)",
            "foreigner" to "Иностранный гражданин",
            "quota" to "Особая квота (инвалид сирота)",
            "enrlDate" to "Дата зачисления в образовательную организацию",
            "enrlOrderDate" to "Дата приказа о зачислении",
            "enrlOrderNumber" to "Номер приказа о зачислении",
            "studId" to "Номер студенческого билета",
            "studIdDate" to "Дата выдачи студенческого билета",
            "group" to "Группа (при наличии)",
            "educationLevel" to "Наименование уровня образования",
            "fundSrc" to "Источник финансирования",
            "course" to "Номер курса",
            "studyForm" to "Форма обучения",
            "program" to "Наименование направления",
            "programCode" to "Код направления",
            "profile" to "Наименование образовательной программы (Профиль)",
            "duration" to "Срок реализации образовательной программы (кол-во месяцев)",
            "regEndDate" to "Планируемая дата окончания обучения",
            "actEndDate" to "Дата завершения обучения или отчисления (при наличии)",
            "orderEndDate" to "Дата приказа о завершении обучения или отчислении (при наличии)",
            "orderEndNumber" to "Номер приказа о завершении обучения или отчислении (при наличии)",
            "acadStartDate" to "Дата начала академического отпуска (при наличии)",
            "acadEndDate" to "Дата окончания академического отпуска (при наличии)",
            "orderAcadDate" to "Дата приказа о предоставлении академического отпуска (при наличии)",
            "orderAcadNumber" to "Номер приказа о предоставлении академического отпуска (при наличии)"
        )

        val parsedStudent = student.map { (key,value) ->
            val newKey = tableColumnsRev[key]?: return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseMessage("Ошибка при получении данных:\nСтолбцу $key не соответствует ни 1 описание", false))
            val stringValue = when (value) {
                is Date -> formatter.format(value)
                is Boolean -> if (value) "Да" else "Нет"
                else -> value?.toString()
            }
            newKey to stringValue
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

    fun deleteStudent(studentDelete: StudentUpdate): ResponseEntity<Any> {
        val student = studentRepository.getStudentByStudIdAndEnrlOrderNumber(
            studentDelete.studId?: throw RuntimeException("Поле 'Номер студенческого билета' обязательно"),
            studentDelete.enrlOrderNumber?: throw RuntimeException("Поле 'Номер приказа о зачислении' обязательно"))?:
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