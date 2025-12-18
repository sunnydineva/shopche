package com.shop.service;

import com.shop.dto.user.AdminUserUpdateDTO;
import com.shop.dto.user.UserDTO;
import com.shop.dto.user.UserUpdateDTO;
import com.shop.exception.ResourceNotFoundException;
import com.shop.mapper.UserMapper;
import com.shop.model.User;
import com.shop.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing users
 */
@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                      UserMapper userMapper,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Get current user by email
     */
    @Transactional(readOnly = true)
    public UserDTO getCurrentUser(String email) {
        logger.info("Fetching current user with email: {}", email);
        User user = findUserByEmail(email);
        return userMapper.toDTO(user);
    }

    /**
     * Update current user
     */
    @Transactional
    public UserDTO updateCurrentUser(String email, UserUpdateDTO userUpdateDTO) {
        logger.info("Updating user with email: {}", email);

        User user = findUserByEmail(email);

        // If email is being changed, check if new email is already taken
        if (userUpdateDTO.getEmail() != null && 
            !userUpdateDTO.getEmail().equals(user.getEmail()) && 
            userRepository.existsByEmail(userUpdateDTO.getEmail())) {
            logger.error("Email {} is already in use", userUpdateDTO.getEmail());
            throw new IllegalArgumentException("Email is already in use");
        }

        // If password is being changed, verify current password
        if (userUpdateDTO.getPassword() != null && !userUpdateDTO.getPassword().isEmpty()) {
            if (userUpdateDTO.getCurrentPassword() == null || userUpdateDTO.getCurrentPassword().isEmpty()) {
                logger.error("Current password is required to change password");
                throw new IllegalArgumentException("Current password is required to change password");
            }

            if (!passwordEncoder.matches(userUpdateDTO.getCurrentPassword(), user.getPassword())) {
                logger.error("Current password is incorrect");
                throw new IllegalArgumentException("Current password is incorrect");
            }
        }

        userMapper.updateEntity(user, userUpdateDTO);
        User updatedUser = userRepository.save(user);

        logger.info("User updated: {}", updatedUser.getId());
        return userMapper.toDTO(updatedUser);
    }

    /**
     * Get user by ID (admin)
     */
    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {
        logger.info("Fetching user with ID: {}", id);
        User user = findUserById(id);
        return userMapper.toDTO(user);
    }

    /**
     * Helper method to find user by email
     */
    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.error("User not found with email: {}", email);
                    return new UsernameNotFoundException("User not found with email: " + email);
                });
    }

    /**
     * Helper method to find user by ID
     */
    private User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("User not found with ID: {}", id);
                    return new ResourceNotFoundException("User", "id", id);
                });
    }

    /**
     * Get all users with pagination (admin)
     */
    @Transactional(readOnly = true)
    public Page<UserDTO> getAllUsers(Pageable pageable) {
        logger.info("Fetching all users with pagination");
        Page<User> users = userRepository.findAll(pageable);
        return users.map(userMapper::toDTO);
    }

    /**
     * Update user by ID (admin)
     */
    @Transactional
    public UserDTO updateUserByAdmin(Long id, AdminUserUpdateDTO userUpdateDTO) {
        logger.info("Admin updating user with ID: {}", id);

        User user = findUserById(id);

        // If email is being changed, check if new email is already taken
        if (userUpdateDTO.getEmail() != null && 
            !userUpdateDTO.getEmail().equals(user.getEmail()) && 
            userRepository.existsByEmail(userUpdateDTO.getEmail())) {
            logger.error("Email {} is already in use", userUpdateDTO.getEmail());
            throw new IllegalArgumentException("Email is already in use");
        }

        userMapper.updateEntityByAdmin(user, userUpdateDTO);
        User updatedUser = userRepository.save(user);

        logger.info("User updated by admin: {}", updatedUser.getId());
        return userMapper.toDTO(updatedUser);
    }

    /**
     * Deactivate user (admin)
     */
    @Transactional
    public UserDTO deactivateUser(Long id) {
        logger.info("Deactivating user with ID: {}", id);

        User user = findUserById(id);
        user.setIsActive(false);
        User updatedUser = userRepository.save(user);

        logger.info("User deactivated: {}", updatedUser.getId());
        return userMapper.toDTO(updatedUser);
    }
}
