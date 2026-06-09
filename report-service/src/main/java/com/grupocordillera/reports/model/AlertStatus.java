package com.grupocordillera.reports.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum AlertStatus {
    CRITICO("Crítico"),
    ADVERTENCIA("Advertencia"),
    INFORMATIVO("Informativo");

    private final String label;

    AlertStatus(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static AlertStatus fromValue(String value) {
        for (AlertStatus s : values()) {
            if (s.label.equals(value) || s.name().equals(value)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Estado de alerta desconocido: " + value);
    }
}
