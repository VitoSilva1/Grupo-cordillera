package com.grupocordillera.kpis.dto;

import com.grupocordillera.kpis.model.AlertStatus;

public record AlertResponse(
        String id,
        String kpi,
        AlertStatus status,
        String date,
        String description
) {
}
