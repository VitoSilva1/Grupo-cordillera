package com.grupocordillera.reports.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Component
public class KpiClient {

    private final RestClient restClient;

    public KpiClient(@Value("${kpis.api.base-url}") String kpisApiBaseUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(kpisApiBaseUrl)
                .defaultHeader("Accept", MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getSummary() {
        Map<String, Object> payload = restClient.get()
                .uri("/summary")
                .retrieve()
                .body(Map.class);

        if (payload == null) {
            throw new IllegalStateException("Respuesta vacía de kpis-service /summary");
        }

        return payload;
    }
}
