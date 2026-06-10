package com.grupocordillera.userService.repository;

import com.grupocordillera.userService.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, Long> {

    boolean existsByUsername(String username);

    boolean existsByEmailIgnoreCase(String email);

    Optional<Report> findByUsername(String username);
}
