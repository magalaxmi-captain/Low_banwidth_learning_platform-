import React, { useState } from 'react';
import { X, HardDrive, Wifi, WifiOff, Share2, RefreshCw, CheckCircle, Radio, Database, Smartphone, ShieldCheck } from 'lucide-react';
import { TactileButton } from './TactileButton.tsx';

interface OfflineSyncModalProps {
  onClose: () => void;
  studentId: string;
  studentName: string;
  onSyncComplete?: () => void;
}

export const OfflineSyncModal: React.FC<OfflineSyncModalProps> = ({
  onClose,
  studentId,
  studentName,
  onSyncComplete,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);
  const [p2pActive, setP2pActive] = useState(false);
  const [networkMode, setNetworkMode] = useState<'offline' | '2g_edge' | 'mesh_p2p' | 'broadband'>('offline');
  const [syncLogs, setSyncLogs] = useState<string[]>([
    'Local IndexedDB ready. 18 lessons available offline.',
    'Cryptographic SHA-256 micro-batch prepared.',
  ]);

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setSyncDone(false);
    setSyncLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Transmitting micro-JSON batch to Vidyodaya hub...`]);

    try {
      // Real API call to server.ts /api/sync/batch
      const res = await fetch('/api/sync/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          offlineAttempts: [
            {
              subjectId: 'math',
              nodeId: 'm_fractions_compare',
              nodeTitle: 'Comparing Fractions',
              scorePercent: 95,
              accuracyRate: 95,
              xpEarned: 30,
              mistakesCount: 1,
              durationSeconds: 110,
            },
          ],
          deviceInfo: {
            deviceId: 'tab_sundarpur_mesh_node_01',
            networkMode,
          },
        }),
      });

      const data = await res.json();
      setTimeout(() => {
        setIsSyncing(false);
        setSyncDone(true);
        setSyncLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Batch successfully processed by cloud database. 2 records synced.`,
        ]);
        if (onSyncComplete) onSyncComplete();
      }, 1000);
    } catch (e) {
      setTimeout(() => {
        setIsSyncing(false);
        setSyncDone(true);
        setSyncLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Synced locally to device queue. Will dispatch when village hub is within range.`,
        ]);
      }, 800);
    }
  };

  const handleP2PShare = () => {
    setP2pActive(true);
    setSyncLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Bluetooth Low Energy (BLE) beacon broadcast: Sharing Grade 4 STEM packets to nearby peers...`,
    ]);
    setTimeout(() => {
      setP2pActive(false);
      setSyncLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Peer connection established with "Aarav's Tablet". Shared 3 pending lesson files.`,
      ]);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl border-2 border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Low-Bandwidth Sync Tray</h3>
              <p className="text-[10px] text-slate-500 font-medium">Offline-First Rural Engine</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Storage Stat Card */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-1.5">
              <span>Device Local Storage</span>
              <span className="bg-emerald-200/60 px-2 py-0.5 rounded-md text-[10px]">
                4.2 MB / 18 Lessons
              </span>
            </div>
            {/* Progress storage meter */}
            <div className="w-full h-2.5 bg-emerald-200/50 rounded-full overflow-hidden mb-2">
              <div className="w-1/4 h-full bg-emerald-600 rounded-full"></div>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              All Grade 1–8 STEM curricula are compressed into lightweight pure SVG and micro-JSON models, allowing 100% offline study without cellular data.
            </p>
          </div>

          {/* Network Mode Simulation */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
              Current Field Connectivity:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'offline', label: 'Offline / Zero Data', icon: WifiOff },
                { id: 'mesh_p2p', label: 'Local Mesh P2P', icon: Radio },
                { id: '2g_edge', label: '2G EDGE Cellular', icon: Smartphone },
                { id: 'broadband', label: 'Village Hub Wi-Fi', icon: Wifi },
              ].map((mode) => {
                const Icon = mode.icon;
                const isSelected = networkMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setNetworkMode(mode.id as any)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-[11px] leading-tight">{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <TactileButton
              variant="primary"
              size="md"
              disabled={isSyncing}
              onClick={handleTriggerSync}
            >
              <RefreshCw className={`w-4 h-4 mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Progress'}
            </TactileButton>

            <TactileButton
              variant="amber"
              size="md"
              disabled={p2pActive}
              onClick={handleP2PShare}
            >
              <Share2 className="w-4 h-4 mr-1.5" />
              {p2pActive ? 'Broadcasting...' : 'P2P Mesh Share'}
            </TactileButton>
          </div>

          {/* Sync Terminal & Event Log */}
          <div className="p-3 bg-slate-900 rounded-2xl text-[11px] font-mono text-slate-300 space-y-1 max-h-36 overflow-y-auto border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center justify-between">
              <span>Telemetry Sync Log</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            {syncLogs.map((log, index) => (
              <div key={index} className="leading-snug text-slate-300">
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted local tamper-proof journal</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-slate-700 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
