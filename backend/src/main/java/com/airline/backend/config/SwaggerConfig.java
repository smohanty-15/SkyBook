package com.airline.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI skybookOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SkyBook Airline API")
                        .description("SkyBook Airline Reservation System REST API")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("SkyBook Team")
                                .email("admin@skybook.com")));
    }
}
