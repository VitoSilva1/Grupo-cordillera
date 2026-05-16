package com.grupocordillera.kpis.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.grupocordillera.kpis.dto.AlertResponse;
import com.grupocordillera.kpis.dto.KpiSummaryResponse;
import com.grupocordillera.kpis.dto.MonthlySalesResponse;
import com.grupocordillera.kpis.dto.SalesChannelResponse;
import com.grupocordillera.kpis.service.KpiQueryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(KpiController.class)
class KpiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private KpiQueryService kpiQueryService;

    @Test
    void healthShouldReturnServiceUp() throws Exception {
        mockMvc.perform(get("/api/kpis/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("kpis-service"));
    }

    @Test
    void getSummaryShouldReturnKpiSummary() throws Exception {
        KpiSummaryResponse summary = new KpiSummaryResponse(145000000L, 32.5, 18, 5, 45000L, 94);
        when(kpiQueryService.getSummary()).thenReturn(summary);

        mockMvc.perform(get("/api/kpis/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ventasTotales").value(145000000))
                .andExpect(jsonPath("$.margenUtilidad").value(32.5));
    }

    @Test
    void getAlertsShouldReturnAlertList() throws Exception {
        AlertResponse alert = new AlertResponse("1", "Stock Crítico", null, "2026-04-27", "Detalle");
        when(kpiQueryService.getAlerts()).thenReturn(List.of(alert));

        mockMvc.perform(get("/api/kpis/alerts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"));
    }
}
