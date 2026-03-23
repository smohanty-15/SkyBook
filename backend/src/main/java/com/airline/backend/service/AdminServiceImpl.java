package com.airline.backend.service;

import com.airline.backend.entity.Admin;
import com.airline.backend.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public Admin registerAdmin(Admin admin) {
        if (adminRepository.existsByEmail(admin.getEmail())) {
            throw new RuntimeException(
                    "Admin already exists with email: " + admin.getEmail());
        }
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        log.info("Registering new admin: {}", admin.getEmail());
        return adminRepository.save(admin);
    }

    @Override
    public Admin loginAdmin(String email, String password) {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                        "Admin not found with email: " + email));
        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        log.info("Admin logged in: {}", email);
        return admin;
    }

    @Override
    public Admin getAdminById(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Admin not found with id: " + id));
    }
}