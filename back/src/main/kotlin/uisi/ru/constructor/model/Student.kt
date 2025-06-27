package uisi.ru.constructor.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.Date
import java.util.UUID

@Entity
@Table(name = "Students")
data class Student(
    @Id
    @Column(name = "uuid", nullable = false, columnDefinition = "UUID")
    val uuid: UUID,
    @Column(name = "surname", nullable = false, columnDefinition = "text")
    val surname: String,
    @Column(name = "name", nullable = false, columnDefinition = "text")
    val name: String,
    @Column(name = "patronymic", nullable = true, columnDefinition = "text")
    val patronymic: String,
    @Column(name = "gender", nullable = false, columnDefinition = "text")
    val gender: String,
    @Column(name = "birthday", nullable = false, columnDefinition = "date")
    val birthday: Date,
    @Column(name = "phone", nullable = true, columnDefinition = "text")
    val phone: String,
    @Column(name = "reg_addr", nullable = false, columnDefinition = "text")
    val regAddr: String,
    @Column(name = "act_addr", nullable = false, columnDefinition = "text")
    val actAddr: String,
    @Column(name = "passport_serial", nullable = true, columnDefinition = "text")
    val passportSerial: String,
    @Column(name = "passport_number", nullable = false, columnDefinition = "text")
    val passportNumber: String,
    @Column(name = "passport_date", nullable = false, columnDefinition = "date")
    val passportDate: Date,
    @Column(name = "passport_source", nullable = false, columnDefinition = "text")
    val passportSource: String,
    @Column(name = "snils", nullable = true, columnDefinition = "text")
    val snils: String,
    @Column(name = "med_policy", nullable = true, columnDefinition = "text")
    val medPolicy: String,
    @Column(name = "foreigner", nullable = false, columnDefinition = "boolean")
    val foreigner: Boolean,
    @Column(name = "quota", nullable = false, columnDefinition = "boolean")
    val quota: Boolean,
    @Column(name = "enrl_date", nullable = false, columnDefinition = "date")
    val enrlDate: Date,
    @Column(name = "enrl_order_date", nullable = false, columnDefinition = "date")
    val enrlOrderDate: Date,
    @Column(name = "enrl_order_number", nullable = false, columnDefinition = "text")
    val enrlOrderNumber: String,
    @Column(name = "stud_id", nullable = true, columnDefinition = "text")
    val studId: String,
    @Column(name = "stud_id_date", nullable = true, columnDefinition = "date")
    val studIdDate: Date,
    @Column(name = "group", nullable = true, columnDefinition = "text")
    val group: String,
    @Column(name = "education_level", nullable = false, columnDefinition = "text")
    val educationLevel: String,
    @Column(name = "fund_src", nullable = false, columnDefinition = "text")
    val fundSrc: String,
    @Column(name = "course", nullable = false, columnDefinition = "smallint")
    val course: Short,
    @Column(name = "study_form", nullable = false, columnDefinition = "text")
    val studyForm: String,
    @Column(name = "program", nullable = false, columnDefinition = "text")
    val program: String,
    @Column(name = "program_code", nullable = false, columnDefinition = "text")
    val programCode: String,
    @Column(name = "profile", nullable = false, columnDefinition = "text")
    val profile: String,
    @Column(name = "duration", nullable = false, columnDefinition = "integer")
    val duration: Int,
    @Column(name = "reg_end_date", nullable = false, columnDefinition = "date")
    val regEndDate: Date,
    @Column(name = "act_end_date", nullable = true, columnDefinition = "date")
    val actEndDate: Date,
    @Column(name = "order_end_date", nullable = true, columnDefinition = "date")
    val orderEndDate: Date,
    @Column(name = "order_end_number", nullable = true, columnDefinition = "text")
    val orderEndNumber: String,
    @Column(name = "acad_start_date", nullable = true, columnDefinition = "date")
    val acadStartDate: Date,
    @Column(name = "acad_end_date", nullable = true, columnDefinition = "date")
    val acadEndDate: Date,
    @Column(name = "order_acad_date", nullable = true, columnDefinition = "date")
    val orderAcadDate: Date,
    @Column(name = "order_acad_numper", nullable = true, columnDefinition = "text")
    val orderAcadNumber: String,
)
