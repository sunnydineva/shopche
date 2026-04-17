FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /build

COPY pom.xml .
COPY src ./src

RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /build/target/*.jar app.jar

EXPOSE 8080 5005

ENTRYPOINT ["java", "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005", "-Dlogging.level.root=DEBUG", "-Dlogging.level.com.shop=DEBUG", "-jar", "app.jar"]

ENV TZ=UTC
