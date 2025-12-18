package com.shop.config;

import com.shop.model.Category;
import com.shop.model.Product;
import com.shop.model.Role;
import com.shop.model.User;
import com.shop.model.enums.Currency;
import com.shop.repository.CategoryRepository;
import com.shop.repository.ProductRepository;
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

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
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

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

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

            // Create categories and products
            createCategoriesAndProducts();

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

    private void createCategoriesAndProducts() {
        logger.info("Creating categories and products...");

        // Create or get categories
        List<Category> categories = categoryRepository.findAll();
        if (categories.isEmpty()) {
            logger.info("No categories found, creating sample categories...");

            Category electronics = new Category("Electronics", "Electronic devices and accessories");
            Category clothing = new Category("Clothing", "Apparel and fashion items");
            Category books = new Category("Books", "Books, e-books, and publications");

            categories = categoryRepository.saveAll(Arrays.asList(electronics, clothing, books));
        }

        // Create products if none exist
        if (productRepository.count() == 0) {
            logger.info("Creating sample products...");

            // Electronics products
            Category electronics = categories.stream()
                    .filter(c -> c.getName().equals("Electronics"))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Electronics category not found"));

            Product laptop = new Product(
                    "Laptop Pro",
                    "High-performance laptop with 16GB RAM and 512GB SSD",
                    new BigDecimal("1299.99"),
                    Currency.USD,
                    50
            );
            laptop.setCategory(electronics);
//            laptop.setImageUrl("https://example.com/images/laptop.jpg");
            laptop.setImageUrl("https://images.stockcake.com/public/1/f/e/1fec4b0a-7d31-43fe-a6c4-9fa1ac194d57/laptop-on-desk-stockcake.jpg");

            Product smartphone = new Product(
                    "Smartphone X",
                    "Latest smartphone with 6.5-inch display and 128GB storage",
                    new BigDecimal("899.99"),
                    Currency.USD,
                    100
            );
            smartphone.setCategory(electronics);
//            smartphone.setImageUrl("https://example.com/images/smartphone.jpg");
            smartphone.setImageUrl("https://images.stockcake.com/public/4/1/f/41ff3157-5cf5-4fb6-894e-ca05ea4f8da0_large/smartphone-interactive-display-stockcake.jpg");

            Product headphones = new Product(
                    "Noise-Cancelling Headphones",
                    "Premium wireless headphones with active noise cancellation",
                    new BigDecimal("249.99"),
                    Currency.USD,
                    75
            );
            headphones.setCategory(electronics);
            headphones.setImageUrl("https://images.stockcake.com/public/b/d/e/bde9ffd3-6b54-4add-860d-116dcfe1efa6_large/neon-floating-headphones-stockcake.jpg");

            // Clothing products
            Category clothing = categories.stream()
                    .filter(c -> c.getName().equals("Clothing"))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Clothing category not found"));

            Product tShirt = new Product(
                    "Cotton T-Shirt",
                    "Comfortable 100% cotton t-shirt in various colors",
                    new BigDecimal("19.99"),
                    Currency.USD,
                    200
            );
            tShirt.setCategory(clothing);
            tShirt.setImageUrl("https://images.stockcake.com/public/f/4/0/f401f957-cbd4-4082-a965-0e438b2f515f_large/geometric-design-t-shirt-stockcake.jpg");

            Product jeans = new Product(
                    "Slim Fit Jeans",
                    "Classic slim fit jeans in dark blue",
                    new BigDecimal("49.99"),
                    Currency.USD,
                    150
            );
            jeans.setCategory(clothing);
            jeans.setImageUrl("https://images.stockcake.com/public/0/4/f/04ffffab-9fef-4bd5-8494-980490bd840a_large/hanging-denim-jeans-stockcake.jpg");

            // Books products
            Category books = categories.stream()
                    .filter(c -> c.getName().equals("Books"))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Books category not found"));

            Product novel = new Product(
                    "Bestseller Novel",
                    "Award-winning fiction novel by a renowned author",
                    new BigDecimal("24.99"),
                    Currency.USD,
                    100
            );
            novel.setCategory(books);
            novel.setImageUrl("https://images.stockcake.com/public/f/e/7/fe72d21e-9554-4ce9-841d-ae55f30313e4_large/elegant-floating-book-stockcake.jpg");

            Product cookbook = new Product(
                    "Gourmet Cookbook",
                    "Collection of gourmet recipes from around the world",
                    new BigDecimal("34.99"),
                    Currency.USD,
                    80
            );
            cookbook.setCategory(books);
            cookbook.setImageUrl("https://images.stockcake.com/public/9/9/0/990b206a-b754-4920-b7f5-5f53017e3465_large/ancient-cookbook-exploration-stockcake.jpg");

            productRepository.saveAll(Arrays.asList(
                    laptop, smartphone, headphones, tShirt, jeans, novel, cookbook
            ));

            logger.info("Created {} products", productRepository.count());
        }
    }
}
