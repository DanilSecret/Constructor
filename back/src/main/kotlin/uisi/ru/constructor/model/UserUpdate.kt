package uisi.ru.constructor.model

data class UserUpdate(
    val uuid: String,
    val email: String?,
    val password: String?,
    val role: String?
)
