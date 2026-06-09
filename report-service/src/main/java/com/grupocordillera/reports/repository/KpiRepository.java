package com.grupocordillera.reports.repository;

import com.grupocordillera.reports.model.AlertStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Repositorio JDBC para leer datos KPI desde reports_db.
 * Las tablas KPI son creadas por la migración V3 y pobladas por V4.
 */
@Repository
public class KpiRepository {

    private final JdbcTemplate jdbcTemplate;

    public KpiRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ─── KPI Summary ────────────────────────────────────────────────────────

    public long getVentasTotales() {
        Long v = jdbcTemplate.queryForObject(
                "SELECT ventas_totales FROM kpi_summary WHERE id = 1", Long.class);
        return v == null ? 0L : v;
    }

    public double getMargenUtilidad() {
        Double v = jdbcTemplate.queryForObject(
                "SELECT margen_utilidad FROM kpi_summary WHERE id = 1", Double.class);
        return v == null ? 0.0 : v;
    }

    public int getStockCritico() {
        Integer v = jdbcTemplate.queryForObject(
                "SELECT stock_critico FROM kpi_summary WHERE id = 1", Integer.class);
        return v == null ? 0 : v;
    }

    public int getReclamosActivos() {
        Integer v = jdbcTemplate.queryForObject(
                "SELECT reclamos_activos FROM kpi_summary WHERE id = 1", Integer.class);
        return v == null ? 0 : v;
    }

    public long getTicketPromedio() {
        Long v = jdbcTemplate.queryForObject(
                "SELECT ticket_promedio FROM kpi_summary WHERE id = 1", Long.class);
        return v == null ? 0L : v;
    }

    public int getSatisfaccionCliente() {
        Integer v = jdbcTemplate.queryForObject(
                "SELECT satisfaccion_cliente FROM kpi_summary WHERE id = 1", Integer.class);
        return v == null ? 0 : v;
    }

    /** Retorna el resumen KPI como mapa para generación de CSV. */
    public Map<String, Object> getSummaryMap() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("ventasTotales",      getVentasTotales());
        map.put("margenUtilidad",     getMargenUtilidad());
        map.put("stockCritico",       getStockCritico());
        map.put("reclamosActivos",    getReclamosActivos());
        map.put("ticketPromedio",     getTicketPromedio());
        map.put("satisfaccionCliente", getSatisfaccionCliente());
        return map;
    }

    // ─── Monthly Sales ───────────────────────────────────────────────────────

    public List<Map<String, Object>> getMonthlySales() {
        return jdbcTemplate.query(
                """
                SELECT month_label, sales_value
                FROM monthly_sales
                ORDER BY CASE month_label
                    WHEN 'Ene' THEN 1  WHEN 'Feb' THEN 2  WHEN 'Mar' THEN 3
                    WHEN 'Abr' THEN 4  WHEN 'May' THEN 5  WHEN 'Jun' THEN 6
                    WHEN 'Jul' THEN 7  WHEN 'Ago' THEN 8  WHEN 'Sep' THEN 9
                    WHEN 'Oct' THEN 10 WHEN 'Nov' THEN 11 WHEN 'Dic' THEN 12
                    ELSE 99 END
                """,
                (rs, _) -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("month",  rs.getString("month_label"));
                    row.put("ventas", rs.getInt("sales_value"));
                    return row;
                }
        );
    }

    // ─── Branch Performance ──────────────────────────────────────────────────

    public List<Map<String, Object>> getBranchPerformance() {
        return jdbcTemplate.query(
                "SELECT branch_name, score FROM branch_performance ORDER BY score DESC",
                (rs, _) -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("branch",    rs.getString("branch_name"));
                    row.put("desempeño", rs.getInt("score"));
                    return row;
                }
        );
    }

    // ─── Sales Channels ──────────────────────────────────────────────────────

    public List<Map<String, Object>> getSalesChannels() {
        return jdbcTemplate.query(
                "SELECT channel_name, percentage FROM sales_channels ORDER BY percentage DESC",
                (rs, _) -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("channel", rs.getString("channel_name"));
                    row.put("value",   rs.getInt("percentage"));
                    return row;
                }
        );
    }

    // ─── Alerts ──────────────────────────────────────────────────────────────

    public List<Map<String, Object>> getAlerts() {
        return jdbcTemplate.query(
                "SELECT id, title, status, date_label, description FROM alerts ORDER BY date_label DESC",
                (rs, _) -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("id",          rs.getString("id"));
                    row.put("kpi",         rs.getString("title"));
                    row.put("status",      AlertStatus.valueOf(rs.getString("status")).getLabel());
                    row.put("date",        rs.getString("date_label"));
                    row.put("description", rs.getString("description"));
                    return row;
                }
        );
    }
}
