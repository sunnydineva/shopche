FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /build

COPY pom.xml .
COPY src ./src

RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /build/target/*.jar app.jar

EXPOSE 8082 5006

ENTRYPOINT ["java", "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5006", "-Dlogging.level.root=INFO", "-Dlogging.level.com.shop=INFO", "-jar", "app.jar"]

ENV TZ=UTC
