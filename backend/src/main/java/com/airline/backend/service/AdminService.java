package com.airline.backend.service;

import com.airline.backend.entity.Admin;

public interface AdminService {
    Admin registerAdmin(Admin admin);
    Admin loginAdmin(String email, String password);
    Admin getAdminById(Long id);
}