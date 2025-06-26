package uisi.ru.constructor.model

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import org.hibernate.annotations.Type
import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import jakarta.persistence.*
import java.time.OffsetDateTime
import java.util.UUID

@Entity
@Table(name = "History")
data class History(
    @Id
    @Column(name = "uuid", nullable = false)
    val uuid: UUID,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_uuid", nullable = false)
    @JsonIgnoreProperties(value = ["hibernateLazyInitializer","handler"])
    val user: User,

    @Type(value = JsonBinaryType::class)
    @Column(name = "request", nullable = false, columnDefinition = "jsonb")
    val request: ExcelConfig,

    @Column(name = "date", nullable = false, columnDefinition = "timestamp with time zone")
    val date: OffsetDateTime
)
