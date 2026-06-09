package com.grupocordillera.kpis.controller;

import com.grupocordillera.kpis.dto.AlertResponse;
import com.grupocordillera.kpis.dto.KpiSummaryResponse;
import com.grupocordillera.kpis.model.AlertStatus;
import com.grupocordillera.kpis.service.KpiQueryService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class KpiControllerTest {

    @Mock
    private KpiQueryService kpiQueryService;

    @InjectMocks
    private KpiController controller;

    @Test
    void healthShouldReturnServiceUp() {
        Map<String, String> response = controller.health();
        assertEquals("UP", response.get("status"));
        assertEquals("kpis-service", response.get("service"));
    }

    @Test
    void getSummaryShouldReturnKpiSummary() {
        KpiSummaryResponse summary = new KpiSummaryResponse(145000000L, 32.5, 18, 5, 45000L, 94);
        when(kpiQueryService.getSummary()).thenReturn(summary);

        var response = controller.getSummary();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(145000000L, response.getBody().ventasTotales());
        assertEquals(32.5, response.getBody().margenUtilidad());
    }

    @Test
    void getAlertsShouldReturnAlertList() {
        AlertResponse alert = new AlertResponse("1", "Stock Crítico", AlertStatus.CRITICO, "2026-04-27", "Detalle");
        when(kpiQueryService.getAlerts()).thenReturn(List.of(alert));

        var response = controller.getAlerts();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("1", response.getBody().get(0).id());
    }
}
