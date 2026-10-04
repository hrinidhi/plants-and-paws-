package com.plantsandpaws.report;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findAllByOrderByCreatedAtDesc();
    long countByStatus(String status);
    long countByTypeAndStatus(String type, String status);
}
