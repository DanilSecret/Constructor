package uisi.ru.constructor.model

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table


@Entity
@Table(name="users")
data class User(
    @Id
    val id: String,
    @Column(name = "email", nullable = false, unique = true, columnDefinition = "TEXT")
    val email: String,
    @Column(name = "password", nullable = false, columnDefinition = "TEXT")
    @JsonIgnore
    val password: String
)
