# Database Initialization

This directory contains configuration classes for the Online Shop application, including database initialization.

## DatabaseInitializer

The `DatabaseInitializer` class is responsible for checking if the database exists and creating it if needed. This ensures that the application can start without manual database setup.

### How it works

1. The `DatabaseInitializer` runs during application startup as a `CommandLineRunner` bean.
2. It first checks if the application is running in a Docker environment by looking for "localhost" in the JDBC URL.
   - If not running on localhost (e.g., in Docker), it skips database initialization as the database is expected to be created by the Docker MySQL container.
3. For local development (when running on localhost):
   - It extracts the database name from the JDBC URL in `application.properties`.
   - It creates a connection to MySQL without specifying a database.
   - It checks if the database exists by querying the `INFORMATION_SCHEMA`.
   - If the database doesn't exist, it creates it using the `CREATE DATABASE IF NOT EXISTS` statement.
4. It logs the process for debugging purposes.

### Configuration

The `DatabaseInitializer` uses the following properties from `application.properties`:

- `spring.datasource.url`: The JDBC URL, which includes the database name.
- `spring.datasource.username`: The database username.
- `spring.datasource.password`: The database password.
- `spring.datasource.driver-class-name`: The JDBC driver class name.

### Order of Execution

The `DatabaseInitializer` runs before Flyway migrations, ensuring that the database exists before Flyway attempts to create tables. This is configured in `application.properties` with the `spring.flyway.baseline-version=0` property.

## Usage

No manual configuration is needed. The `DatabaseInitializer` will automatically check for the database and create it if needed when the application starts.
