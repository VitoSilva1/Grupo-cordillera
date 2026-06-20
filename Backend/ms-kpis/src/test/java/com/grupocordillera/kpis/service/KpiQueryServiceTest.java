package com.grupocordillera.kpis.service;

import com.grupocordillera.kpis.dto.AlertResponse;
import com.grupocordillera.kpis.dto.BranchPerformanceResponse;
import com.grupocordillera.kpis.dto.KpiSummaryResponse;
import com.grupocordillera.kpis.dto.MonthlySalesResponse;
import com.grupocordillera.kpis.dto.SalesChannelResponse;
import com.grupocordillera.kpis.model.KpiType;
import com.grupocordillera.kpis.service.factory.KpiStrategyFactory;
import com.grupocordillera.kpis.service.strategy.KpiStrategy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;

class KpiQueryServiceTest {

    private KpiQueryService queryService;

    @BeforeEach
    void setUp() {
        KpiSummaryResponse summary = new KpiSummaryResponse(145000000L, 32.5, 18, 5, 45000L, 94);
        List<MonthlySalesResponse> monthly = List.of(new MonthlySalesResponse("Ene", 110));
        List<BranchPerformanceResponse> branches = List.of(new BranchPerformanceResponse("Santiago", 98));
        List<SalesChannelResponse> channels = List.of(new SalesChannelResponse("E-commerce", 25));
        List<AlertResponse> alerts = List.of(new AlertResponse("1", "Stock Crítico", null, "2026-04-27", "Detalle"));

        KpiStrategyFactory factory = new KpiStrategyFactory(List.of(
                strategy(KpiType.SUMMARY, summary),
                strategy(KpiType.MONTHLY_SALES, monthly),
                strategy(KpiType.BRANCH_PERFORMANCE, branches),
                strategy(KpiType.SALES_CHANNELS, channels),
                strategy(KpiType.ALERTS, alerts)
        ));

        queryService = new KpiQueryService(factory);
    }

    @Test
    void getSummaryShouldDelegateToSummaryStrategy() {
        KpiSummaryResponse result = queryService.getSummary();
        assertEquals(145000000L, result.totalSales());
    }

    @Test
    void getMonthlySalesShouldReturnMonthlyValues() {
        assertEquals(1, queryService.getMonthlySales().size());
    }

    @Test
    void getBranchPerformanceShouldReturnBranchMetrics() {
        assertEquals("Santiago", queryService.getBranchPerformance().get(0).branch());
    }

    @Test
    void getSalesChannelsShouldReturnChannels() {
        assertEquals("E-commerce", queryService.getSalesChannels().get(0).channel());
    }

    @Test
    void getAlertsShouldReturnAlertList() {
        assertEquals("1", queryService.getAlerts().get(0).id());
    }

    @Test
    void getByTypeShouldReturnStrategyResultForType() {
        Object result = queryService.getByType(KpiType.SALES_CHANNELS);
        assertSame(queryService.getSalesChannels(), result);
    }

    private static <T> KpiStrategy<T> strategy(KpiType type, T response) {
        return new KpiStrategy<>() {
            @Override
            public KpiType supports() {
                return type;
            }

            @Override
            public T execute() {
                return response;
            }
        };
    }
}
