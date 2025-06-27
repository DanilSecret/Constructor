package uisi.ru.constructor.service

import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import uisi.ru.constructor.model.ResponseError
import uisi.ru.constructor.model.Student
import java.io.InputStream
import java.text.SimpleDateFormat
import java.util.*

@Service
class StudentsService {
    fun String.toBooleanRu(): Boolean? {
        return when(this.trim().toLowerCase()) {
            "true" -> true;
            "false" -> false;
            "да" -> true;
            "нет" -> false;
            else -> null;
        }
    }

    fun String.toDateRu(): Date? {
        try {
            val formatter = SimpleDateFormat("dd.MM.yyyy")
            return formatter.parse(this)
        }
        catch (ex: Exception) {
            return null;
        }
    }
    fun uploadXlsx(file: InputStream): ResponseEntity<Any> {
        try {
            val workbook = XSSFWorkbook(file)
            val sheet = workbook.getSheetAt(0)

            val table: MutableList<Student> = emptyList<Student>().toMutableList()
            for (i in 1..sheet.lastRowNum) {
                val row = sheet.getRow(i)
                if (row != null) {
                    table.add(
                        Student(
                            uuid = UUID.randomUUID(),
                            surname = row.getCell(0).stringCellValue,
                            name = row.getCell(1).stringCellValue,
                            patronymic = row.getCell(2).stringCellValue,
                            gender = row.getCell(3).stringCellValue,
                            birthday = row.getCell(4).stringCellValue.toDateRu()?:
                            return ResponseEntity.badRequest().body(ResponseError("Неверно задано значение в ${row.getCell(4).stringCellValue}")),
                            phone = row.getCell(5).stringCellValue,
                            regAddr = row.getCell(6).stringCellValue,
                            actAddr = row.getCell(7).stringCellValue,
                            passportSerial = row.getCell(8).stringCellValue,
                            passportNumber = row.getCell(9).stringCellValue,
                            passportDate = row.getCell(10).stringCellValue.toDateRu()?:
                            return ResponseEntity.badRequest().body(ResponseError("Неверно задано значение в ${row.getCell(10).stringCellValue}")),
                            passportSource = row.getCell(11).stringCellValue,
                            snils = row.getCell(12).stringCellValue,
                            medPolicy = row.getCell(13).stringCellValue,
                            foreigner = row.getCell(14).stringCellValue.toBooleanRu()?:
                            return ResponseEntity.badRequest().body("не задано значение ${sheet.getRow(0).getCell(15).stringCellValue}"),
                            quota = row.getCell(15).stringCellValue.toBooleanRu()?:
                            return ResponseEntity.badRequest().body("не задано значение ${sheet.getRow(0).getCell(16).stringCellValue}"),
                            enrlDate = row.getCell(16).stringCellValue.toDateRu()?:
                            return ResponseEntity.badRequest().body(ResponseError("Неверно задано значение в ${row.getCell(16).stringCellValue}")),
                            enrlOrderDate = row.getCell(17).stringCellValue.toDateRu()?:
                            return ResponseEntity.badRequest().body(ResponseError("Неверно задано значение в ${row.getCell(17).stringCellValue}")),
                            enrlOrderNumber = row.getCell(18).stringCellValue,
                            studId = row.getCell(19).stringCellValue,
                            studIdDate = row.getCell(20).stringCellValue.toDateRu()?:
                            return ResponseEntity.badRequest().body(ResponseError("Неверно задано значение в ${row.getCell(20).stringCellValue}")),
                            group = row.getCell(21).stringCellValue,
                            educationLevel = row.getCell(22).stringCellValue,
                            fundSrc = row.getCell(23).stringCellValue,
                            course = row.getCell(24).stringCellValue.toInt().toShort(),
                            studyForm = row.getCell(25).stringCellValue,
                            program = row.getCell(26).stringCellValue,
                            programCode = row.getCell(27).stringCellValue,
                            profile = row.getCell(28).stringCellValue,
                            duration = row.getCell(29).stringCellValue.toInt(),
                            regEndDate = row.getCell(30).stringCellValue.toDateRu()?:
                            return ResponseEntity.badRequest().body(ResponseError("Неверно задано значение в ${row.getCell(30).stringCellValue}")),
                            actEndDate = row.getCell(31).stringCellValue.toDateRu()?:
                            return ResponseEntity.badRequest().body(ResponseError("Неверно задано значение в ${row.getCell(31).stringCellValue}")),
                            orderEndDate = row.getCell(32).stringCellValue.toDateRu()?:
                            return ResponseEntity.badRequest().body(ResponseError("Неверно задано значение в ${row.getCell(32).stringCellValue}")),
                            orderEndNumber = row.getCell(33).stringCellValue,
                            acadStartDate = row.getCell(34).stringCellValue.toDateRu()?:
                            return ResponseEntity.badRequest().body(ResponseError("Неверно задано значение в ${row.getCell(34).stringCellValue}")),
                            acadEndDate = row.getCell(35).stringCellValue.toDateRu()?:
                            return ResponseEntity.badRequest().body(ResponseError("Неверно задано значение в ${row.getCell(35).stringCellValue}")),
                            orderAcadDate = row.getCell(36).stringCellValue.toDateRu()?:
                            return ResponseEntity.badRequest().body(ResponseError("Неверно задано значение в ${row.getCell(36).stringCellValue}")),
                            orderAcadNumber = row.getCell(37).stringCellValue
                        )
                    )
                }
            }
            return ResponseEntity.ok().body(table)
        }
        catch (e: Exception) { return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.message.toString()) }
    }
}