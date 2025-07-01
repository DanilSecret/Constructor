package uisi.ru.constructor.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import uisi.ru.constructor.model.User
import java.util.UUID

@Repository
interface UserRepository: JpaRepository<User, UUID> {
    fun findByEmail(email: String): User?
    fun getUserByUuid(uuid: UUID): User?
}