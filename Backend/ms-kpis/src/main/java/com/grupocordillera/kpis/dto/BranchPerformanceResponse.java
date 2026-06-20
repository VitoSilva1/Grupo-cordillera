package com.grupocordillera.kpis.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record BranchPerformanceResponse(String branch, @JsonProperty("desempeño") int performance) {
}
