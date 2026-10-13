import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  KeyRound,
  GraduationCap,
  User,
  Eye,
  Pause,
  Play,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  Plus,
} from 'lucide-react';
import { UserRole, RoomContextData } from '../types';

interface AppHeaderProps {
  activeRoom: RoomContextData;
  rooms: RoomContextData[];
  onSelectRoom: (roomId: string) => void;
  onOpenPasscodeModal: () => void;
  onQuickNewCheckin: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  activeRoom,
  rooms,
  onSelectRoom,
  onOpenPasscodeModal,
  onQuickNewCheckin,
}) => {
  // Focus timer initialized to 01:23:09
  const [seconds, setSeconds] = useState(1 * 3600 + 23 * 60 + 9);
  const [isRunning, setIsRunning] = useState(true);
  const [lang, setLang] = useState<'TH' | 'EN'>('TH');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getRoleBadge = () => {
    switch (activeRoom.currentRole) {
      case 'host':
        return {
          label: 'Host (ผู้สอน/ผู้ให้บริการ)',
          color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: GraduationCap,
        };
      case 'client':
        return {
          label: 'Client (ผู้เรียน/ผู้รับบริการ)',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: User,
        };
      case 'observer':
        return {
          label: 'Observer (ผู้ตรวจการ/ผู้ปกครอง)',
          color: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: Eye,
        };
    }
  };

  const role = getRoleBadge();
  const RoleIcon = role.icon;

  return (
    <header className="bg-white border-b border-slate-200/90 shadow-2xs px-4 sm:px-6 py-3.5 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Branding & Current Room Switcher */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 text-white flex items-center justify-center shadow-xs shrink-0">
            <UserCheck className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-bold text-slate-900 text-base sm:text-lg leading-tight tracking-tight">
                จับคู่เช็คอิน
              </h1>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-full">
                Match Check-in & Revenue Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ระบบจับคู่เช็กอินสองทาง (Mutual Verification) & สรุปค่าตอบแทนสุทธิ
            </p>
          </div>
        </div>

        {/* Right Controls: Room Dropdown, Passcode & Role, Focus Timer, Action Button */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Room Selector Dropdown */}
          <div className="relative">
            <select
              value={activeRoom.roomId}
              onChange={(e) => onSelectRoom(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 pr-8 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              {rooms.map((r) => (
                <option key={r.roomId} value={r.roomId}>
                  {r.roomName} ({r.roomId})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Quick Passcode Chip */}
          <div className="hidden lg:flex items-center gap-2 bg-indigo-50/70 border border-indigo-200/70 text-indigo-800 text-xs px-2.5 py-1 rounded-xl">
            <span className="font-medium text-slate-600">รหัสคู่เช็กอิน:</span>
            <button
              onClick={() => copyText(activeRoom.pairPasscode, 'pair')}
              className="font-mono font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
              title="คลิกเพื่อคัดลอกรหัสคู่เช็กอิน"
            >
              {activeRoom.pairPasscode}
              {copiedKey === 'pair' ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400" />
              )}
            </button>
            <span className="text-indigo-200">|</span>
            <span className="font-medium text-slate-600">ตรวจการ:</span>
            <button
              onClick={() => copyText(activeRoom.observerPasscode, 'obs')}
              className="font-mono font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
              title="คลิกเพื่อคัดลอกรหัสผู้ตรวจการ"
            >
              {activeRoom.observerPasscode}
              {copiedKey === 'obs' ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400" />
              )}
            </button>
          </div>

          {/* Role Pill Button (opens Passcode Modal) */}
          <button
            onClick={onOpenPasscodeModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all shadow-2xs hover:shadow-xs ${role.color}`}
            title="คลิกเพื่อสลับบทบาทหรือกรอก Passcode"
          >
            <RoleIcon className="w-3.5 h-3.5" />
            <span>{role.label}</span>
            <KeyRound className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {/* Running Focus Timer Widget */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700">
            <span className="font-mono tabular-nums font-semibold text-slate-800">
              {formatTimer(seconds)}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
              }`}
            />
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="text-slate-400 hover:text-slate-700"
              title={isRunning ? 'หยุดชั่วคราว' : 'เริ่มต่อ'}
            >
              {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
            <button
              onClick={() => setSeconds(0)}
              className="text-slate-400 hover:text-slate-700"
              title="รีเซ็ตเวลา"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Language Switch */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setLang('TH')}
              className={`px-2 py-1 rounded-lg transition-all ${
                lang === 'TH' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500'
              }`}
            >
              TH
            </button>
            <button
              onClick={() => setLang('EN')}
              className={`px-2 py-1 rounded-lg transition-all ${
                lang === 'EN' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500'
              }`}
            >
              EN
            </button>
          </div>

          {/* Log Session Fast Button */}
          {activeRoom.currentRole !== 'observer' && (
            <button
              onClick={onQuickNewCheckin}
              className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs shadow-indigo-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>บันทึกการสอน</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
