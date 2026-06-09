package com.grupocordillera.kpis.service;

import com.grupocordillera.kpis.dto.AlertResponse;
import com.grupocordillera.kpis.dto.BranchPerformanceResponse;
import com.grupocordillera.kpis.dto.KpiSummaryResponse;
import com.grupocordillera.kpis.dto.MonthlySalesResponse;
import com.grupocordillera.kpis.dto.SalesChannelResponse;
import com.grupocordillera.kpis.model.AlertStatus;
import com.grupocordillera.kpis.model.KpiType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/**
 * Proxy HTTP que delega todas las consultas KPI al report-service,
 * el cual es ahora el propietario de los datos KPI.
 */
@Service
public class KpiQueryService {

    private final RestClient restClient;

    @Autowired
    public KpiQueryService(@Value("${report.service.url}") String reportServiceUrl) {
        this(RestClient.builder()
                .baseUrl(reportServiceUrl + "/api/kpis")
                .defaultHeader("Accept", MediaType.APPLICATION_JSON_VALUE)
                .build());
    }

    /** Constructor visible para tests unitarios. */
    public KpiQueryService(RestClient restClient) {
        this.restClient = restClient;
    }

    public KpiSummaryResponse getSummary() {
        @SuppressWarnings("unchecked")
        Map<String, Object> body = restClient.get()
                .uri("/summary")
                .retrieve()
                .body(Map.class);

        if (body == null) throw new IllegalStateException("Respuesta vacía de report-service /kpis/summary");

        return new KpiSummaryResponse(
                toLong(body.get("ventasTotales")),
                toDouble(body.get("margenUtilidad")),
                toInt(body.get("stockCritico")),
                toInt(body.get("reclamosActivos")),
                toLong(body.get("ticketPromedio")),
                toInt(body.get("satisfaccionCliente"))
        );
    }

    public List<MonthlySalesResponse> getMonthlySales() {
        return restClient.get()
                .uri("/sales/monthly")
                .retrieve()
                .body(new ParameterizedTypeReference<List<MonthlySalesResponse>>() {});
    }

    public List<BranchPerformanceResponse> getBranchPerformance() {
        return restClient.get()
                .uri("/branches/performance")
                .retrieve()
                .body(new ParameterizedTypeReference<List<BranchPerformanceResponse>>() {});
    }

    public List<SalesChannelResponse> getSalesChannels() {
        return restClient.get()
                .uri("/channels")
                .retrieve()
                .body(new ParameterizedTypeReference<List<SalesChannelResponse>>() {});
    }

    public List<AlertResponse> getAlerts() {
        return restClient.get()
                .uri("/alerts")
                .retrieve()
                .body(new ParameterizedTypeReference<List<AlertResponse>>() {});
    }

    public Object getByType(KpiType type) {
        return switch (type) {
            case SUMMARY -> getSummary();
            case MONTHLY_SALES -> getMonthlySales();
            case BRANCH_PERFORMANCE -> getBranchPerformance();
            case SALES_CHANNELS -> getSalesChannels();
            case ALERTS -> getAlerts();
        };
    }

    // ─── helpers de conversión para el Map JSON ──────────────────────────────

    private long toLong(Object v) {
        if (v instanceof Number n) return n.longValue();
        return 0L;
    }

    private double toDouble(Object v) {
        if (v instanceof Number n) return n.doubleValue();
        return 0.0;
    }

    private int toInt(Object v) {
        if (v instanceof Number n) return n.intValue();
        return 0;
    }
}

