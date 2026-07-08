package com.grupocordillera.report.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ReportRequest(
        @NotBlank(message = "El titulo es obligatorio")
        @Size(max = 150, message = "El titulo no puede superar 150 caracteres")
        String title,

        @Size(max = 500, message = "La descripcion no puede superar 500 caracteres")
        String description,

        @NotBlank(message = "El tipo de reporte es obligatorio")
        @Size(max = 50, message = "El tipo de reporte no puede superar 50 caracteres")
        String reportType,

        @Size(max = 30, message = "El estado no puede superar 30 caracteres")
        String status
) {
}
