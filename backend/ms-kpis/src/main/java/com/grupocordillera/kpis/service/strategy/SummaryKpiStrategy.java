package com.grupocordillera.kpis.service.strategy;

import com.grupocordillera.kpis.dto.KpiSummaryResponse;
import com.grupocordillera.kpis.model.KpiType;
import com.grupocordillera.kpis.repository.InMemoryKpiRepository;
import org.springframework.stereotype.Component;

@Component
public class SummaryKpiStrategy implements KpiStrategy<KpiSummaryResponse> {

    private final InMemoryKpiRepository repository;

    public SummaryKpiStrategy(InMemoryKpiRepository repository) {
        this.repository = repository;
    }

    @Override
    public KpiType supports() {
        return KpiType.SUMMARY;
    }

    @Override
    public KpiSummaryResponse execute() {
        return new KpiSummaryResponse(
                repository.getTotalSales(),
                repository.getProfitMargin(),
                repository.getCriticalStock(),
                repository.getActiveClaims(),
                repository.getAverageTicket(),
                repository.getCustomerSatisfaction()
        );
    }
}
