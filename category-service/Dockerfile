FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/category-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8083
EXPOSE 5007

ENTRYPOINT ["java", "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5007", "-jar", "app.jar"]