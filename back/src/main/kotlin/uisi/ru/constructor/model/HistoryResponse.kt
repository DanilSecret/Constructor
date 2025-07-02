package uisi.ru.constructor.model

import java.time.OffsetDateTime

data class HistoryResponse(
    val uuid: String,
    val email: String,
    val col: List<String>,
    val filter: List<Map<String, String?>>,
    val joins: List<List<String>>,
    val date: OffsetDateTime
)
