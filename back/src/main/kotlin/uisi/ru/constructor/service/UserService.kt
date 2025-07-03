package uisi.ru.constructor.service

import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletResponse
import org.apache.coyote.Response
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import uisi.ru.constructor.component.JwtUtil
import uisi.ru.constructor.model.*
import uisi.ru.constructor.repository.UserRepository
import java.util.*

@Service
class UserService(
    private val userRepository: UserRepository,
    private val jwtUtil: JwtUtil
) {
    private val passwordEncoder = BCryptPasswordEncoder()


    fun register(userRegister: UserRegister): ResponseEntity<Any> {
        val user = userRepository.findByEmail(userRegister.email)?.let { return ResponseEntity.badRequest().body(ResponseMessage("Пользователь с таким email уже есть",false)) }
        try {
            val newUser = User(
                uuid = UUID.randomUUID(),
                email = userRegister.email,
                password = passwordEncoder.encode(userRegister.password),
                role = Roles.valueOf(userRegister.role.uppercase()).toString(),
            )
            userRepository.save(newUser)
            return ResponseEntity.ok().body(ResponseMessage("Новый пользователь успешно добавлен",true))
        }
        catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseMessage(e.message.toString(), false))
        }
    }

    fun login(userLogin: UserLogin, response: HttpServletResponse): ResponseEntity<Any> {
        val user = userRepository.findByEmail(userLogin.email)
        user?.let {
            if (validatePassword(userLogin.password, user)) {
                val token = jwtUtil.generateAccessToken(user.email)
                val cookie = Cookie("token", token).apply {
                    isHttpOnly = true
                    path = "/"
                    maxAge = 60*60*24*365
                }
                response.addCookie(cookie)
                return ResponseEntity.ok().body(ResponseLogin(user))
            }
            else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ResponseMessage("Неверный пароль",false))
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseMessage("Пользователя с email ${userLogin.email} не найдено",false))
    }

    fun update(request: UserUpdate): ResponseEntity<Any> {
        val user = userRepository.getUserByUuid(UUID.fromString(request.uuid))?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseMessage("Пользователя не найдено", false))
        request.email?.let {
            userRepository.findByEmail(request.email)?.let {
                if (!(request.email == it.email))
                return ResponseEntity.badRequest().body(ResponseMessage("Email уже занят"))
            }
        }
        val password = when (request.password){
            null -> user.password
            else -> passwordEncoder.encode(request.password)
        }
        val role = when (request.role) {
            null -> user.role
            else -> try {
                Roles.valueOf(request.role.uppercase()).toString()
            }
            catch (e: Exception) {
                return ResponseEntity.badRequest().body(ResponseMessage("Роль задана неправильно", false))
            }
        }

        try {
            val updUser = user.copy(
                uuid = user.uuid,
                email = request.email?: user.email,
                password = password,
                role = role
            )

            userRepository.save(updUser)
            return ResponseEntity.ok().body(ResponseMessage("Пользователь успешно обновлен", true))
        }
        catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseMessage(e.message.toString(), false))
        }
    }

    fun validatePassword(password: String, user: User): Boolean {
        return if (passwordEncoder.matches(password, user.password)) true else false
    }

    fun getAllUsers(): ResponseEntity<Any> {
        val users = userRepository.findAll()
        if (users.isEmpty()) return ResponseEntity.internalServerError().body(ResponseMessage("Не удалось получить список пользователей", false))
        return ResponseEntity.ok().body(users)
    }

    fun getUser(uuid: UUID): ResponseEntity<Any> {
        val user = userRepository.getUserByUuid(uuid)?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseMessage("Пользователя не найдено", false))
        return ResponseEntity.ok().body(user)
    }

    fun deleteUser(userDelete: UUIDRequest): ResponseEntity<Any> {
        val user = userRepository.getUserByUuid(UUID.fromString(userDelete.uuid))?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseMessage("Пользователя не найдено", false))
        try {
            userRepository.delete(user)
            return ResponseEntity.ok().body(ResponseMessage("Пользователь удален", true))
        }
        catch (e: Exception) {return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseMessage(e.message.toString(),false))}
    }
}