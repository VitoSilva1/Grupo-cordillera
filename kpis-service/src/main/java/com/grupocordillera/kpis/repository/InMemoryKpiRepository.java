package com.grupocordillera.kpis.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.grupocordillera.kpis.dto.AlertResponse;
import com.grupocordillera.kpis.dto.BranchPerformanceResponse;
import com.grupocordillera.kpis.dto.MonthlySalesResponse;
import com.grupocordillera.kpis.dto.SalesChannelResponse;
import com.grupocordillera.kpis.model.AlertStatus;

@Repository
public class InMemoryKpiRepository {

    public long getVentasTotales() {
        return 20000L;
    }

    public double getMargenUtilidad() {
        return 32.5;
    }

    public int getStockCritico() {
        return 18;
    }

    public int getReclamosActivos() {
        return 5;
    }

    public long getTicketPromedio() {
        return 45000L;
    }

    public int getSatisfaccionCliente() {
        return 94;
    }

    public List<MonthlySalesResponse> getMonthlySales() {
        return List.of(
                new MonthlySalesResponse("Ene", 110),
                new MonthlySalesResponse("Feb", 95),
                new MonthlySalesResponse("Mar", 125),
                new MonthlySalesResponse("Abr", 115),
                new MonthlySalesResponse("May", 140),
                new MonthlySalesResponse("Jun", 145)
        );
    }

    public List<BranchPerformanceResponse> getBranchPerformance() {
        return List.of(
                new BranchPerformanceResponse("Santiago Centro", 98),
                new BranchPerformanceResponse("Providencia", 85),
                new BranchPerformanceResponse("Viña del Mar", 72),
                new BranchPerformanceResponse("Concepción", 65)
        );
    }

    public List<SalesChannelResponse> getSalesChannels() {
        return List.of(
                new SalesChannelResponse("Tiendas Físicas", 65),
                new SalesChannelResponse("E-commerce", 25),
                new SalesChannelResponse("Venta Telefónica", 10)
        );
    }

    public List<AlertResponse> getAlerts() {
        return List.of(
                new AlertResponse(
                        "1",
                        "Stock Crítico",
                        AlertStatus.CRITICO,
                        "2026-04-27",
                        "Quiebre de stock en línea blanca, sucursal Providencia."
                ),
                new AlertResponse(
                        "2",
                        "Reclamos",
                        AlertStatus.ADVERTENCIA,
                        "2026-04-26",
                        "Aumento inusual de reclamos por demoras en despacho."
                ),
                new AlertResponse(
                        "3",
                        "Ventas",
                        AlertStatus.INFORMATIVO,
                        "2026-04-25",
                        "Meta semanal de ventas superada en Santiago Centro."
                )
        );
    }
}
