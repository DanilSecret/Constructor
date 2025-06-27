package uisi.ru.constructor.service

import org.springframework.stereotype.Service
import uisi.ru.constructor.repository.HistoryRepository

@Service
class HistoryService(
    private val historyRepository: HistoryRepository
) {
//
}