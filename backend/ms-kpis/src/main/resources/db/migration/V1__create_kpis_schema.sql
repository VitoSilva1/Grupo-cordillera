CREATE TABLE kpi_summary (
    id SMALLINT PRIMARY KEY,
    ventas_totales BIGINT NOT NULL,
    margen_utilidad NUMERIC(5,2) NOT NULL,
    stock_critico INTEGER NOT NULL,
    reclamos_activos INTEGER NOT NULL,
    ticket_promedio BIGINT NOT NULL,
    satisfaccion_cliente INTEGER NOT NULL
);

CREATE TABLE monthly_sales (
    month_label VARCHAR(20) PRIMARY KEY,
    sales_value INTEGER NOT NULL
);

CREATE TABLE branch_performance (
    branch_name VARCHAR(80) PRIMARY KEY,
    score INTEGER NOT NULL
);

CREATE TABLE sales_channels (
    channel_name VARCHAR(80) PRIMARY KEY,
    percentage INTEGER NOT NULL
);

CREATE TABLE alerts (
    id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    status VARCHAR(30) NOT NULL,
    date_label VARCHAR(20) NOT NULL,
    description VARCHAR(255) NOT NULL
);
