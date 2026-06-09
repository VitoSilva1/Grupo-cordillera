package com.grupocordillera.kpis.repository;

import com.grupocordillera.kpis.dto.KpiSummaryResponse;
import com.grupocordillera.kpis.service.KpiQueryService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestClient;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;

/**
 * Pruebas de integración ligera para KpiQueryService.
 * InMemoryKpiRepository fue eliminado; kpis-service es ahora un proxy HTTP.
 */
@ExtendWith(MockitoExtension.class)
class KpiQueryServiceProxyTest {

    @Mock RestClient restClient;
    @Mock RestClient.RequestHeadersUriSpec<?> headersSpec;
    @Mock RestClient.ResponseSpec responseSpec;

    @Test
    @SuppressWarnings("unchecked")
    void getSummaryShouldMapAllFieldsFromRemoteResponse() {
        Map<String, Object> raw = Map.of(
                "ventasTotales",       145000000,
                "margenUtilidad",      32.5,
                "stockCritico",        18,
                "reclamosActivos",     5,
                "ticketPromedio",      45000,
                "satisfaccionCliente", 94
        );

        doReturn(headersSpec).when(restClient).get();
        doReturn(headersSpec).when(headersSpec).uri(anyString());
        doReturn(responseSpec).when(headersSpec).retrieve();
        doReturn(raw).when(responseSpec).body(any(Class.class));

        KpiQueryService service = new KpiQueryService(restClient);
        KpiSummaryResponse result = service.getSummary();

        assertNotNull(result);
        assertEquals(145000000L, result.ventasTotales());
        assertEquals(32.5,       result.margenUtilidad());
        assertEquals(18,         result.stockCritico());
        assertEquals(5,          result.reclamosActivos());
        assertEquals(45000L,     result.ticketPromedio());
        assertEquals(94,         result.satisfaccionCliente());
    }
}
