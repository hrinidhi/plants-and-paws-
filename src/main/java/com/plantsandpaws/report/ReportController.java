package com.plantsandpaws.report;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin
public class ReportController {
    private final ReportRepository repository;

    public ReportController(ReportRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Report> all() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/pending")
    public List<Report> pending() {
        return repository.findAllByOrderByCreatedAtDesc().stream()
                .filter(r -> "PENDING".equals(r.getStatus()))
                .toList();
    }

    @PostMapping
    public Report create(@RequestBody Report report) {
        return repository.save(new Report(
                report.getType(),
                report.getTitle(),
                report.getDescription(),
                report.getLocation(),
                report.getReporter(),
                report.getProofUrl()
        ));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        return repository.findById(id).map(r -> {
            r.setStatus("APPROVED");
            repository.save(r);
            return ResponseEntity.ok(Map.of("message", "Report approved", "status", r.getStatus()));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        return repository.findById(id).map(r -> {
            r.setStatus("REJECTED");
            repository.save(r);
            return ResponseEntity.ok(Map.of("message", "Report rejected", "status", r.getStatus()));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    public Map<String, Long> stats() {
        return Map.of(
                "pending", repository.countByStatus("PENDING"),
                "animals", repository.countByTypeAndStatus("ANIMAL", "PENDING"),
                "plants", repository.countByTypeAndStatus("PLANT", "PENDING")
        );
    }
}
