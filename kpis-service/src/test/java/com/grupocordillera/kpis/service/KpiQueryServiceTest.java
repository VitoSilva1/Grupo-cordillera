package com.grupocordillera.kpis.service;

import com.grupocordillera.kpis.dto.AlertResponse;
import com.grupocordillera.kpis.dto.BranchPerformanceResponse;
import com.grupocordillera.kpis.dto.KpiSummaryResponse;
import com.grupocordillera.kpis.dto.MonthlySalesResponse;
import com.grupocordillera.kpis.dto.SalesChannelResponse;
import com.grupocordillera.kpis.model.AlertStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;

@ExtendWith(MockitoExtension.class)
class KpiQueryServiceTest {

    @Mock RestClient restClient;
    @Mock RestClient.RequestHeadersUriSpec<?> headersSpec;
    @Mock RestClient.ResponseSpec responseSpec;

    private KpiQueryService queryService;

    @BeforeEach
    void setUp() {
        queryService = new KpiQueryService(restClient);
        doReturn(headersSpec).when(restClient).get();
        doReturn(headersSpec).when(headersSpec).uri(anyString());
        doReturn(responseSpec).when(headersSpec).retrieve();
    }

    @Test
    @SuppressWarnings("unchecked")
    void getSummaryShouldReturnMappedResponse() {
        Map<String, Object> raw = Map.of(
                "ventasTotales", 145000000,
                "margenUtilidad", 32.5,
                "stockCritico", 18,
                "reclamosActivos", 5,
                "ticketPromedio", 45000,
                "satisfaccionCliente", 94
        );
        doReturn(raw).when(responseSpec).body(any(Class.class));

        KpiSummaryResponse result = queryService.getSummary();

        assertNotNull(result);
        assertEquals(145000000L, result.ventasTotales());
        assertEquals(32.5, result.margenUtilidad());
    }

    @Test
    @SuppressWarnings("unchecked")
    void getMonthlySalesShouldReturnList() {
        List<MonthlySalesResponse> data = List.of(
                new MonthlySalesResponse("Ene", 110),
                new MonthlySalesResponse("Feb", 120)
        );
        doReturn(data).when(responseSpec).body(any(ParameterizedTypeReference.class));

        List<MonthlySalesResponse> result = queryService.getMonthlySales();

        assertEquals(2, result.size());
        assertEquals("Ene", result.get(0).month());
    }

    @Test
    @SuppressWarnings("unchecked")
    void getBranchPerformanceShouldReturnList() {
        List<BranchPerformanceResponse> data = List.of(
                new BranchPerformanceResponse("Santiago", 95)
        );
        doReturn(data).when(responseSpec).body(any(ParameterizedTypeReference.class));

        List<BranchPerformanceResponse> result = queryService.getBranchPerformance();

        assertEquals(1, result.size());
        assertEquals("Santiago", result.get(0).branch());
    }

    @Test
    @SuppressWarnings("unchecked")
    void getAlertsShouldReturnList() {
        List<AlertResponse> data = List.of(
                new AlertResponse("1", "Stock Crítico", AlertStatus.CRITICO, "2026-04-27", "Detalle")
        );
        doReturn(data).when(responseSpec).body(any(ParameterizedTypeReference.class));

        List<AlertResponse> result = queryService.getAlerts();

        assertEquals(1, result.size());
        assertEquals(AlertStatus.CRITICO, result.get(0).status());
    }
}
