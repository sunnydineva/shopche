package com.shop.mapper;

import com.shop.dto.user.AdminUserUpdateDTO;
import com.shop.dto.user.UserDTO;
import com.shop.dto.user.UserUpdateDTO;
import com.shop.model.Role;
import com.shop.model.User;
import com.shop.repository.RoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting between User entity and DTOs
 */
@Component
public class UserMapper {

    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    public UserMapper(PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    /**
     * Convert User entity to UserDTO
     */
    public UserDTO toDTO(User user) {
        if (user == null) {
            return null;
        }

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        dto.setIsActive(user.getIsActive());

        // Map roles to role names
        if (user.getRoles() != null) {
            dto.setRoles(user.getRoles().stream()
                    .map(Role::getName)
                    .collect(Collectors.toSet()));
        }

        return dto;
    }

    /**
     * Convert list of User entities to list of UserDTOs
     */
    public List<UserDTO> toDTOList(List<User> users) {
        return users.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Update User entity from UserUpdateDTO
     */
    public void updateEntity(User user, UserUpdateDTO dto) {
        if (dto == null || user == null) {
            return;
        }

        if (dto.getEmail() != null) {
            user.setEmail(dto.getEmail());
        }

        if (dto.getFirstName() != null) {
            user.setFirstName(dto.getFirstName());
        }

        if (dto.getLastName() != null) {
            user.setLastName(dto.getLastName());
        }

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
    }

    /**
     * Update User entity from AdminUserUpdateDTO
     */
    public void updateEntityByAdmin(User user, AdminUserUpdateDTO dto) {
        if (dto == null || user == null) {
            return;
        }

        if (dto.getEmail() != null) {
            user.setEmail(dto.getEmail());
        }

        if (dto.getFirstName() != null) {
            user.setFirstName(dto.getFirstName());
        }

        if (dto.getLastName() != null) {
            user.setLastName(dto.getLastName());
        }

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        if (dto.getIsActive() != null) {
            user.setIsActive(dto.getIsActive());
        }

        // Update roles if provided
        if (dto.getRoles() != null && !dto.getRoles().isEmpty()) {
            // Clear existing roles
            user.getRoles().clear();

            // Add new roles
            dto.getRoles().forEach(roleName -> {
                roleRepository.findByName(roleName).ifPresent(user::addRole);
            });
        }
    }
}
