package com.grupocordillera.kpis.dto;

public record KpiSummaryResponse(
        long ventasTotales,
        double margenUtilidad,
        int stockCritico,
        int reclamosActivos,
        long ticketPromedio,
        int satisfaccionCliente
) {
}
