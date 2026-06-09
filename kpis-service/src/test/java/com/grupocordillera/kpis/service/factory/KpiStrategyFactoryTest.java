package com.grupocordillera.kpis.service.factory;

import com.grupocordillera.kpis.model.AlertStatus;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

/**
 * Tests del enum AlertStatus que reemplazó a KpiStrategyFactory
 * en la arquitectura proxy.
 */
class AlertStatusTest {

    @ParameterizedTest
    @CsvSource({
            "Crítico,     CRITICO",
            "Advertencia, ADVERTENCIA",
            "Informativo, INFORMATIVO",
            "CRITICO,     CRITICO",
            "ADVERTENCIA, ADVERTENCIA",
            "INFORMATIVO, INFORMATIVO"
    })
    void fromValueShouldMapLabelToEnum(String label, String expectedName) {
        AlertStatus result = AlertStatus.fromValue(label.trim());
        assertEquals(AlertStatus.valueOf(expectedName), result);
    }

    @Test
    void fromValueShouldThrowOnUnknownLabel() {
        assertThrows(IllegalArgumentException.class, () -> AlertStatus.fromValue("DESCONOCIDO"));
    }

    @Test
    void getLabelShouldReturnReadableSpanishLabel() {
        assertEquals("Crítico",     AlertStatus.CRITICO.getLabel());
        assertEquals("Advertencia", AlertStatus.ADVERTENCIA.getLabel());
        assertEquals("Informativo", AlertStatus.INFORMATIVO.getLabel());
    }
}
