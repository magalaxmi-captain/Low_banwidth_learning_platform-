import React from 'react';
import { X, Palette, Smartphone, Volume2, ShieldCheck, WifiOff, Sparkles, Check } from 'lucide-react';

interface DesignSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignSystemModal: React.FC<DesignSystemModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-[#0f1f38] border-2 border-amber-400 rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto text-white">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
          <div className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-amber-400" />
            <h3 className="text-lg font-black text-white">
              Design System & Accessibility Specs
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          {/* Color Palette */}
          <div>
            <h4 className="font-black text-amber-300 text-sm mb-2 uppercase tracking-wide">
              1. Accessible Color Tokens
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-[#0b1626] border border-slate-700 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-[#0b1626] border border-white"></span>
                <div>
                  <span className="font-black text-white block">Deep Navy Blue</span>
                  <span className="text-[10px] text-slate-400">#0b1626 (Backgrounds)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#142540] border border-slate-700 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-[#f59e0b]"></span>
                <div>
                  <span className="font-black text-white block">Warm Amber/Gold</span>
                  <span className="text-[10px] text-slate-400">#f59e0b (Streaks, CTAs)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#142540] border border-slate-700 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-[#10b981]"></span>
                <div>
                  <span className="font-black text-white block">Emerald Green</span>
                  <span className="text-[10px] text-slate-400">#10b981 (Success, Checks)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#142540] border border-slate-700 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-[#334155]"></span>
                <div>
                  <span className="font-black text-white block">Soft Slate Gray</span>
                  <span className="text-[10px] text-slate-400">#334155 (Cards, Locked)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Low Bandwidth & Offline Strategy */}
          <div>
            <h4 className="font-black text-emerald-400 text-sm mb-2 uppercase tracking-wide flex items-center gap-1.5">
              <WifiOff className="w-4 h-4" />
              <span>2. Low-Bandwidth & Offline Architecture</span>
            </h4>
            <ul className="space-y-1.5 list-disc list-inside bg-[#142540] p-3 rounded-2xl border border-slate-700">
              <li>
                <strong className="text-white">Pure Vector & SVG:</strong> 0 heavy PNG/JPEG downloads; all learning aids and quest nodes use responsive SVG code.
              </li>
              <li>
                <strong className="text-white">Zero-Asset Audio:</strong> Built-in Web Audio API frequency synthesis for game chimes (0 KB network overhead).
              </li>
              <li>
                <strong className="text-white">Local-First Persistence:</strong> Lessons, badges, and streaks cache in local device storage.
              </li>
              <li>
                <strong className="text-white">Batch Mesh Sync:</strong> Minimal JSON packets sync over Wi-Fi Direct or classroom Bluetooth without cell data.
              </li>
            </ul>
          </div>

          {/* Accessibility & Low Digital Literacy */}
          <div>
            <h4 className="font-black text-amber-300 text-sm mb-2 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>3. Low Digital Literacy Principles</span>
            </h4>
            <ul className="space-y-1.5 list-disc list-inside bg-[#142540] p-3 rounded-2xl border border-slate-700">
              <li>
                <strong className="text-white">Tactile Chunky 3D Buttons:</strong> 4px bevel and drop shadow immediately signal tapability to novice users.
              </li>
              <li>
                <strong className="text-white">Auditory Assistance:</strong> Universal TTS Audio Play button reads every question aloud for early readers and ESL pupils.
              </li>
              <li>
                <strong className="text-white">Outdoor High-Contrast:</strong> Thick borders and vivid contrast ratio exceeding WCAG AAA (7:1) for bright outdoor solar glare.
              </li>
              <li>
                <strong className="text-white">Obvious Next Step:</strong> Glowing amber pulse and floating "START" badge remove decision fatigue.
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full btn-chunky-amber py-3 rounded-xl font-black text-sm text-slate-950"
        >
          Close Design System Specs
        </button>
      </div>
    </div>
  );
};
