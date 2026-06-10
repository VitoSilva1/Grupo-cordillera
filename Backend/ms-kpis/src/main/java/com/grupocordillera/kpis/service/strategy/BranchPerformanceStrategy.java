package com.grupocordillera.kpis.service.strategy;

import com.grupocordillera.kpis.dto.BranchPerformanceResponse;
import com.grupocordillera.kpis.model.KpiType;
import com.grupocordillera.kpis.repository.InMemoryKpiRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BranchPerformanceStrategy implements KpiStrategy<List<BranchPerformanceResponse>> {

    private final InMemoryKpiRepository repository;

    public BranchPerformanceStrategy(InMemoryKpiRepository repository) {
        this.repository = repository;
    }

    @Override
    public KpiType supports() {
        return KpiType.BRANCH_PERFORMANCE;
    }

    @Override
    public List<BranchPerformanceResponse> execute() {
        return repository.getBranchPerformance();
    }
}
