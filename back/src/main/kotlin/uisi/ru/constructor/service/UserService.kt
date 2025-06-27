package uisi.ru.constructor.service

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import uisi.ru.constructor.component.JwtUtil
import uisi.ru.constructor.model.ResponseLogin
import uisi.ru.constructor.model.ResponseMessage
import uisi.ru.constructor.model.User
import uisi.ru.constructor.model.UserLogin
import uisi.ru.constructor.repository.UserRepository

@Service
class UserService(
    private val userRepository: UserRepository,
    private val jwtUtil: JwtUtil
) {
    private val passwordEncoder = BCryptPasswordEncoder()

    fun login(userLogin: UserLogin): ResponseEntity<Any> {
        val user = userRepository.findByEmail(userLogin.email)
        user?.let {
            if (validatePassword(userLogin.password, user)) {
                val token = jwtUtil.generateAccessToken(user.email)
                return ResponseEntity.ok().body(ResponseLogin(user, token))
            }
            else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ResponseMessage("Неверный пароль"))
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseMessage("Пользователя с email ${userLogin.email} не найдено"))
    }

    fun validatePassword(password: String, user: User): Boolean {
        return if (passwordEncoder.matches(password, user.password)) true else false
    }
}