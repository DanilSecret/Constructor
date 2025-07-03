package uisi.ru.constructor.service

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import uisi.ru.constructor.model.History
import uisi.ru.constructor.model.HistoryResponse
import uisi.ru.constructor.model.ResponseMessage
import uisi.ru.constructor.repository.HistoryRepository
import uisi.ru.constructor.repository.UserRepository
import java.util.UUID

@Service
class HistoryService(
    private val historyRepository: HistoryRepository,
    private val userRepository: UserRepository
) {
    fun getSelfHistory(userUUID: UUID): ResponseEntity<Any> {
        val user = userRepository.getUserByUuid(userUUID)?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseMessage("Не найдено пользователя", false))
        val historyList = historyRepository.getHistoriesByUser(user).mapNotNull { his: History ->
            HistoryResponse(
                uuid = his.uuid.toString(),
                email = his.user.email,
                col = his.request.col,
                filter = his.request.filter,
                joins = his.request.joins,
                date = his.date
            )
        }

        return ResponseEntity.ok().body(historyList)
    }

    fun getAllHistory(): ResponseEntity<Any> {
        try {
            val rawHistory = historyRepository.findAll()
            val history = rawHistory.mapNotNull { h: History ->
                HistoryResponse(
                    uuid = h.uuid.toString(),
                    email = h.user.email,
                    col = h.request.col,
                    filter = h.request.filter,
                    joins = h.request.joins,
                    date = h.date
                )
            }
            return ResponseEntity.ok().body(history)
        }
        catch (e: Exception){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseMessage(e.message.toString(), false))
        }
    }

    fun deleteAll(): ResponseEntity<Any> {
        try {
            historyRepository.deleteAll()
            return ResponseEntity.ok().body(ResponseMessage("Таблица очищена", true))
        }
        catch (e:Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseMessage(e.message.toString(), false))
        }
    }
}