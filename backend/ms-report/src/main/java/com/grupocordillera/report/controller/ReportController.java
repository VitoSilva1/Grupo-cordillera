package com.grupocordillera.report.controller;

import com.grupocordillera.report.dto.ReportRequest;
import com.grupocordillera.report.dto.ReportResponse;
import com.grupocordillera.report.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "report-service");
    }

    @PostMapping
    public ResponseEntity<ReportResponse> create(@Valid @RequestBody ReportRequest request) {
        ReportResponse response = ReportResponse.from(reportService.create(request));
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ReportResponse>> findAll() {
        List<ReportResponse> reports = reportService.findAll()
                .stream()
                .map(ReportResponse::from)
                .toList();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return reportService.findById(id)
                .map(ReportResponse::from)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404)
                        .body(Map.of("error", "Reporte no encontrado")));
    }
}
