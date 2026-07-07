package com.grupocordillera.kpis.controller;

import com.grupocordillera.kpis.dto.AlertResponse;
import com.grupocordillera.kpis.dto.BranchPerformanceResponse;
import com.grupocordillera.kpis.dto.KpiSummaryResponse;
import com.grupocordillera.kpis.dto.MonthlySalesResponse;
import com.grupocordillera.kpis.dto.SalesChannelResponse;
import com.grupocordillera.kpis.model.KpiType;
import com.grupocordillera.kpis.service.KpiQueryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/kpis")
public class KpiController {

    private final KpiQueryService kpiQueryService;

    public KpiController(KpiQueryService kpiQueryService) {
        this.kpiQueryService = kpiQueryService;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "kpis-service");
    }

    @GetMapping("/summary")
    public ResponseEntity<KpiSummaryResponse> getSummary() {
        return ResponseEntity.ok(kpiQueryService.getSummary());
    }

    @GetMapping("/sales/monthly")
    public ResponseEntity<List<MonthlySalesResponse>> getMonthlySales() {
        return ResponseEntity.ok(kpiQueryService.getMonthlySales());
    }

    @GetMapping("/branches/performance")
    public ResponseEntity<List<BranchPerformanceResponse>> getBranchPerformance() {
        return ResponseEntity.ok(kpiQueryService.getBranchPerformance());
    }

    @GetMapping("/channels")
    public ResponseEntity<List<SalesChannelResponse>> getSalesChannels() {
        return ResponseEntity.ok(kpiQueryService.getSalesChannels());
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<AlertResponse>> getAlerts() {
        return ResponseEntity.ok(kpiQueryService.getAlerts());
    }

    @GetMapping("/{type}")
    public ResponseEntity<Object> getByType(@PathVariable KpiType type) {
        return ResponseEntity.ok(kpiQueryService.getByType(type));
    }
}
