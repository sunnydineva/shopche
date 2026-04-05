FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Expect a locally built jar under target/
COPY target/*.jar app.jar
# Expose ports for the application and remote debugging
EXPOSE 8080 5005
# Add JVM debug options and configure logging
ENTRYPOINT ["java", "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005", "-Dlogging.level.root=DEBUG", "-Dlogging.level.com.shop=DEBUG", "-jar", "app.jar"]

ENV TZ=UTC
