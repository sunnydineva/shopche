FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Expect a locally built jar under target/
COPY target/*.jar app.jar
# Expose ports for the application and remote debugging
EXPOSE 8082 5006
# Add JVM debug options and configure logging
ENTRYPOINT ["java", "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5006", "-Dlogging.level.root=INFO", "-Dlogging.level.com.shop=INFO", "-jar", "app.jar"]

ENV TZ=UTC
