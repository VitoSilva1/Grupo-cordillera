package com.grupocordillera.kpis.service.strategy;

import com.grupocordillera.kpis.dto.AlertResponse;
import com.grupocordillera.kpis.model.KpiType;
import com.grupocordillera.kpis.repository.InMemoryKpiRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AlertsStrategy implements KpiStrategy<List<AlertResponse>> {

    private final InMemoryKpiRepository repository;

    public AlertsStrategy(InMemoryKpiRepository repository) {
        this.repository = repository;
    }

    @Override
    public KpiType supports() {
        return KpiType.ALERTS;
    }

    @Override
    public List<AlertResponse> execute() {
        return repository.getAlerts();
    }
}
