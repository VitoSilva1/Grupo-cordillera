CREATE TABLE IF NOT EXISTS report_jobs (
    id BIGSERIAL PRIMARY KEY,
    report_type VARCHAR(60) NOT NULL,
    date_from DATE,
    date_to DATE,
    format VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    generated_file_name VARCHAR(255),
    generated_content TEXT,
    error_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_jobs_status ON report_jobs(status);
CREATE INDEX IF NOT EXISTS idx_report_jobs_created_at ON report_jobs(created_at DESC);
