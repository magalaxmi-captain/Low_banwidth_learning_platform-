import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { dbInstance, getPgPool } from './src/db/db.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body parsing
  app.use(express.json({ limit: '10mb' }));

  // Request logger for API auditing
  app.use('/api', (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[REST API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    });
    next();
  });

  // RESTful API Routes

  // 1. Health & DB Status Check
  app.get('/api/health', (req, res) => {
    const pg = getPgPool();
    res.json({
      status: 'healthy',
      platform: 'Vidyodaya EdTech PWA Engine',
      database: pg ? 'PostgreSQL Active (Pool Connected)' : 'In-Memory Relational Engine (PostgreSQL Compatible)',
      timestamp: new Date().toISOString(),
      offlineFirstReady: true,
    });
  });

  // 2. Students List & Profile Lookup
  app.get('/api/students', (req, res) => {
    try {
      const students = dbInstance.getStudents();
      res.json({ count: students.length, students });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/students/:id', (req, res) => {
    try {
      const student = dbInstance.getStudentById(req.params.id);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      res.json(student);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Update Student Avatar
  app.post('/api/students/:id/avatar', (req, res) => {
    try {
      const avatarConfig = req.body.avatarConfig;
      if (!avatarConfig) {
        return res.status(400).json({ error: 'avatarConfig object is required' });
      }
      const updated = dbInstance.updateStudentAvatar(req.params.id, avatarConfig);
      res.json({ success: true, student: updated });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Dynamic Leaderboard (with timeframe: weekly, monthly, all_time; and filter: village, classroom, all)
  app.get('/api/leaderboard', (req, res) => {
    try {
      const period = (req.query.period as string) || 'weekly';
      const village = (req.query.village as string) || 'all';
      const classroom = (req.query.classroom as string) || 'all';

      let students = dbInstance.getStudents();

      if (village !== 'all') {
        students = students.filter(s => s.village.toLowerCase() === village.toLowerCase());
      }
      if (classroom !== 'all') {
        students = students.filter(s => `grade ${s.gradeLevel}`.toLowerCase() === classroom.toLowerCase());
      }

      // Calculate XP according to timeframe
      const ranked = students.map(s => {
        let periodXp = s.totalXp;
        if (period === 'weekly') {
          periodXp = Math.round(s.totalXp * 0.45);
        } else if (period === 'monthly') {
          periodXp = Math.round(s.totalXp * 0.82);
        }
        return {
          id: s.id,
          name: s.name,
          village: s.village,
          school: s.school,
          gradeLevel: s.gradeLevel,
          streak: s.streakDays,
          xp: periodXp,
          totalXp: s.totalXp,
          avatar: s.avatar,
          avatarConfig: s.avatarConfig,
          isCurrent: s.id === 'std_01',
        };
      });

      ranked.sort((a, b) => b.xp - a.xp);

      const withRanks = ranked.map((item, index) => ({
        ...item,
        rank: index + 1,
      }));

      res.json({
        period,
        village,
        classroom,
        totalParticipants: withRanks.length,
        leaderboard: withRanks,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 3. Student Check-in / Login (Updates streak & logs attendance)
  app.post('/api/students/login', (req, res) => {
    try {
      const { studentId, networkMode, durationMinutes } = req.body;
      if (!studentId) {
        return res.status(400).json({ error: 'studentId is required' });
      }
      const result = dbInstance.recordLoginAndAttendance(studentId, networkMode, durationMinutes);
      res.json({
        success: true,
        message: `Welcome back, ${result.student.name}! Attendance checked in.`,
        student: result.student,
        attendance: result.attendance,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 4. Record Quiz / Micro-Lesson Completion
  app.post('/api/progress/complete-lesson', (req, res) => {
    try {
      const {
        studentId,
        subjectId,
        nodeId,
        nodeTitle,
        scorePercent,
        accuracyRate,
        xpEarned,
        mistakesCount,
        durationSeconds,
        offlineSynced,
      } = req.body;

      if (!studentId || !nodeId) {
        return res.status(400).json({ error: 'studentId and nodeId are required' });
      }

      const result = dbInstance.recordQuizCompletion({
        studentId,
        subjectId: subjectId || 'math',
        nodeId,
        nodeTitle: nodeTitle || 'Lesson',
        scorePercent: Number(scorePercent) || 100,
        accuracyRate: Number(accuracyRate) || 100,
        xpEarned: Number(xpEarned) || 25,
        mistakesCount: Number(mistakesCount) || 0,
        durationSeconds: Number(durationSeconds) || 60,
        offlineSynced: Boolean(offlineSynced),
      });

      res.json({
        success: true,
        student: result.student,
        attempt: result.attempt,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 5. Attendance Activity Log
  app.get('/api/attendance', (req, res) => {
    try {
      const limit = Number(req.query.limit) || 50;
      const logs = dbInstance.getAttendanceLogs(limit);
      res.json({ count: logs.length, records: logs });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 6. Quiz Attempts Telemetry
  app.get('/api/quizzes', (req, res) => {
    try {
      const limit = Number(req.query.limit) || 50;
      const quizzes = dbInstance.getQuizAttempts(limit);
      res.json({ count: quizzes.length, attempts: quizzes });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 7. Teacher & School Real-time Analytics Dashboard
  app.get('/api/analytics/dashboard', (req, res) => {
    try {
      const analytics = dbInstance.getAnalyticsDashboard();
      res.json(analytics);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 8. Low-Bandwidth Rural Batch Sync (Syncs offline JSON batches)
  app.post('/api/sync/batch', (req, res) => {
    try {
      const { studentId, offlineAttempts, deviceInfo } = req.body;
      if (!studentId || !Array.isArray(offlineAttempts)) {
        return res.status(400).json({ error: 'studentId and offlineAttempts array are required' });
      }

      const syncResult = dbInstance.processBatchSync({
        studentId,
        offlineAttempts,
        deviceInfo: deviceInfo || { deviceId: 'unknown_rural_tablet' },
      });

      res.json(syncResult);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 9. Database Schema Definition & Migration Endpoint
  app.get('/api/database/schema', (req, res) => {
    try {
      const schemaPath = path.join(process.cwd(), 'src', 'db', 'schema.sql');
      const ddl = fs.readFileSync(schemaPath, 'utf-8');
      res.setHeader('Content-Type', 'text/plain');
      res.send(ddl);
    } catch (e: any) {
      res.status(500).send(`-- Could not read schema file: ${e.message}`);
    }
  });

  // Vite middleware or Static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vidyodaya EdTech Server running on port ${PORT}`);
  });
}

startServer();
