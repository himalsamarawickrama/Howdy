# Stage 1: Build the application JAR
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Low-memory runtime for Render free tier
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Limit Java memory so the 512MB RAM free instance doesn't crash
ENV JAVA_TOOL_OPTIONS="-Xms128m -Xmx320m -XX:+UseSerialGC"
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]