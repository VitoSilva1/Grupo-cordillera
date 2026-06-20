package com.grupocordillera.kpis.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record KpiSummaryResponse(
        @JsonProperty("ventasTotales") long totalSales,
        @JsonProperty("margenUtilidad") double profitMargin,
        @JsonProperty("stockCritico") int criticalStock,
        @JsonProperty("reclamosActivos") int activeClaims,
        @JsonProperty("ticketPromedio") long averageTicket,
        @JsonProperty("satisfaccionCliente") int customerSatisfaction
) {
}
