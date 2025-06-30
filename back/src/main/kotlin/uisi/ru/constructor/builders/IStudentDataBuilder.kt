package uisi.ru.constructor.builders

import org.apache.poi.ss.usermodel.Cell
import uisi.ru.constructor.model.Student
import java.util.UUID

interface IStudentDataBuilder {
    fun parseCell(cell: Cell): IStudentDataBuilder
    fun build(row: Int, uuid: UUID): Student
}