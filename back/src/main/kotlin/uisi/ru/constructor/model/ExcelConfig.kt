package uisi.ru.constructor.model

data class ExcelConfig(
    val col: List<String>,
    val filter: List<List<String>>,
    val joins: List<List<String>>
)
