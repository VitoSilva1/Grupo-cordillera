package com.grupocordillera.kpis.controller;

import com.grupocordillera.kpis.dto.AlertResponse;
import com.grupocordillera.kpis.dto.KpiSummaryResponse;
import com.grupocordillera.kpis.model.KpiType;
import com.grupocordillera.kpis.service.factory.KpiStrategyFactory;
import com.grupocordillera.kpis.service.KpiQueryService;
import com.grupocordillera.kpis.service.strategy.KpiStrategy;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;

class KpiControllerTest {

    @Test
    void healthShouldReturnServiceUp() {
        KpiController controller = new KpiController(buildService(new KpiSummaryResponse(0L, 0, 0, 0, 0L, 0), List.of()));
        Map<String, String> response = controller.health();

        org.junit.jupiter.api.Assertions.assertEquals("UP", response.get("status"));
        org.junit.jupiter.api.Assertions.assertEquals("kpis-service", response.get("service"));
    }

    @Test
    void getSummaryShouldReturnKpiSummary() {
        KpiSummaryResponse summary = new KpiSummaryResponse(145000000L, 32.5, 18, 5, 45000L, 94);
        KpiController controller = new KpiController(buildService(summary, List.of()));
        var response = controller.getSummary();

        org.junit.jupiter.api.Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
        org.junit.jupiter.api.Assertions.assertEquals(145000000L, response.getBody().totalSales());
        org.junit.jupiter.api.Assertions.assertEquals(32.5, response.getBody().profitMargin());
    }

    @Test
    void getAlertsShouldReturnAlertList() {
        AlertResponse alert = new AlertResponse("1", "Stock Crítico", null, "2026-04-27", "Detalle");
        KpiController controller = new KpiController(buildService(new KpiSummaryResponse(0L, 0, 0, 0, 0L, 0), List.of(alert)));
        var response = controller.getAlerts();

        org.junit.jupiter.api.Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
        org.junit.jupiter.api.Assertions.assertEquals("1", response.getBody().get(0).id());
    }

    private KpiQueryService buildService(KpiSummaryResponse summary, List<AlertResponse> alerts) {
        KpiStrategy<?> summaryStrategy = new KpiStrategy<>() {
            @Override
            public KpiType supports() {
                return KpiType.SUMMARY;
            }

            @Override
            public KpiSummaryResponse execute() {
                return summary;
            }
        };
        KpiStrategy<?> alertsStrategy = new KpiStrategy<>() {
            @Override
            public KpiType supports() {
                return KpiType.ALERTS;
            }

            @Override
            public List<AlertResponse> execute() {
                return alerts;
            }
        };
        KpiStrategyFactory factory = new KpiStrategyFactory(List.of(summaryStrategy, alertsStrategy));
        return new KpiQueryService(factory);
    }
}
