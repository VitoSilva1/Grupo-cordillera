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
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

class KpiQueryServiceTest {

    private KpiQueryService queryService;

    @Mock
    private KpiStrategyFactory strategyFactory;

    @Mock
    private KpiStrategy<KpiSummaryResponse> summaryStrategy;

    @Mock
    private KpiStrategy<List<MonthlySalesResponse>> monthlyStrategy;

    @Mock
    private KpiStrategy<List<BranchPerformanceResponse>> branchStrategy;

    @Mock
    private KpiStrategy<List<SalesChannelResponse>> salesChannelStrategy;

    @Mock
    private KpiStrategy<List<AlertResponse>> alertsStrategy;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        queryService = new KpiQueryService(strategyFactory);
    }

    @Test
    void getSummaryShouldDelegateToSummaryStrategy() {
        KpiSummaryResponse summary = new KpiSummaryResponse(145000000L, 32.5, 18, 5, 45000L, 94);

        when(strategyFactory.getStrategy(eq(KpiType.SUMMARY)))
                .thenReturn((KpiStrategy) summaryStrategy);

        when(summaryStrategy.execute()).thenReturn(summary);

        KpiSummaryResponse result = queryService.getSummary();

        assertSame(summary, result);
    }

    @Test
    void getMonthlySalesShouldReturnMonthlyValues() {
        List<MonthlySalesResponse> monthly = List.of(new MonthlySalesResponse("Ene", 110));

        when(strategyFactory.getStrategy(eq(KpiType.MONTHLY_SALES)))
                .thenReturn((KpiStrategy) monthlyStrategy);

        when(monthlyStrategy.execute()).thenReturn(monthly);

        assertEquals(monthly, queryService.getMonthlySales());
    }

    @Test
    void getBranchPerformanceShouldReturnBranchMetrics() {
        List<BranchPerformanceResponse> branch = List.of(new BranchPerformanceResponse("Santiago", 98));

        when(strategyFactory.getStrategy(eq(KpiType.BRANCH_PERFORMANCE)))
                .thenReturn((KpiStrategy) branchStrategy);

        when(branchStrategy.execute()).thenReturn(branch);

        assertEquals(branch, queryService.getBranchPerformance());
    }

    @Test
    void getSalesChannelsShouldReturnChannels() {
        List<SalesChannelResponse> channels = List.of(new SalesChannelResponse("E-commerce", 25));

        when(strategyFactory.getStrategy(eq(KpiType.SALES_CHANNELS)))
                .thenReturn((KpiStrategy) salesChannelStrategy);

        when(salesChannelStrategy.execute()).thenReturn(channels);

        assertEquals(channels, queryService.getSalesChannels());
    }

    @Test
    void getAlertsShouldReturnAlertList() {
        List<AlertResponse> alerts = List.of(new AlertResponse(
                "1",
                "Stock Crítico",
                null,
                "2026-04-27",
                "Detalle"));

        when(strategyFactory.getStrategy(eq(KpiType.ALERTS)))
                .thenReturn((KpiStrategy) alertsStrategy);

        when(alertsStrategy.execute()).thenReturn(alerts);

        assertEquals(alerts, queryService.getAlerts());
    }

    @Test
    void getByTypeShouldReturnStrategyResultForType() {

        List<SalesChannelResponse> result = List.of(new SalesChannelResponse("Tiendas Físicas", 65));

        when(strategyFactory.getStrategy(eq(KpiType.SALES_CHANNELS)))
                .thenReturn((KpiStrategy) salesChannelStrategy);

        when(salesChannelStrategy.execute()).thenReturn(result);

        assertSame(result, queryService.getByType(KpiType.SALES_CHANNELS));
    }
}