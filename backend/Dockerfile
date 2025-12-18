FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
# Enable debug logging during build
RUN mvn package -DskipTests -X

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# Copy source code for better debugging
COPY --from=build /app/src /app/src
# Expose ports for the application and remote debugging
EXPOSE 8080 5005
# Add JVM debug options and configure logging
ENTRYPOINT ["java", "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005", "-Dlogging.level.root=DEBUG", "-Dlogging.level.com.shop=DEBUG", "-jar", "app.jar"]
