FROM openjdk:8-jdk-slim

WORKDIR /app

COPY target/ai-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8081
EXPOSE 5008

ENTRYPOINT ["java", "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5008", "-jar", "app.jar"]
