package com.grupocordillera.kpis.repository;

import com.grupocordillera.kpis.dto.AlertResponse;
import com.grupocordillera.kpis.dto.BranchPerformanceResponse;
import com.grupocordillera.kpis.dto.MonthlySalesResponse;
import com.grupocordillera.kpis.dto.SalesChannelResponse;
import com.grupocordillera.kpis.model.AlertStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class InMemoryKpiRepository {

    private final JdbcTemplate jdbcTemplate;

    public InMemoryKpiRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public long getTotalSales() {
        return jdbcTemplate.queryForObject("SELECT ventas_totales FROM kpi_summary WHERE id = 1", Long.class);
    }

    public double getProfitMargin() {
        Double value = jdbcTemplate.queryForObject("SELECT margen_utilidad FROM kpi_summary WHERE id = 1", Double.class);
        return value == null ? 0.0 : value;
    }

    public int getCriticalStock() {
        Integer value = jdbcTemplate.queryForObject("SELECT stock_critico FROM kpi_summary WHERE id = 1", Integer.class);
        return value == null ? 0 : value;
    }

    public int getActiveClaims() {
        Integer value = jdbcTemplate.queryForObject("SELECT reclamos_activos FROM kpi_summary WHERE id = 1", Integer.class);
        return value == null ? 0 : value;
    }

    public long getAverageTicket() {
        Long value = jdbcTemplate.queryForObject("SELECT ticket_promedio FROM kpi_summary WHERE id = 1", Long.class);
        return value == null ? 0L : value;
    }

    public int getCustomerSatisfaction() {
        Integer value = jdbcTemplate.queryForObject("SELECT satisfaccion_cliente FROM kpi_summary WHERE id = 1", Integer.class);
        return value == null ? 0 : value;
    }

    public List<MonthlySalesResponse> getMonthlySales() {
        return jdbcTemplate.query(
                "SELECT month_label, sales_value FROM monthly_sales ORDER BY CASE month_label " +
                        "WHEN 'Ene' THEN 1 WHEN 'Feb' THEN 2 WHEN 'Mar' THEN 3 WHEN 'Abr' THEN 4 " +
                        "WHEN 'May' THEN 5 WHEN 'Jun' THEN 6 ELSE 99 END",
                (rs, rowNum) -> new MonthlySalesResponse(
                        rs.getString("month_label"),
                        rs.getInt("sales_value")
                )
        );
    }

    public List<BranchPerformanceResponse> getBranchPerformance() {
        return jdbcTemplate.query(
                "SELECT branch_name, score FROM branch_performance ORDER BY score DESC",
                (rs, rowNum) -> new BranchPerformanceResponse(
                        rs.getString("branch_name"),
                        rs.getInt("score")
                )
        );
    }

    public List<SalesChannelResponse> getSalesChannels() {
        return jdbcTemplate.query(
                "SELECT channel_name, percentage FROM sales_channels ORDER BY percentage DESC",
                (rs, rowNum) -> new SalesChannelResponse(
                        rs.getString("channel_name"),
                        rs.getInt("percentage")
                )
        );
    }

    public List<AlertResponse> getAlerts() {
        return jdbcTemplate.query(
                "SELECT id, title, status, date_label, description FROM alerts ORDER BY date_label DESC",
                (rs, rowNum) -> new AlertResponse(
                        rs.getString("id"),
                        rs.getString("title"),
                        AlertStatus.valueOf(rs.getString("status")),
                        rs.getString("date_label"),
                        rs.getString("description")
                )
        );
    }
}
