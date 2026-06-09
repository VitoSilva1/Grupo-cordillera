package com.grupocordillera.reports.service;

import com.grupocordillera.reports.dto.CreateReportRequest;
import com.grupocordillera.reports.dto.ReportJobResponse;
import com.grupocordillera.reports.model.ReportFormat;
import com.grupocordillera.reports.model.ReportJob;
import com.grupocordillera.reports.repository.KpiRepository;
import com.grupocordillera.reports.repository.ReportJobRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Service
public class ReportService {

    private final ReportJobRepository reportJobRepository;
    private final KpiRepository kpiRepository;

    public ReportService(ReportJobRepository reportJobRepository, KpiRepository kpiRepository) {
        this.reportJobRepository = reportJobRepository;
        this.kpiRepository = kpiRepository;
    }

    public ReportJobResponse createReport(CreateReportRequest request) {
        validate(request);

        ReportJob createdJob = reportJobRepository.create(request.type(), request.dateFrom(), request.dateTo(), request.format());

        try {
            String csvContent = buildSummaryCsv(kpiRepository.getSummaryMap());
            String fileName = "report-" + createdJob.id() + ".csv";
            reportJobRepository.markReady(createdJob.id(), fileName, csvContent);
        } catch (Exception ex) {
            reportJobRepository.markFailed(createdJob.id(), ex.getMessage());
        }

        return toResponse(requireJob(createdJob.id()));
    }

    public ReportJobResponse getReportJob(Long reportId) {
        return toResponse(requireJob(reportId));
    }

    public DownloadableReport getReportContent(Long reportId) {
        ReportJob job = requireJob(reportId);

        if (job.status() != com.grupocordillera.reports.model.ReportStatus.READY) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El reporte aún no está listo para descarga");
        }

        if (job.generatedContent() == null || job.generatedContent().isBlank()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "El contenido del reporte está vacío");
        }

        return new DownloadableReport(job.generatedFileName(), "text/csv", job.generatedContent());
    }

    private ReportJob requireJob(Long reportId) {
        return reportJobRepository.findById(reportId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reporte no encontrado"));
    }

    private void validate(CreateReportRequest request) {
        if (request == null || request.type() == null || request.format() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "type y format son obligatorios");
        }

        if (request.format() != ReportFormat.CSV) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Solo se soporta format=CSV en este MVP");
        }

        if (request.dateFrom() != null && request.dateTo() != null && request.dateFrom().isAfter(request.dateTo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "dateFrom no puede ser mayor que dateTo");
        }
    }

    private String buildSummaryCsv(Map<String, Object> summary) {
        StringBuilder csv = new StringBuilder();
        csv.append("metric,value\n");

        summary.forEach((key, value) -> {
            csv.append(escape(key)).append(',').append(escape(String.valueOf(value))).append('\n');
        });

        return csv.toString();
    }

    private String escape(String input) {
        String value = input == null ? "" : input;
        if (value.contains(",") || value.contains("\n") || value.contains("\"")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    private ReportJobResponse toResponse(ReportJob job) {
        return new ReportJobResponse(
                job.id(),
                job.type(),
                job.dateFrom(),
                job.dateTo(),
                job.format(),
                job.status(),
                job.generatedFileName(),
                job.status() == com.grupocordillera.reports.model.ReportStatus.READY ? "/api/reports/" + job.id() + "/download" : null,
                job.errorMessage(),
                job.createdAt(),
                job.updatedAt()
        );
    }

    public record DownloadableReport(String fileName, String contentType, String content) {
    }
}
