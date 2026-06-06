package com.grupocordillera.reports.dto;

import com.grupocordillera.reports.model.ReportFormat;
import com.grupocordillera.reports.model.ReportType;

import java.time.LocalDate;

public record CreateReportRequest(
        ReportType type,
        LocalDate dateFrom,
        LocalDate dateTo,
        ReportFormat format
) {
}
