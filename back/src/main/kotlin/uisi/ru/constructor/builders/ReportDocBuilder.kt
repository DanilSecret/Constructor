package uisi.ru.constructor.builders

import jakarta.persistence.EntityManager
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.web.servlet.function.router
import uisi.ru.constructor.model.Student
import uisi.ru.constructor.repository.StudentRepository
import java.text.SimpleDateFormat
import java.util.Date
import kotlin.reflect.typeOf

class ReportDocBuilder(
    private val entityManager: EntityManager
): IReportDocBuilder {
    val report: XSSFWorkbook = XSSFWorkbook()

    private val formatter = SimpleDateFormat("dd.MM.yyyy")

    private val data: MutableList<Map<String, String?>> = emptyList<Map<String,String?>>().toMutableList()

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
    private val tableColumnsRev: Map<String, String> = mapOf(
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

    override fun addFilterGroup(columns: List<String>, filter: Map<String, String>): IReportDocBuilder {
        val queryColumns: List<String> = columns.mapNotNull { tableColumns[it] }
        val queryFilter: Map<String, String> = filter.mapNotNull { (key, value) ->
            tableColumns[key]?: throw RuntimeException("Неверно задано название столбца: $key")
            tableColumns[key]!! to value
        }.toMap()

        val cb = entityManager.criteriaBuilder
        val cq = cb.createTupleQuery()
        val root = cq.from(Student::class.java)

        val selections = queryColumns.map { root.get<Any>(it).alias(it) }
        cq.multiselect(selections)

        val predicates = queryFilter.map { (column, value) ->
            root.get<String>(column)?.let { cb.equal(it, value) }
        }
        cq.where(*predicates.toTypedArray())

        entityManager.createQuery(cq).resultList.map { tuple -> queryColumns.associateWith { tuple[it] } }
            .forEach { map: Map<String, Any?> ->
                val newMap = map.map { (key, value) ->
                    val newKey = tableColumnsRev[key]?: throw RuntimeException("Ошибка при получении данных:\nСтолбцу $key не соответствует ни 1 описание")
                    val stringValue = when (value) {
                        is Date -> formatter.format(value)
                        is Boolean -> if (value) "Да" else "Нет"
                        else -> value?.toString()
                    }
                    newKey to stringValue
                }.toMap()
                data.add(newMap)
            }

        return this
    }

    override fun build(joins: List<List<String>>, columns: List<String>): XSSFWorkbook {

        val sheetData = emptyList<Map<String, String?>>().toMutableList()
        val headers = columns.filterNot { it in joins.flatten().toSet() }.toMutableList()

        data.forEach { map: Map<String, String?> ->
            val newMap = mutableMapOf<String, String?>()

            headers.forEach { key ->
                newMap[key] = map[key]
            }

            joins.forEach{ joinGroup: List<String> ->
                val key = joinGroup.joinToString("\n")
                val value = joinGroup.mapNotNull { map[it] }.joinToString(" ")
                newMap[key] = value
            }

            sheetData.add(newMap)
        }

        val sheet = report.createSheet("Отчёт")

        val headerRow = sheet.createRow(0)

        headers.forEachIndexed { index, title ->
            val cell = headerRow.createCell(index)
            cell.setCellValue(title)
        }

        sheetData.forEachIndexed { index, map ->
            val row = sheet.createRow(index+1)
            map.forEach { key, value ->
                val i = headers.indexOf(key)
                val cell = row.createCell(i)
                cell.setCellValue(value)
                sheet.autoSizeColumn(i)
            }
        }

        return report
    }
}