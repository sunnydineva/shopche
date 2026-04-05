FROM eclipse-temurin:17-jre
WORKDIR /app

# Expect a locally built jar under target/
COPY target/*.jar app.jar

EXPOSE 8083
EXPOSE 5007

ENTRYPOINT ["java", "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5007", "-jar", "app.jar"]
