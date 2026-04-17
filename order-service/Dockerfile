FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /build

COPY pom.xml .
COPY src ./src

RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app

# The service is sensitive to DB startup/DNS races in compose, so wait for the
# MySQL endpoint before launching Spring.
RUN apt-get update \
    && apt-get install -y --no-install-recommends netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /build/target/*.jar app.jar

EXPOSE 8083
EXPOSE 5007

ENTRYPOINT ["sh", "-c", "until nc -z order-db 3306; do echo 'Waiting for order-db...'; sleep 2; done; exec java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5007 -jar app.jar"]
