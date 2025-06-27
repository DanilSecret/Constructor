package uisi.ru.constructor.service

import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.io.InputStream
import java.util.Date

@Service
class StudentsService {
    fun uploadXlsx(file: InputStream): ResponseEntity<Any> {
        val workbook = XSSFWorkbook(file)
        val sheet = workbook.getSheetAt(0)

        for (i in 1..sheet.lastRowNum) {
            val row = sheet.getRow(i)
            if (row != null)
            {
                val cell: Date? = row.getCell(0)?.dateCellValue
            }
        }
        return ResponseEntity.ok().body("123")
    }
}