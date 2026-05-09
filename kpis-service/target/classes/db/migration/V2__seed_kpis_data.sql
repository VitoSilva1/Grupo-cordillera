INSERT INTO kpi_summary (id, ventas_totales, margen_utilidad, stock_critico, reclamos_activos, ticket_promedio, satisfaccion_cliente)
VALUES (1, 145000000, 32.5, 18, 5, 45000, 94)
ON CONFLICT (id) DO NOTHING;

INSERT INTO monthly_sales (month_label, sales_value)
VALUES
    ('Ene', 110),
    ('Feb', 95),
    ('Mar', 125),
    ('Abr', 115),
    ('May', 140),
    ('Jun', 145)
ON CONFLICT (month_label) DO NOTHING;

INSERT INTO branch_performance (branch_name, score)
VALUES
    ('Santiago Centro', 98),
    ('Providencia', 85),
    ('Viña del Mar', 72),
    ('Concepción', 65)
ON CONFLICT (branch_name) DO NOTHING;

INSERT INTO sales_channels (channel_name, percentage)
VALUES
    ('Tiendas Físicas', 65),
    ('E-commerce', 25),
    ('Venta Telefónica', 10)
ON CONFLICT (channel_name) DO NOTHING;

INSERT INTO alerts (id, title, status, date_label, description)
VALUES
    ('1', 'Stock Crítico', 'CRITICO', '2026-04-27', 'Quiebre de stock en línea blanca, sucursal Providencia.'),
    ('2', 'Reclamos', 'ADVERTENCIA', '2026-04-26', 'Aumento inusual de reclamos por demoras en despacho.'),
    ('3', 'Ventas', 'INFORMATIVO', '2026-04-25', 'Meta semanal de ventas superada en Santiago Centro.')
ON CONFLICT (id) DO NOTHING;
