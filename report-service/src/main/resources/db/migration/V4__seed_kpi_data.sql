-- Datos KPI iniciales: resumen
INSERT INTO kpi_summary (id, ventas_totales, margen_utilidad, stock_critico, reclamos_activos, ticket_promedio, satisfaccion_cliente)
VALUES (1, 198500000, 38.75, 24, 9, 52000, 91)
ON CONFLICT (id) DO NOTHING;

-- Ventas mensuales: 12 meses completos
INSERT INTO monthly_sales (month_label, sales_value) VALUES
    ('Ene', 118),
    ('Feb', 102),
    ('Mar', 134),
    ('Abr', 121),
    ('May', 155),
    ('Jun', 162),
    ('Jul', 148),
    ('Ago', 139),
    ('Sep', 167),
    ('Oct', 172),
    ('Nov', 185),
    ('Dic', 210)
ON CONFLICT (month_label) DO NOTHING;

-- Desempeño por sucursal
INSERT INTO branch_performance (branch_name, score) VALUES
    ('Santiago Centro', 95),
    ('Providencia', 88),
    ('Viña del Mar', 76),
    ('Concepción', 70),
    ('Temuco', 62),
    ('Antofagasta', 58)
ON CONFLICT (branch_name) DO NOTHING;

-- Canales de venta
INSERT INTO sales_channels (channel_name, percentage) VALUES
    ('Tiendas Físicas', 60),
    ('E-commerce', 30),
    ('Venta Telefónica', 10)
ON CONFLICT (channel_name) DO NOTHING;

-- Alertas (12 registros, estados variados)
INSERT INTO alerts (id, title, status, date_label, description) VALUES
    ('1',  'Stock Crítico Línea Blanca',       'CRITICO',     '2026-05-28', 'Quiebre de stock en línea blanca, sucursal Providencia.'),
    ('2',  'Aumento de Reclamos',               'ADVERTENCIA', '2026-05-27', 'Aumento inusual de reclamos por demoras en despacho.'),
    ('3',  'Meta Semanal Superada',             'INFORMATIVO', '2026-05-26', 'Meta semanal de ventas superada en Santiago Centro.'),
    ('4',  'Concepción Supera Meta Mensual',    'INFORMATIVO', '2026-05-25', 'Sucursal Concepción superó la meta mensual por primera vez.'),
    ('5',  'Stock Crítico Electrónicos',        'ADVERTENCIA', '2026-05-24', 'Stock crítico en productos electrónicos, revisar abastecimiento.'),
    ('6',  'Falla Sistema POS Viña del Mar',    'CRITICO',     '2026-05-23', 'Sistema POS sin conexión en sucursal Viña del Mar, ventas manuales.'),
    ('7',  'Campaña Digital Exitosa',           'INFORMATIVO', '2026-05-22', 'Campaña e-commerce generó 35 % más conversiones este mes.'),
    ('8',  'Demoras en Despacho Zona Norte',    'ADVERTENCIA', '2026-05-21', 'Proveedor logístico reporta retrasos en zona norte del país.'),
    ('9',  'Récord de Ventas Online',           'INFORMATIVO', '2026-05-20', 'Canal e-commerce marcó récord histórico de ventas diarias.'),
    ('10', 'Reclamos por Calidad de Producto',  'CRITICO',     '2026-05-19', 'Reclamos por defectos en lote de producto importado.'),
    ('11', 'Stock Bajo en Temporada Alta',      'ADVERTENCIA', '2026-05-18', 'Proyección indica stock insuficiente para temporada de invierno.'),
    ('12', 'Indicadores Financieros Positivos', 'INFORMATIVO', '2026-05-17', 'Margen de utilidad supera proyecciones del trimestre en 5 puntos.')
ON CONFLICT (id) DO NOTHING;
