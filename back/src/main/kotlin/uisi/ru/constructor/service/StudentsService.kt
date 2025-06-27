package uisi.ru.constructor.service

import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import uisi.ru.constructor.model.Student
import java.io.InputStream
import java.util.*

@Service
class StudentsService {
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
                            birthday = row.getCell(4).dateCellValue,
                            phone = row.getCell(5).stringCellValue,
                            regAddr = row.getCell(6).stringCellValue,
                            actAddr = row.getCell(7).stringCellValue,
                            passportSerial = row.getCell(8).stringCellValue,
                            passportNumber = row.getCell(10).stringCellValue,
                            passportDate = row.getCell(11).dateCellValue,
                            passportSource = row.getCell(12).stringCellValue,
                            snils = row.getCell(13).stringCellValue,
                            medPolicy = row.getCell(14).stringCellValue,
                            foreigner = row.getCell(15).booleanCellValue,
                            quota = row.getCell(16).booleanCellValue,
                            enrlDate = row.getCell(17).dateCellValue,
                            enrlOrderDate = row.getCell(18).dateCellValue,
                            enrlOrderNumber = row.getCell(19).stringCellValue,
                            studId = row.getCell(20).stringCellValue,
                            studIdDate = row.getCell(21).dateCellValue,
                            group = row.getCell(22).stringCellValue,
                            educationLevel = row.getCell(23).stringCellValue,
                            fundSrc = row.getCell(24).stringCellValue,
                            course = (row.getCell(25).numericCellValue).toInt().toShort(),
                            studyForm = row.getCell(26).stringCellValue,
                            program = row.getCell(27).stringCellValue,
                            programCode = row.getCell(28).stringCellValue,
                            profile = row.getCell(29).stringCellValue,
                            duration = row.getCell(30).numericCellValue.toInt(),
                            regEndDate = row.getCell(31).dateCellValue,
                            actEndDate = row.getCell(32).dateCellValue,
                            orderEndDate = row.getCell(33).dateCellValue,
                            orderEndNumber = row.getCell(34).stringCellValue,
                            acadStartDate = row.getCell(35).dateCellValue,
                            acadEndDate = row.getCell(36).dateCellValue,
                            orderAcadDate = row.getCell(37).dateCellValue,
                            orderAcadNumber = row.getCell(38).stringCellValue
                        )
                    )
                }
            }
            return ResponseEntity.ok().body(table)
        }
        catch (e: Exception) { return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.message.toString()) }
    }
}