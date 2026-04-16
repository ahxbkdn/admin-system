FROM openjdk:11-jre-slim

WORKDIR /app

COPY target/microservice-banner-1.0.0.jar /app/

EXPOSE 8086

CMD ["java", "-jar", "microservice-banner-1.0.0.jar"]
