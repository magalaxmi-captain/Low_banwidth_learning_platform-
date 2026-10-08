-- Vidyodaya Educational Platform: Scalable PostgreSQL Production Schema
-- Designed for Rural Low-Bandwidth EdTech with Offline-First Synchronization and Real-Time Analytics

-- 1. Students Table
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(64) PRIMARY KEY,
    student_code VARCHAR(32) NOT NULL UNIQUE,
    full_name VARCHAR(128) NOT NULL,
    village VARCHAR(128) NOT NULL,
    school_name VARCHAR(256) NOT NULL,
    grade_level INTEGER NOT NULL CHECK (grade_level BETWEEN 1 AND 8),
    avatar_id VARCHAR(64) DEFAULT 'owl_veera',
    streak_days INTEGER DEFAULT 1,
    total_xp INTEGER DEFAULT 0,
    gems INTEGER DEFAULT 100,
    hearts INTEGER DEFAULT 5,
    max_hearts INTEGER DEFAULT 5,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Daily Attendance and Login Sessions
CREATE TABLE IF NOT EXISTS attendance_logs (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    check_in_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    duration_minutes INTEGER DEFAULT 0,
    device_id VARCHAR(128),
    network_mode VARCHAR(32) DEFAULT 'offline' CHECK (network_mode IN ('offline', '2g_edge', 'mesh_p2p', 'broadband')),
    synced_to_cloud BOOLEAN DEFAULT TRUE,
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Curriculum Units and Nodes
CREATE TABLE IF NOT EXISTS curriculum_nodes (
    id VARCHAR(64) PRIMARY KEY,
    subject_id VARCHAR(32) NOT NULL,
    unit_id VARCHAR(32) NOT NULL,
    unit_title VARCHAR(128) NOT NULL,
    node_index INTEGER NOT NULL,
    title VARCHAR(128) NOT NULL,
    subtitle VARCHAR(256),
    node_type VARCHAR(32) DEFAULT 'standard' CHECK (node_type IN ('standard', 'milestone', 'checkpoint_boss')),
    xp_reward INTEGER DEFAULT 25,
    total_exercises INTEGER DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Student Node Progress
CREATE TABLE IF NOT EXISTS student_progress (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    node_id VARCHAR(64) NOT NULL REFERENCES curriculum_nodes(id) ON DELETE CASCADE,
    status VARCHAR(32) DEFAULT 'locked' CHECK (status IN ('locked', 'active', 'completed')),
    stars_earned INTEGER DEFAULT 0 CHECK (stars_earned BETWEEN 0 AND 3),
    best_score_percent INTEGER DEFAULT 0,
    times_attempted INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, node_id)
);

-- 5. Quiz and Micro-Lesson Attempts (Detailed Telemetry)
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id VARCHAR(32) NOT NULL,
    node_id VARCHAR(64) NOT NULL REFERENCES curriculum_nodes(id) ON DELETE CASCADE,
    score_percent INTEGER NOT NULL CHECK (score_percent BETWEEN 0 AND 100),
    accuracy_rate NUMERIC(5, 2) NOT NULL,
    xp_earned INTEGER DEFAULT 0,
    mistakes_count INTEGER DEFAULT 0,
    duration_seconds INTEGER DEFAULT 60,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    offline_synced BOOLEAN DEFAULT FALSE,
    payload_version VARCHAR(16) DEFAULT '1.0'
);

-- 6. Offline Sync Batch Audit Log (Rural Low-Bandwidth Synchronization)
CREATE TABLE IF NOT EXISTS sync_batches (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    device_fingerprint VARCHAR(128),
    records_synced INTEGER NOT NULL,
    payload_size_bytes INTEGER NOT NULL,
    transport_type VARCHAR(32) DEFAULT 'http_micro_json' CHECK (transport_type IN ('http_micro_json', 'mesh_bluetooth', 'sd_card_batch')),
    received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for Fast Analytics and High-Volume Reporting
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_logs(session_date);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_student_node ON quiz_attempts(student_id, node_id);
CREATE INDEX IF NOT EXISTS idx_quiz_completed ON quiz_attempts(completed_at);
CREATE INDEX IF NOT EXISTS idx_progress_student ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_students_village ON students(village);

-- Analytical View 1: Real-Time Attendance Summary by Date
CREATE OR REPLACE VIEW view_daily_attendance_summary AS
SELECT 
    session_date,
    COUNT(DISTINCT student_id) AS active_students_count,
    ROUND(AVG(duration_minutes), 1) AS avg_duration_minutes,
    COUNT(CASE WHEN network_mode = 'offline' THEN 1 END) AS offline_sessions,
    COUNT(CASE WHEN network_mode = 'mesh_p2p' THEN 1 END) AS mesh_p2p_sessions
FROM attendance_logs
GROUP BY session_date
ORDER BY session_date DESC;

-- Analytical View 2: Student Subject Mastery & Performance
CREATE OR REPLACE VIEW view_student_performance_analytics AS
SELECT 
    s.id AS student_id,
    s.full_name,
    s.village,
    s.grade_level,
    s.streak_days,
    s.total_xp,
    COUNT(q.id) AS total_quizzes_completed,
    ROUND(AVG(q.score_percent), 1) AS avg_quiz_score,
    ROUND(AVG(q.accuracy_rate), 1) AS avg_accuracy_percent,
    MAX(q.completed_at) AS last_quiz_timestamp
FROM students s
LEFT JOIN quiz_attempts q ON s.id = q.student_id
GROUP BY s.id, s.full_name, s.village, s.grade_level, s.streak_days, s.total_xp;
