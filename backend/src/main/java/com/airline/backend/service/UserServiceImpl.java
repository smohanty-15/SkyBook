package com.airline.backend.service;

import com.airline.backend.dto.RegisterUserRequest;
import com.airline.backend.entity.PasswordResetToken;
import com.airline.backend.entity.User;
import com.airline.backend.repository.PasswordResetTokenRepository;
import com.airline.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

    @Override
    public User registerUser(RegisterUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAge(request.getAge());
        user.setGender(request.getGender());
        user.setCountry(request.getCountry());
        User saved = userRepository.save(user);
        emailService.sendWelcomeEmail(saved.getEmail(), saved.getName());
        log.info("User registered: {}", request.getEmail());
        return saved;
    }

    @Override
    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                        "User not found with email: " + email));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        log.info("User logged in: {}", email);
        return user;
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "User not found with id: " + id));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                        "No user found with email: " + email));

        tokenRepository.deleteByEmail(email);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setEmail(email);
        resetToken.setExpiryTime(LocalDateTime.now().plusMinutes(30));
        resetToken.setUsed(false);
        tokenRepository.save(resetToken);

        emailService.sendPasswordResetEmail(
                email, user.getName(), token);
        log.info("Password reset token generated for: {}", email);
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (resetToken.isUsed()) {
            throw new RuntimeException("Token already used");
        }
        if (resetToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token has expired");
        }

        User user = userRepository.findByEmail(resetToken.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
        log.info("Password reset successful for: {}", user.getEmail());
    }

    @Override
    public void updateProfile(Long id, RegisterUserRequest request) {
        User user = getUserById(id);
        user.setName(request.getName());
        user.setAge(request.getAge());
        user.setGender(request.getGender());
        user.setCountry(request.getCountry());
        userRepository.save(user);
        log.info("Profile updated for user id: {}", id);
    }
}