package uisi.ru.constructor.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import uisi.ru.constructor.model.Student
import java.util.UUID

@Repository
interface StudentRepository: JpaRepository<Student, UUID> {

}