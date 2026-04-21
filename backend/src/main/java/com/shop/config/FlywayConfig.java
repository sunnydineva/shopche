package com.shop.config;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlywayConfig {

    @Bean
    public FlywayMigrationStrategy flywayMigrationStrategy(
            @Value("${FLYWAY_REPAIR_ON_STARTUP:false}") boolean repairOnStartup) {
        return flyway -> {
            if (repairOnStartup) {
                flyway.repair();
            }
            flyway.migrate();
        };
    }
}
