# =========================
# Build stage (Maven)
# =========================
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn -q dependency:go-offline

COPY src ./src
RUN mvn -q clean package -DskipTests

# =========================
# Run stage (JRE)
# =========================
FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/target/*-SNAPSHOT.jar app.jar

EXPOSE 8081
EXPOSE 5008

ENTRYPOINT ["java", "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5008", "-jar", "app.jar"]