package com.grupocordillera.kpis.service.factory;

import com.grupocordillera.kpis.model.KpiType;
import com.grupocordillera.kpis.service.strategy.KpiStrategy;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class KpiStrategyFactoryTest {

    @Test
    void getStrategyShouldReturnRegisteredStrategyByType() {
        @SuppressWarnings("unchecked")
        KpiStrategy<?> summaryStrategy = mock(KpiStrategy.class);
        when(summaryStrategy.supports()).thenReturn(KpiType.SUMMARY);

        KpiStrategyFactory factory = new KpiStrategyFactory(List.of(summaryStrategy));

        assertEquals(summaryStrategy, factory.getStrategy(KpiType.SUMMARY));
    }

    @Test
    void getStrategyShouldThrowWhenTypeNotRegistered() {
        @SuppressWarnings("unchecked")
        KpiStrategy<?> summaryStrategy = mock(KpiStrategy.class);
        when(summaryStrategy.supports()).thenReturn(KpiType.SUMMARY);

        KpiStrategyFactory factory = new KpiStrategyFactory(List.of(summaryStrategy));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> factory.getStrategy(KpiType.ALERTS));

        assertEquals("No existe una estrategia para el KPI solicitado: " + KpiType.ALERTS, exception.getMessage());
    }
}
