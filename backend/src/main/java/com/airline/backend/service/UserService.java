package com.airline.backend.service;

import com.airline.backend.dto.RegisterUserRequest;
import com.airline.backend.entity.User;
import java.util.List;

public interface UserService {
    User registerUser(RegisterUserRequest request);
    User loginUser(String email, String password);
    User getUserById(Long id);
    List<User> getAllUsers();
    boolean existsByEmail(String email);
}