package com.grupocordillera.reports.controller;

import com.grupocordillera.reports.repository.KpiRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Expone los datos KPI almacenados en reports_db.
 * kpis-service actúa como proxy hacia estos endpoints.
 */
@RestController
@RequestMapping("/api/kpis")
public class KpiController {

    private final KpiRepository kpiRepository;

    public KpiController(KpiRepository kpiRepository) {
        this.kpiRepository = kpiRepository;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "report-service/kpis");
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(kpiRepository.getSummaryMap());
    }

    @GetMapping("/sales/monthly")
    public ResponseEntity<List<Map<String, Object>>> getMonthlySales() {
        return ResponseEntity.ok(kpiRepository.getMonthlySales());
    }

    @GetMapping("/branches/performance")
    public ResponseEntity<List<Map<String, Object>>> getBranchPerformance() {
        return ResponseEntity.ok(kpiRepository.getBranchPerformance());
    }

    @GetMapping("/channels")
    public ResponseEntity<List<Map<String, Object>>> getSalesChannels() {
        return ResponseEntity.ok(kpiRepository.getSalesChannels());
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<Map<String, Object>>> getAlerts() {
        return ResponseEntity.ok(kpiRepository.getAlerts());
    }
}
