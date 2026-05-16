package com.grupocordillera.kpis.repository;

import com.grupocordillera.kpis.dto.AlertResponse;
import com.grupocordillera.kpis.dto.BranchPerformanceResponse;
import com.grupocordillera.kpis.dto.MonthlySalesResponse;
import com.grupocordillera.kpis.dto.SalesChannelResponse;
import com.grupocordillera.kpis.model.AlertStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class InMemoryKpiRepositoryTest {

    private InMemoryKpiRepository repository;

    @BeforeEach
    void setUp() {
        JdbcTemplate jdbcTemplate = new JdbcTemplate() {
            @Override
            public <T> T queryForObject(String sql, Class<T> requiredType) {
                if (sql.contains("ventas_totales")) return requiredType.cast(145000000L);
                if (sql.contains("margen_utilidad")) return requiredType.cast(32.5);
                if (sql.contains("stock_critico")) return requiredType.cast(18);
                if (sql.contains("reclamos_activos")) return requiredType.cast(5);
                if (sql.contains("ticket_promedio")) return requiredType.cast(45000L);
                if (sql.contains("satisfaccion_cliente")) return requiredType.cast(94);
                throw new IllegalArgumentException("SQL no soportado en test: " + sql);
            }

            @Override
            public <T> List<T> query(String sql, RowMapper<T> rowMapper) {
                if (sql.contains("monthly_sales")) {
                    return List.of(
                            (T) new MonthlySalesResponse("Ene", 110),
                            (T) new MonthlySalesResponse("Feb", 120),
                            (T) new MonthlySalesResponse("Mar", 130),
                            (T) new MonthlySalesResponse("Abr", 125),
                            (T) new MonthlySalesResponse("May", 140),
                            (T) new MonthlySalesResponse("Jun", 150)
                    );
                }
                if (sql.contains("branch_performance")) {
                    return List.of(
                            (T) new BranchPerformanceResponse("Las Condes", 95),
                            (T) new BranchPerformanceResponse("Providencia", 90),
                            (T) new BranchPerformanceResponse("Santiago Centro", 88),
                            (T) new BranchPerformanceResponse("Maipu", 85)
                    );
                }
                if (sql.contains("sales_channels")) {
                    return List.of(
                            (T) new SalesChannelResponse("Tiendas Fisicas", 65),
                            (T) new SalesChannelResponse("E-commerce", 25),
                            (T) new SalesChannelResponse("Marketplaces", 10)
                    );
                }
                if (sql.contains("FROM alerts")) {
                    return List.of(
                            (T) new AlertResponse("1", "Stock Crítico", AlertStatus.CRITICO, "2026-04-27", "Detalle 1"),
                            (T) new AlertResponse("2", "Margen Bajo", AlertStatus.ADVERTENCIA, "2026-04-26", "Detalle 2"),
                            (T) new AlertResponse("3", "Reclamos", AlertStatus.INFORMATIVO, "2026-04-25", "Detalle 3")
                    );
                }
                throw new IllegalArgumentException("SQL no soportado en test: " + sql);
            }
        };

        repository = new InMemoryKpiRepository(jdbcTemplate);
    }

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
