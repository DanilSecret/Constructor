package uisi.ru.constructor.model

import java.util.UUID

data class DevResponse(
    val uuid: UUID,
    val email: String,
    val password: String,
    val role: String
)
