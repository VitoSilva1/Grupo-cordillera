package com.grupocordillera.kpis.service.strategy;

import com.grupocordillera.kpis.dto.SalesChannelResponse;
import com.grupocordillera.kpis.model.KpiType;
import com.grupocordillera.kpis.repository.InMemoryKpiRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SalesChannelStrategy implements KpiStrategy<List<SalesChannelResponse>> {

    private final InMemoryKpiRepository repository;

    public SalesChannelStrategy(InMemoryKpiRepository repository) {
        this.repository = repository;
    }

    @Override
    public KpiType supports() {
        return KpiType.SALES_CHANNELS;
    }

    @Override
    public List<SalesChannelResponse> execute() {
        return repository.getSalesChannels();
    }
}
