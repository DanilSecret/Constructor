package uisi.ru.constructor.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import uisi.ru.constructor.model.History
import java.util.UUID

@Repository
interface HistoryRepository: JpaRepository<History, UUID> {
    fun findByUser_uuid(user_uuid: UUID): List<History>
}