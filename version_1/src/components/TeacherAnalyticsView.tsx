import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Calendar, 
  Database, 
  FileCode, 
  RefreshCw, 
  Search, 
  Radio, 
  HardDrive,
  BarChart3,
  Flame,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { Student, AttendanceRecord, QuizAttempt } from '../types.ts';
import { TactileButton } from './TactileButton.tsx';

export const TeacherAnalyticsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'quizzes' | 'villages' | 'api_schema'>('attendance');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [postgresSchema, setPostgresSchema] = useState<string>('');
  const [apiEndpointTested, setApiEndpointTested] = useState<string>('/api/analytics/dashboard');
  const [apiResponseJson, setApiResponseJson] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState('');

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [analyticsRes, attRes, quizRes, schemaRes] = await Promise.all([
        fetch('/api/analytics/dashboard').then((r) => r.json()),
        fetch('/api/attendance?limit=25').then((r) => r.json()),
        fetch('/api/quizzes?limit=25').then((r) => r.json()),
        fetch('/api/database/schema').then((r) => r.text()),
      ]);

      setDashboardData(analyticsRes);
      setAttendanceRecords(attRes.records || []);
      setQuizAttempts(quizRes.attempts || []);
      setPostgresSchema(schemaRes || '');
      setApiResponseJson(JSON.stringify(analyticsRes, null, 2));
    } catch (e) {
      console.warn('API fetch error; loaded with defaults', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleTestApi = async (endpoint: string) => {
    setApiEndpointTested(endpoint);
    try {
      const res = await fetch(endpoint);
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('json')) {
        const json = await res.json();
        setApiResponseJson(JSON.stringify(json, null, 2));
      } else {
        const text = await res.text();
        setApiResponseJson(text);
      }
    } catch (e: any) {
      setApiResponseJson(JSON.stringify({ error: e.message }, null, 2));
    }
  };

  const filteredAttendance = attendanceRecords.filter((a) =>
    a.studentName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    a.deviceId.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredQuizzes = quizAttempts.filter((q) =>
    q.studentName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    q.nodeTitle.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="w-full max-w-2xl mx-auto pb-28 pt-4 px-4 space-y-5">
      {/* Header Banner */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-5 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-400 mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>Teacher & Administrator Portal</span>
            </div>
            <h2 className="text-xl font-black tracking-tight">Real-Time Progress & Telemetry</h2>
            <p className="text-xs text-slate-400 mt-1">
              Live tracking of student check-ins, attendance logs, and quiz performance across rural clusters.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAnalytics}
            disabled={loading}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 active:scale-95 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Live Data</span>
          </button>
        </div>
      </div>

      {/* Real-Time Metric Counters */}
      {dashboardData?.summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3.5 bg-white border-2 border-slate-200 rounded-2xl">
            <div className="flex items-center gap-1 text-slate-400 text-xs font-bold mb-1">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Active Students</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{dashboardData.summary.totalStudents}</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">3 Villages Enrolled</div>
          </div>

          <div className="p-3.5 bg-white border-2 border-slate-200 rounded-2xl">
            <div className="flex items-center gap-1 text-slate-400 text-xs font-bold mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />
              <span>Avg Quiz Accuracy</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{dashboardData.summary.avgAccuracy}%</div>
            <div className="text-[10px] text-cyan-700 font-semibold mt-0.5">STEM Mastery Level</div>
          </div>

          <div className="p-3.5 bg-white border-2 border-slate-200 rounded-2xl">
            <div className="flex items-center gap-1 text-slate-400 text-xs font-bold mb-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Total Learning</span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {dashboardData.summary.totalAttendanceHours} <span className="text-xs font-bold text-slate-400">hrs</span>
            </div>
            <div className="text-[10px] text-indigo-700 font-semibold mt-0.5">Logged Attendance</div>
          </div>

          <div className="p-3.5 bg-white border-2 border-slate-200 rounded-2xl">
            <div className="flex items-center gap-1 text-slate-400 text-xs font-bold mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Avg Streak</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{dashboardData.summary.avgStreak}d</div>
            <div className="text-[10px] text-amber-700 font-semibold mt-0.5">Consistent Daily Study</div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto">
        {[
          { id: 'attendance', label: 'Attendance Logs' },
          { id: 'quizzes', label: 'Quiz Performance' },
          { id: 'villages', label: 'Village Breakdown' },
          { id: 'api_schema', label: 'REST API & PostgreSQL' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all text-center whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Filter for Tables */}
      {(activeTab === 'attendance' || activeTab === 'quizzes') && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name or device..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
          />
        </div>
      )}

      {/* TAB 1: Real-Time Attendance Logs */}
      {activeTab === 'attendance' && (
        <div className="space-y-3">
          <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                Student Check-In & Attendance History ({filteredAttendance.length})
              </h3>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                Live REST API: /api/attendance
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {filteredAttendance.map((record) => (
                <div key={record.id} className="p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-extrabold text-slate-900">{record.studentName}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{record.date}</span>
                      <span>•</span>
                      <span>{new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px] text-slate-500">{record.deviceId}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">
                      {record.durationMinutes} mins
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        record.networkMode === 'offline'
                          ? 'bg-emerald-100 text-emerald-800'
                          : record.networkMode === 'mesh_p2p'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-cyan-100 text-cyan-800'
                      }`}
                    >
                      {record.networkMode}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Quiz & Micro-Lesson Performance */}
      {activeTab === 'quizzes' && (
        <div className="space-y-3">
          <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                Telemetry Quiz Attempts ({filteredQuizzes.length})
              </h3>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                Live REST API: /api/quizzes
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {filteredQuizzes.map((quiz) => (
                <div key={quiz.id} className="p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-extrabold text-slate-900">{quiz.studentName}</div>
                    <div className="text-[11px] text-slate-600 font-semibold mt-0.5">{quiz.nodeTitle}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Completed {new Date(quiz.completedAt).toLocaleTimeString()} ({quiz.durationSeconds}s)
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-black text-emerald-700 text-sm">
                        {quiz.scorePercent}%
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {quiz.mistakesCount} mistake{quiz.mistakesCount === 1 ? '' : 's'}
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
                      +{quiz.xpEarned} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Village Breakdown */}
      {activeTab === 'villages' && dashboardData?.villageStats && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(dashboardData.villageStats).map(([village, stats]: [string, any]) => (
              <div key={village} className="p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-2xs">
                <div className="text-sm font-black text-slate-900 mb-1">{village}</div>
                <div className="space-y-1.5 text-xs text-slate-600 font-medium mt-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Students:</span>
                    <span className="font-bold text-slate-800">{stats.students}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Knowledge:</span>
                    <span className="font-bold text-emerald-700">{stats.avgXp} XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Quizzes Passed:</span>
                    <span className="font-bold text-slate-800">{stats.totalQuizzes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Attendance:</span>
                    <span className="font-bold text-slate-800">{stats.totalAttendanceMinutes} mins</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subject Performance Breakdown */}
          {dashboardData?.subjectPerformance && (
            <div className="p-4 bg-white border-2 border-slate-200 rounded-2xl">
              <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider mb-3">
                Subject Mastery Distribution (Grades 1–8 STEM & Literacy)
              </h3>
              <div className="space-y-3">
                {dashboardData.subjectPerformance.map((sub: any) => (
                  <div key={sub.subject}>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>{sub.subject}</span>
                      <span className="text-emerald-700">{sub.avgAccuracy}% Accuracy</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${sub.avgAccuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: REST API Explorer & Scalable PostgreSQL Schema */}
      {activeTab === 'api_schema' && (
        <div className="space-y-4">
          {/* REST API Tester */}
          <div className="p-4 bg-white border-2 border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-slate-800">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>RESTful API Live Endpoints</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Express v4 / PostgreSQL</span>
            </div>

            {/* Quick Endpoint Trigger Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                '/api/health',
                '/api/students',
                '/api/attendance',
                '/api/quizzes',
                '/api/analytics/dashboard',
                '/api/database/schema',
              ].map((ep) => (
                <button
                  key={ep}
                  type="button"
                  onClick={() => handleTestApi(ep)}
                  className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                    apiEndpointTested === ep
                      ? 'bg-slate-900 text-emerald-400 border-slate-900'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  GET {ep}
                </button>
              ))}
            </div>

            {/* Response Console */}
            <div className="bg-slate-950 rounded-xl p-3 text-[11px] font-mono text-emerald-400 max-h-56 overflow-y-auto border border-slate-800">
              <div className="text-slate-500 mb-1 text-[10px] flex justify-between">
                <span>Response: {apiEndpointTested}</span>
                <span>Status: 200 OK</span>
              </div>
              <pre className="whitespace-pre-wrap">{apiResponseJson}</pre>
            </div>
          </div>

          {/* PostgreSQL DDL Schema Display */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl border-2 border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-400">
                <FileCode className="w-4 h-4" />
                <span>Production PostgreSQL DDL (src/db/schema.sql)</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                PostgreSQL 15+ Compatible
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
              Includes scalable relational schema for students, daily attendance logs, curriculum units, quiz attempts, and analytical SQL views:
            </p>
            <pre className="bg-slate-950 p-3 rounded-xl text-[10.5px] font-mono text-slate-300 max-h-64 overflow-y-auto border border-slate-800 whitespace-pre">
              {postgresSchema || '-- Loading schema.sql...'}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
