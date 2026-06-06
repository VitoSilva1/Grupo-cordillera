package com.grupocordillera.reports.repository;

import com.grupocordillera.reports.model.ReportFormat;
import com.grupocordillera.reports.model.ReportJob;
import com.grupocordillera.reports.model.ReportStatus;
import com.grupocordillera.reports.model.ReportType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public class ReportJobRepository {

    private static final RowMapper<ReportJob> ROW_MAPPER = (rs, _rowNum) -> new ReportJob(
            rs.getLong("id"),
            ReportType.valueOf(rs.getString("report_type")),
            toLocalDate(rs.getDate("date_from")),
            toLocalDate(rs.getDate("date_to")),
            ReportFormat.valueOf(rs.getString("format")),
            ReportStatus.valueOf(rs.getString("status")),
            rs.getString("generated_file_name"),
            rs.getString("generated_content"),
            rs.getString("error_message"),
            toLocalDateTime(rs.getTimestamp("created_at")),
            toLocalDateTime(rs.getTimestamp("updated_at"))
    );

    private final JdbcTemplate jdbcTemplate;

    public ReportJobRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public ReportJob create(ReportType type, LocalDate dateFrom, LocalDate dateTo, ReportFormat format) {
        final String sql = """
                INSERT INTO report_jobs(report_type, date_from, date_to, format, status)
                VALUES (?, ?, ?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, type.name());
            statement.setDate(2, dateFrom == null ? null : Date.valueOf(dateFrom));
            statement.setDate(3, dateTo == null ? null : Date.valueOf(dateTo));
            statement.setString(4, format.name());
            statement.setString(5, ReportStatus.PENDING.name());
            return statement;
        }, keyHolder);

        Number key = keyHolder.getKey();
        if (key == null) {
            throw new IllegalStateException("No se pudo generar id para report_job");
        }

        return findById(key.longValue()).orElseThrow(() -> new IllegalStateException("Report job no encontrado tras creación"));
    }

    public Optional<ReportJob> findById(Long id) {
        String sql = "SELECT * FROM report_jobs WHERE id = ?";
        return jdbcTemplate.query(sql, ROW_MAPPER, id).stream().findFirst();
    }

    public void markReady(Long id, String fileName, String generatedContent) {
        String sql = """
                UPDATE report_jobs
                SET status = ?, generated_file_name = ?, generated_content = ?, error_message = NULL, updated_at = NOW()
                WHERE id = ?
                """;
        jdbcTemplate.update(sql, ReportStatus.READY.name(), fileName, generatedContent, id);
    }

    public void markFailed(Long id, String errorMessage) {
        String sql = """
                UPDATE report_jobs
                SET status = ?, error_message = ?, updated_at = NOW()
                WHERE id = ?
                """;
        jdbcTemplate.update(sql, ReportStatus.FAILED.name(), errorMessage, id);
    }

    private static LocalDate toLocalDate(Date date) {
        return date == null ? null : date.toLocalDate();
    }

    private static LocalDateTime toLocalDateTime(Timestamp timestamp) {
        return timestamp == null ? null : timestamp.toLocalDateTime();
    }
}
