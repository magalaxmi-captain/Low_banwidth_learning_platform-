import React from 'react';
import { Map, Award, Users, User, PlayCircle } from 'lucide-react';
import { ScreenType } from '../types';
import { soundEngine } from '../audio';

interface BottomNavProps {
  activeScreen: ScreenType;
  onChangeScreen: (screen: ScreenType) => void;
  outdoorMode: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeScreen,
  onChangeScreen,
  outdoorMode,
}) => {
  const navItems = [
    {
      id: 'quest' as ScreenType,
      label: 'Map',
      icon: Map,
      badge: null,
    },
    {
      id: 'quiz' as ScreenType,
      label: 'Lesson',
      icon: PlayCircle,
      badge: 'Active',
    },
    {
      id: 'challenges' as ScreenType,
      label: 'Duel',
      icon: Users,
      badge: '3 nearby',
    },
    {
      id: 'profile' as ScreenType,
      label: 'Profile',
      icon: User,
      badge: null,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d1a2d]/98 backdrop-blur-md border-t-2 border-[#1c355c] px-3 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]"
      aria-label="Bottom Navigation"
    >
      <div className="max-w-md mx-auto flex items-center justify-around gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                soundEngine.playTap();
                onChangeScreen(item.id);
              }}
              className={`relative flex-1 py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'text-amber-400 bg-[#162a4a] shadow-[0_3px_0_#0f1f38] scale-105'
                  : 'text-slate-400 hover:text-slate-200 active:scale-95'
              }`}
              aria-label={`Go to ${item.label} screen`}
            >
              {/* Badge if present */}
              {item.badge && !isActive && (
                <span className="absolute -top-1 right-2 bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                  {item.badge}
                </span>
              )}

              {/* Icon with tactile active bounce */}
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#b45309]'
                    : 'bg-transparent text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.5]" />
              </div>

              {/* Label */}
              <span
                className={`text-[11px] font-black mt-1 leading-none tracking-wide ${
                  isActive ? 'text-amber-300' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>

              {/* Active Pip */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
