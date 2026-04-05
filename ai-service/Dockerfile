FROM eclipse-temurin:17-jre
WORKDIR /app

# Expect a locally built jar under target/
COPY target/*.jar app.jar

EXPOSE 8081
EXPOSE 5008

ENTRYPOINT ["java", "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5008", "-jar", "app.jar"]
