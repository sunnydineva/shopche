package com.shop.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class DatabaseInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseInitializer.class);

    @Value("${spring.datasource.url}")
    private String datasourceUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;

    @Bean
    public CommandLineRunner initDatabase() {
        return args -> {
            // Skip database creation if URL contains a host other than localhost
            // This is likely a Docker environment where the database is created by the MySQL container
            if (!datasourceUrl.contains("localhost")) {
                logger.info("Not running on localhost, skipping database initialization. Assuming database is created by Docker.");
                return;
            }

            // Extract database name from the URL
            String databaseName = extractDatabaseName(datasourceUrl);
            if (databaseName == null) {
                logger.error("Could not extract database name from URL: {}", datasourceUrl);
                return;
            }

            // Create connection URL without database name
            String connectionUrl = createConnectionUrlWithoutDatabase(datasourceUrl);

            logger.info("Checking if database '{}' exists...", databaseName);

            try (Connection connection = DriverManager.getConnection(connectionUrl, username, password)) {
                // Check if database exists
                if (!databaseExists(connection, databaseName)) {
                    logger.info("Database '{}' does not exist. Creating it now...", databaseName);
                    createDatabase(connection, databaseName);
                    logger.info("Database '{}' created successfully.", databaseName);
                } else {
                    logger.info("Database '{}' already exists.", databaseName);
                }
            } catch (SQLException e) {
                logger.error("Error initializing database: {}", e.getMessage(), e);
            }
        };
    }

    private String extractDatabaseName(String url) {
        // Extract database name from JDBC URL
        // Format: jdbc:mysql://localhost:3306/online_shop?useSSL=false...
        int lastSlashIndex = url.lastIndexOf('/');
        if (lastSlashIndex == -1) {
            return null;
        }

        String dbNameWithParams = url.substring(lastSlashIndex + 1);
        int questionMarkIndex = dbNameWithParams.indexOf('?');

        if (questionMarkIndex == -1) {
            return dbNameWithParams;
        } else {
            return dbNameWithParams.substring(0, questionMarkIndex);
        }
    }

    private String createConnectionUrlWithoutDatabase(String url) {
        // Create connection URL without database name
        // From: jdbc:mysql://localhost:3306/online_shop?useSSL=false...
        // To:   jdbc:mysql://localhost:3306/?useSSL=false...
        int lastSlashIndex = url.lastIndexOf('/');
        if (lastSlashIndex == -1) {
            return url;
        }

        int questionMarkIndex = url.indexOf('?', lastSlashIndex);

        if (questionMarkIndex == -1) {
            return url.substring(0, lastSlashIndex + 1);
        } else {
            return url.substring(0, lastSlashIndex + 1) + url.substring(questionMarkIndex);
        }
    }

    private boolean databaseExists(Connection connection, String databaseName) throws SQLException {
        try (Statement statement = connection.createStatement()) {
            statement.executeQuery("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '" + databaseName + "'");
            return statement.getResultSet().next();
        }
    }

    private void createDatabase(Connection connection, String databaseName) throws SQLException {
        try (Statement statement = connection.createStatement()) {
            statement.executeUpdate("CREATE DATABASE IF NOT EXISTS " + databaseName);
        }
    }
}
