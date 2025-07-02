package uisi.ru.constructor.model

import java.util.UUID

data class HistoryRequest(
    val userUUID: String,
    val col: List<String>,
    val filter: List<Map<String, String>>,
    val joins: List<List<String>>
)