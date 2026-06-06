package com.grupocordillera.reports.controller;

import com.grupocordillera.reports.dto.CreateReportRequest;
import com.grupocordillera.reports.dto.ReportJobResponse;
import com.grupocordillera.reports.service.ReportService;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
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
    public ResponseEntity<ReportJobResponse> createReport(@RequestBody CreateReportRequest request) {
        return ResponseEntity.status(201).body(reportService.createReport(request));
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<ReportJobResponse> getReport(@PathVariable Long reportId) {
        return ResponseEntity.ok(reportService.getReportJob(reportId));
    }

    @GetMapping("/{reportId}/download")
    public ResponseEntity<String> download(@PathVariable Long reportId) {
        ReportService.DownloadableReport report = reportService.getReportContent(reportId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(report.contentType()));
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename(report.fileName(), StandardCharsets.UTF_8)
                .build());

        return ResponseEntity.ok()
                .headers(headers)
                .body(report.content());
    }
}
