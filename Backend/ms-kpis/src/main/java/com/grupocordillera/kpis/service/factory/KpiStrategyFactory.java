package com.grupocordillera.kpis.service.factory;

import com.grupocordillera.kpis.model.KpiType;
import com.grupocordillera.kpis.service.strategy.KpiStrategy;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Component
public class KpiStrategyFactory {

    private final Map<KpiType, KpiStrategy<?>> strategies = new EnumMap<>(KpiType.class);

    public KpiStrategyFactory(List<KpiStrategy<?>> strategyList) {
        for (KpiStrategy<?> strategy : strategyList) {
            strategies.put(strategy.supports(), strategy);
        }
    }

    public KpiStrategy<?> getStrategy(KpiType type) {
        KpiStrategy<?> strategy = strategies.get(type);
        if (strategy == null) {
            throw new IllegalArgumentException("No existe una estrategia para el KPI solicitado: " + type);
        }
        return strategy;
    }
}
