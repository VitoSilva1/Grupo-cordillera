package com.grupocordillera.reports.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReportJob(
        Long id,
        ReportType type,
        LocalDate dateFrom,
        LocalDate dateTo,
        ReportFormat format,
        ReportStatus status,
        String generatedFileName,
        String generatedContent,
        String errorMessage,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
