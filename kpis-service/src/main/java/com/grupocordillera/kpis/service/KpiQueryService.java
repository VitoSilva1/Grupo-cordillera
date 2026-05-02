package com.grupocordillera.kpis.service;

import com.grupocordillera.kpis.dto.AlertResponse;
import com.grupocordillera.kpis.dto.BranchPerformanceResponse;
import com.grupocordillera.kpis.dto.KpiSummaryResponse;
import com.grupocordillera.kpis.dto.MonthlySalesResponse;
import com.grupocordillera.kpis.dto.SalesChannelResponse;
import com.grupocordillera.kpis.model.KpiType;
import com.grupocordillera.kpis.service.factory.KpiStrategyFactory;
import com.grupocordillera.kpis.service.strategy.KpiStrategy;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KpiQueryService {

    private final KpiStrategyFactory strategyFactory;

    public KpiQueryService(KpiStrategyFactory strategyFactory) {
        this.strategyFactory = strategyFactory;
    }

    public KpiSummaryResponse getSummary() {
        return executeTyped(KpiType.SUMMARY);
    }

    public List<MonthlySalesResponse> getMonthlySales() {
        return executeTyped(KpiType.MONTHLY_SALES);
    }

    public List<BranchPerformanceResponse> getBranchPerformance() {
        return executeTyped(KpiType.BRANCH_PERFORMANCE);
    }

    public List<SalesChannelResponse> getSalesChannels() {
        return executeTyped(KpiType.SALES_CHANNELS);
    }

    public List<AlertResponse> getAlerts() {
        return executeTyped(KpiType.ALERTS);
    }

    public Object getByType(KpiType type) {
        return strategyFactory.getStrategy(type).execute();
    }

    @SuppressWarnings("unchecked")
    private <T> T executeTyped(KpiType type) {
        KpiStrategy<?> strategy = strategyFactory.getStrategy(type);
        return (T) strategy.execute();
    }
}
