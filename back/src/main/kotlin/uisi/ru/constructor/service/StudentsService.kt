package uisi.ru.constructor.service

import org.apache.poi.ss.usermodel.DataFormatter
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import uisi.ru.constructor.builders.StudentDataBuilder
import uisi.ru.constructor.model.Columns
import uisi.ru.constructor.model.ResponseError
import uisi.ru.constructor.model.ResponseMessage
import uisi.ru.constructor.model.Student
import uisi.ru.constructor.repository.StudentRepository
import java.io.InputStream
import java.text.SimpleDateFormat
import java.util.*

@Service
class StudentsService(
    private val studentRepository: StudentRepository
) {
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
        catch (e: Exception) { return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseMessage(e.message.toString(), false)) }
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
}