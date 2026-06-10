package com.grupocordillera.userService.dto;

import com.grupocordillera.userService.model.Report;

import java.time.LocalDateTime;

public record ReportResponse(
        Long id,
        String title,
        String description,
        String reportType,
        String status,
        LocalDateTime generatedAt
) {
    public static ReportResponse from(Report report) {
        return new ReportResponse(
                report.getId(),
                report.getTitle(),
                report.getDescription(),
                report.getReportType(),
                report.getStatus(),
                report.getGeneratedAt()
        );
    }
}
