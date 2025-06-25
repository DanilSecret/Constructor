package uisi.ru.constructor.component

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.SecretKey

@Component
object JwtUtil {
    private val secretKey: SecretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256)
    private val accessExpirationMs: Long = 24 * 60 * 60 * 1000
    private val refreshExpirationMs: Long = 7 * 24 * 60 * 60 * 1000

    fun getClaims(token: String): Claims {
        return Jwts.parserBuilder()
            .setSigningKey(secretKey)
            .build()
            .parseClaimsJwt(token)
            .body
    }

    fun generateAccessToken(email: String): String {
        return Jwts.builder()
            .setSubject(email)
            .setIssuedAt(Date())
            .setExpiration(Date(System.currentTimeMillis()+ accessExpirationMs))
            .signWith(secretKey, SignatureAlgorithm.HS256)
            .compact()
    }

    fun generateRefreshToken(email: String): String {
        return Jwts.builder()
            .setSubject(email)
            .setIssuedAt(Date())
            .setExpiration(Date(System.currentTimeMillis() + refreshExpirationMs))
            .signWith(secretKey, SignatureAlgorithm.HS256)
            .compact()
    }

    fun validateToken(token: String, email: String): Boolean {
        return try {
            val claims = getClaims(token)
            val username = claims.subject
            val expiration = claims.expiration

            username == email && expiration.after(Date())
        }
        catch (e: Exception) {false}
    }
}