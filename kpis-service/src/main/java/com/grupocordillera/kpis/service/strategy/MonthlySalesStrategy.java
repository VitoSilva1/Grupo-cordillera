package com.grupocordillera.kpis.service.strategy;

import com.grupocordillera.kpis.dto.MonthlySalesResponse;
import com.grupocordillera.kpis.model.KpiType;
import com.grupocordillera.kpis.repository.InMemoryKpiRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MonthlySalesStrategy implements KpiStrategy<List<MonthlySalesResponse>> {

    private final InMemoryKpiRepository repository;

    public MonthlySalesStrategy(InMemoryKpiRepository repository) {
        this.repository = repository;
    }

    @Override
    public KpiType supports() {
        return KpiType.MONTHLY_SALES;
    }

    @Override
    public List<MonthlySalesResponse> execute() {
        return repository.getMonthlySales();
    }
}
