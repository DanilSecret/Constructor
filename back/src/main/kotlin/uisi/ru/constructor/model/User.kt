package uisi.ru.constructor.model

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.*


@Entity
@Table(name="Users")
data class User(
    @Id
    @Column(name = "uuid", nullable = false, columnDefinition = "uuid")
    val uuid: UUID,
    @Column(name = "email", nullable = false, unique = true, columnDefinition = "TEXT")
    val email: String,
    @Column(name = "password", nullable = false, columnDefinition = "TEXT")
    @JsonIgnore
    val password: String,
    @Column(name = "role", nullable = false, columnDefinition = "TEXT")
    val role: String
)
