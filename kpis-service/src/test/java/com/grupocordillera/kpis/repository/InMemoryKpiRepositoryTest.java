package com.grupocordillera.kpis.repository;

import com.grupocordillera.kpis.dto.AlertResponse;
import com.grupocordillera.kpis.dto.BranchPerformanceResponse;
import com.grupocordillera.kpis.dto.MonthlySalesResponse;
import com.grupocordillera.kpis.dto.SalesChannelResponse;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class InMemoryKpiRepositoryTest {

    private final InMemoryKpiRepository repository = new InMemoryKpiRepository();

    @Test
    void repositoryShouldExposeSummaryValues() {
        assertEquals(145000000L, repository.getVentasTotales());
        assertEquals(32.5, repository.getMargenUtilidad());
        assertEquals(18, repository.getStockCritico());
        assertEquals(5, repository.getReclamosActivos());
        assertEquals(45000L, repository.getTicketPromedio());
        assertEquals(94, repository.getSatisfaccionCliente());
    }

    @Test
    void repositoryShouldReturnMonthlySalesList() {
        List<MonthlySalesResponse> list = repository.getMonthlySales();
        assertEquals(6, list.size());
        assertEquals("Ene", list.get(0).month());
    }

    @Test
    void repositoryShouldReturnBranchPerformanceList() {
        List<BranchPerformanceResponse> list = repository.getBranchPerformance();
        assertEquals(4, list.size());
        assertEquals("Providencia", list.get(1).branch());
    }

    @Test
    void repositoryShouldReturnSalesChannelsList() {
        List<SalesChannelResponse> list = repository.getSalesChannels();
        assertEquals(3, list.size());
        assertEquals("E-commerce", list.get(1).channel());
    }

    @Test
    void repositoryShouldReturnAlertsList() {
        List<AlertResponse> list = repository.getAlerts();
        assertEquals(3, list.size());
        assertEquals("Stock Crítico", list.get(0).kpi());
    }
}
