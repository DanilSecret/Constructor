package uisi.ru.constructor.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import uisi.ru.constructor.model.History
import uisi.ru.constructor.model.User
import java.time.OffsetDateTime
import java.util.UUID

@Repository
interface HistoryRepository: JpaRepository<History, UUID> {
    fun findByUser(user: User): List<History>
    fun findByDateBetween(startDate: OffsetDateTime, endDate:OffsetDateTime): List<History>
}