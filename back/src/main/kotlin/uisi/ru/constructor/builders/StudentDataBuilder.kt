package uisi.ru.constructor.builders

import org.apache.poi.ss.usermodel.Cell
import org.apache.poi.ss.usermodel.DataFormatter
import uisi.ru.constructor.model.Columns
import uisi.ru.constructor.model.Student
import java.text.SimpleDateFormat
import java.util.*

class StudentDataBuilder: IStudentDataBuilder {
    private val dateFormatter = SimpleDateFormat("dd.MM.yyyy")
    private val formatter = DataFormatter()

    private val values: Array<Any?> = Array<Any?> (38) {null}

    private val stringNullableValues: Array<Columns> = arrayOf(
        Columns.PATRONYMIC, Columns.PHONE,
        Columns.PASSPORT_SERIAL, Columns.SNILS,
        Columns.MED_POLICY, Columns.STUD_ID,
        Columns.GROUP, Columns.ORDER_END_NUMBER,
        Columns.ORDER_ACAD_NUMBER
    )

    private val dateNullableValues: Array<Columns> = arrayOf(
        Columns.STUD_ID_DATE, Columns.ACT_END_DATE,
        Columns.ORDER_END_DATE, Columns.ACAD_START_DATE,
        Columns.ACAD_END_DATE, Columns.ORDER_ACAD_DATE
    )

    private val dateValues: Array<Columns> = arrayOf(
        Columns.BIRTHDAY, Columns.PASSPORT_DATE,
        Columns.ENRL_DATE, Columns.ENRL_ORDER_DATE,
        Columns.REG_END_DATE
    )


    override fun parseCell(cell: Cell): IStudentDataBuilder {
        val index = cell.columnIndex
        val raw = formatter.formatCellValue(cell).trim()

        when (val column = Columns.entries[index]) {
            Columns.DURATION -> {
                if (raw.isBlank())
                    throw RuntimeException("Неверно задано значение в столбце '${column.desc}', в строке ${cell.rowIndex}")
                else {
                    try{ values[index] = raw.toInt() }
                    catch (e: Exception) {throw RuntimeException("Неверно задано значение в столбце '${column.desc}', в строке ${cell.rowIndex}")}
                }
            }
            Columns.COURSE -> {
                if (raw.isBlank())
                    throw RuntimeException("Неверно задано значение в столбце '${column.desc}', в строке ${cell.rowIndex}")
                else {
                    try{ values[index] = raw.toInt().toShort() }
                    catch (e: Exception) {throw RuntimeException("Неверно задано значение в столбце '${column.desc}', в строке ${cell.rowIndex}")}
                }
            }
            Columns.FOREIGNER -> {
                when (raw.toLowerCase()) {
                    "да" -> values[index] = true
                    "нет" -> values[index] = false
                    else -> throw RuntimeException("Неверно задано значение в столбце '${column.desc}', в строке ${cell.rowIndex}")
                }
            }
            Columns.QUOTA -> {
                when (raw.toLowerCase()) {
                    "да" -> values[index] = true
                    "нет" -> values[index] = false
                    else -> throw RuntimeException("Неверно задано значение в столбце '${column.desc}', в строке ${cell.rowIndex}")
                }
            }
            in stringNullableValues -> {
                values[index] = raw
                if (values[index] == "") values[index] = null
            }
            in dateNullableValues -> {
                if (raw.isBlank()) values[index] = null
                else {
                    try{ values[index] = dateFormatter.parse(raw) }
                    catch (e: Exception) {throw RuntimeException("Неверно задано значение в столбце '${column.desc}', в строке ${cell.rowIndex}")}
                }
            }
            in dateValues -> {
                if (raw.isBlank())
                    throw RuntimeException("Неверно задано значение в столбце '${column.desc}', в строке ${cell.rowIndex}")
                else {
                    try{ values[index] = dateFormatter.parse(raw) }
                    catch (e: Exception) {throw RuntimeException("Неверно задано значение в столбце '${column.desc}', в строке ${cell.rowIndex}")}
                }
            }
            else -> {
                values[index] = raw
                if (raw.isBlank())
                    throw RuntimeException("Неверно задано значение в столбце '${column.desc}', в строке ${cell.rowIndex}")
            }
        }

        return this
    }

    override fun build(row: Int): Student {
        try {
            for (i in 0..values.size-1) {
                if (!(Columns.entries[i] in dateNullableValues || Columns.entries[i] in stringNullableValues) && values[i] == null)
                    throw RuntimeException("Неверно задано значение в столбце '${Columns.entries[i].desc}', в строке $row")
            }
            return Student(
                uuid = UUID.randomUUID(),
                surname = values[0] as String,
                name = values[1] as String,
                patronymic = values[2] as String?,
                gender = values[3] as String,
                birthday = values[4] as Date,
                phone = values[5] as String?,
                regAddr = values[6] as String,
                actAddr = values[7] as String,
                passportSerial = values[8] as String?,
                passportNumber = values[9] as String,
                passportDate = values[10] as Date,
                passportSource = values[11] as String,
                snils = values[12] as String?,
                medPolicy = values[13] as String?,
                foreigner = values[14] as Boolean,
                quota = values[15] as Boolean,
                enrlDate = values[16] as Date,
                enrlOrderDate = values[17] as Date,
                enrlOrderNumber = values[18] as String,
                studId = values[19] as String?,
                studIdDate = values[20] as Date?,
                group = values[21] as String?,
                educationLevel = values[22] as String,
                fundSrc = values[23] as String,
                course = values[24] as Short,
                studyForm = values[25] as String,
                program = values[26] as String,
                programCode = values[27] as String,
                profile = values[28] as String,
                duration = values[29] as Int,
                regEndDate = values[30] as Date,
                actEndDate = values[31] as Date?,
                orderEndDate = values[32] as Date?,
                orderEndNumber = values[33] as String?,
                acadStartDate = values[34] as Date?,
                acadEndDate = values[35] as Date?,
                orderAcadDate = values[36] as Date?,
                orderAcadNumber = values[37] as String?
            )
        }
        catch (e: Exception) {
            throw RuntimeException("Ошибка при создании строки: ${e.message.toString()}")
        }
    }
}