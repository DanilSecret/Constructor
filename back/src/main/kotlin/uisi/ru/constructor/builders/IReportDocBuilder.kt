package uisi.ru.constructor.builders

import org.apache.poi.xssf.usermodel.XSSFWorkbook

interface IReportDocBuilder {
    fun addFilterGroup(columns: List<String>, filter: Map<String,String>): IReportDocBuilder
    fun build(joins: List<List<String>>, columns: List<String>): XSSFWorkbook
}