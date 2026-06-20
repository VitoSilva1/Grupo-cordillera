package com.grupocordillera.report.service;

import com.grupocordillera.report.dto.ReportRequest;
import com.grupocordillera.report.model.Report;
import com.grupocordillera.report.repository.ReportRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ReportServiceTest {

    private ReportService reportService;
    private List<Report> reports;

    @BeforeEach
    void setUp() {
        ReportRepository reportRepository = mock(ReportRepository.class);
        reports = new ArrayList<>();

        when(reportRepository.findAll()).thenAnswer(inv -> new ArrayList<>(reports));
        when(reportRepository.findById(any())).thenAnswer(inv -> reports.stream()
                .filter(report -> report.getId() != null && report.getId().equals(inv.getArgument(0)))
                .findFirst());
        when(reportRepository.save(any(Report.class))).thenAnswer(inv -> {
            Report report = inv.getArgument(0);
            report.setId((long) reports.size() + 1);
            reports.add(report);
            return report;
        });

        reportService = new ReportService(reportRepository);
    }

    @Test
    void createShouldSaveReport() {
        ReportRequest request = new ReportRequest();
        request.setTitle("Ventas mensuales");
        request.setDescription("Reporte de ventas del mes");
        request.setReportType("SALES");
        request.setStatus("generated");

        Report report = reportService.create(request);

        assertEquals("Ventas mensuales", report.getTitle());
        assertEquals("Reporte de ventas del mes", report.getDescription());
        assertEquals("SALES", report.getReportType());
        assertEquals("GENERATED", report.getStatus());
        assertEquals(1, reportService.findAll().size());
    }

    @Test
    void createShouldDefaultStatusToPending() {
        ReportRequest request = new ReportRequest();
        request.setTitle("Stock");
        request.setReportType("INVENTORY");

        Report report = reportService.create(request);

        assertEquals("PENDING", report.getStatus());
    }

    @Test
    void createShouldRejectInvalidStatus() {
        ReportRequest request = new ReportRequest();
        request.setTitle("Inventario");
        request.setReportType("INVENTORY");
        request.setStatus("DONE");

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> reportService.create(request)
        );

        assertEquals("El estado debe ser PENDING, GENERATED o FAILED", exception.getMessage());
    }
}
