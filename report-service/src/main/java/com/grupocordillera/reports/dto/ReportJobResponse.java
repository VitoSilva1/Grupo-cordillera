package com.grupocordillera.reports.dto;

import com.grupocordillera.reports.model.ReportFormat;
import com.grupocordillera.reports.model.ReportStatus;
import com.grupocordillera.reports.model.ReportType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReportJobResponse(
        Long id,
        ReportType type,
        LocalDate dateFrom,
        LocalDate dateTo,
        ReportFormat format,
        ReportStatus status,
        String fileName,
        String downloadPath,
        String error,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
