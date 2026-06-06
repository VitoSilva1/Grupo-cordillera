-- Actualizar KPIs con datos de mayo 2026
UPDATE kpi_summary SET
    ventas_totales       = 198500000,
    margen_utilidad      = 38.75,
    stock_critico        = 24,
    reclamos_activos     = 9,
    ticket_promedio      = 52000,
    satisfaccion_cliente = 91
WHERE id = 1;

-- Actualizar ventas mensuales
UPDATE monthly_sales SET sales_value = 118 WHERE month_label = 'Ene';
UPDATE monthly_sales SET sales_value = 102 WHERE month_label = 'Feb';
UPDATE monthly_sales SET sales_value = 134 WHERE month_label = 'Mar';
UPDATE monthly_sales SET sales_value = 121 WHERE month_label = 'Abr';
UPDATE monthly_sales SET sales_value = 155 WHERE month_label = 'May';
UPDATE monthly_sales SET sales_value = 162 WHERE month_label = 'Jun';

-- Actualizar scores de sucursales
UPDATE branch_performance SET score = 95 WHERE branch_name = 'Santiago Centro';
UPDATE branch_performance SET score = 88 WHERE branch_name = 'Providencia';
UPDATE branch_performance SET score = 76 WHERE branch_name = 'Viña del Mar';
UPDATE branch_performance SET score = 70 WHERE branch_name = 'Concepción';

-- Agregar alertas adicionales
INSERT INTO alerts (id, title, status, date_label, description) VALUES
    ('4', 'Meta Superada',     'INFORMATIVO', '2026-05-28', 'Sucursal Concepción superó la meta mensual por primera vez.'),
    ('5', 'Stock Electrónicos','ADVERTENCIA', '2026-05-29', 'Stock crítico en productos electrónicos, revisar abastecimiento.')
ON CONFLICT (id) DO UPDATE
    SET title      = EXCLUDED.title,
        status     = EXCLUDED.status,
        date_label = EXCLUDED.date_label,
        description= EXCLUDED.description;
