package com.grupocordillera.userService.repository;

import com.grupocordillera.userService.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {
}
