package com.grupocordillera.report.service;

import com.grupocordillera.report.dto.ReportRequest;
import com.grupocordillera.report.model.Report;
import com.grupocordillera.report.repository.ReportRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ReportService {

    private static final Set<String> ALLOWED_STATUSES = Set.of("PENDING", "GENERATED", "FAILED");

    private final ReportRepository reportRepository;

    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public Report create(ReportRequest request) {
        validateRequest(request);

        Report report = new Report();
        report.setTitle(request.getTitle().trim());
        report.setDescription(normalizeDescription(request.getDescription()));
        report.setReportType(request.getReportType().trim());
        report.setStatus(resolveStatus(request.getStatus()));

        return reportRepository.save(report);
    }

    public List<Report> findAll() {
        return reportRepository.findAll();
    }

    public Optional<Report> findById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("El id del reporte es obligatorio");
        }
        return reportRepository.findById(id);
    }

    private void validateRequest(ReportRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("El cuerpo de la solicitud es obligatorio");
        }

        validateRequired(request.getTitle(), "El titulo es obligatorio");
        validateRequired(request.getReportType(), "El tipo de reporte es obligatorio");

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            String status = request.getStatus().trim().toUpperCase();
            if (!ALLOWED_STATUSES.contains(status)) {
                throw new IllegalArgumentException("El estado debe ser PENDING, GENERATED o FAILED");
            }
        }
    }

    private void validateRequired(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(message);
        }
    }

    private String normalizeDescription(String description) {
        return description == null ? null : description.trim();
    }

    private String resolveStatus(String status) {
        if (status == null || status.isBlank()) {
            return "PENDING";
        }
        return status.trim().toUpperCase();
    }
}
