package uisi.ru.constructor.security

import uisi.ru.constructor.component.JwtUtil
import uisi.ru.constructor.model.User
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import uisi.ru.constructor.repository.UserRepository

@Component
class JwtAuthFilter(
    private val userRepository: UserRepository,
    private val jwtUtil: JwtUtil
):OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authHeader = request.getHeader("Authorization")

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response)
            return
        }

        val token = authHeader.replace("Bearer ","")
        try{
            val email = jwtUtil.getClaims(token).subject
            if(email != null && SecurityContextHolder.getContext().authentication == null) {
                val userDetails = userRepository.findByEmail(email)
                userDetails?.let {
                    if (jwtUtil.validateToken(token, userDetails.email)) {
                        val authorities = listOf(SimpleGrantedAuthority(userDetails.role))
                        val authToken = UsernamePasswordAuthenticationToken(
                            userDetails, null, authorities
                        )
                        authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
                        SecurityContextHolder.getContext().authentication = authToken
                    }
                }
            }
        }
        catch (e: Exception) {
            logger.warn("Ошибка аунтефикации: ${e.message}")
        }
        filterChain.doFilter(request,response)
    }
}
