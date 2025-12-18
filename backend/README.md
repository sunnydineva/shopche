cd ..# Backend Application

## Running Locally

To run the application locally, you need to have the Docker containers running first, as the application is configured to connect to the MySQL database running in Docker.

### Prerequisites

1. Docker and Docker Compose installed
2. Java 17 or later installed

### Steps to Run Locally

1. Start the Docker containers:
   ```bash
   docker compose up -d
   ```

2. Run the Spring Boot application:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

## Database Configuration

The application is configured to connect to the MySQL database running in Docker with the following settings:

- URL: jdbc:mysql://localhost:3307/online_shop
- Username: shop_user
- Password: shop_password

These settings match the configuration in the `docker-compose.yml` file, where the MySQL container exposes port 3307 on the host machine.

## Troubleshooting

If you encounter database connection issues, make sure:

1. The Docker containers are running:
   ```bash
   docker compose ps
   ```

2. The MySQL container is healthy:
   ```bash
   docker compose logs db
   ```

3. You can connect to the MySQL database using a client:
   ```bash
   mysql -h localhost -P 3307 -u shop_user -p
   ```
   When prompted, enter the password: `shop_password`