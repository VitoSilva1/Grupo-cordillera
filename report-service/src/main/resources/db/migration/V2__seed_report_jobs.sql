-- Historial de reportes de ejemplo para ambiente de estudio
INSERT INTO report_jobs (report_type, date_from, date_to, format, status, generated_file_name, generated_content, error_message, created_at, updated_at) VALUES
(
    'KPI_SUMMARY', '2026-05-01', '2026-05-31', 'CSV', 'READY',
    'report-1.csv',
    'Métrica,Valor
Ventas Totales,198500000
Margen Utilidad,38.75
Stock Crítico,24
Reclamos Activos,9
Ticket Promedio,52000
Satisfacción Cliente,91',
    NULL,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
),
(
    'KPI_SUMMARY', '2026-04-01', '2026-04-30', 'CSV', 'READY',
    'report-2.csv',
    'Métrica,Valor
Ventas Totales,145000000
Margen Utilidad,32.5
Stock Crítico,18
Reclamos Activos,5
Ticket Promedio,45000
Satisfacción Cliente,94',
    NULL,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days'
),
(
    'KPI_SUMMARY', '2026-03-01', '2026-03-31', 'CSV', 'FAILED',
    NULL,
    NULL,
    'Error al generar el reporte: datos de KPI no disponibles en ese período',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days'
);
