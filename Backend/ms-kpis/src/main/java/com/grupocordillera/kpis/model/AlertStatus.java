package com.grupocordillera.kpis.model;

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
}
