package com.grupocordillera.kpis.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MonthlySalesResponse(String month, @JsonProperty("ventas") int sales) {
}
