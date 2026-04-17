package com.shop.config;

import com.shop.model.Role;
import com.shop.model.User;
import com.shop.repository.RoleRepository;
import com.shop.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * Component to initialize sample data for development and testing
 */
@Profile("!h2")
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

//    @Autowired
//    private PasswordEncoder passwordEncoder;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    @Transactional
    public void run(String... args) {
        // Only initialize data if the database is empty
        if (userRepository.count() == 0) {
            logger.info("Initializing sample data...");

            // Create roles if they don't exist
            createRolesIfNotExist();

            // Create users
            createUsers();

            logger.info("Sample data initialization completed.");
        } else {
            logger.info("Database already contains data, skipping initialization.");
        }
    }

    private void createRolesIfNotExist() {
        if (roleRepository.count() == 0) {
            logger.info("Creating roles...");

            Role userRole = new Role("ROLE_USER");
            Role adminRole = new Role("ROLE_ADMIN");

            roleRepository.saveAll(Arrays.asList(userRole, adminRole));
        }
    }

    private void createUsers() {
        logger.info("Creating users...");

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("User role not found"));

        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new RuntimeException("Admin role not found"));

        // Create regular user
        User user = new User(
                "user@example.com",
                passwordEncoder.encode("password"),
                "John",
                "Doe"
        );
        Set<Role> userRoles = new HashSet<>();
        userRoles.add(userRole);
        user.setRoles(userRoles);
        userRepository.save(user);

        // Create admin user
        User admin = new User(
                "admin@example.com",
                passwordEncoder.encode("password"),
                "Admin",
                "User"
        );
        Set<Role> adminRoles = new HashSet<>();
        adminRoles.add(userRole);
        adminRoles.add(adminRole);
        admin.setRoles(adminRoles);
        userRepository.save(admin);

        logger.info("Created {} users", userRepository.count());
    }
}
