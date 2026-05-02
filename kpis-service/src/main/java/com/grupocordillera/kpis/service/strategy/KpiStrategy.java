package com.grupocordillera.kpis.service.strategy;

import com.grupocordillera.kpis.model.KpiType;

public interface KpiStrategy<T> {

    KpiType supports();

    T execute();
}
