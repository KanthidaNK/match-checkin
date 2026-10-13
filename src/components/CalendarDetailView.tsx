import React, { useState } from 'react';
import {
  UserCheck,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Camera,
  FileText,
  Copy,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { RoomContextData, CheckinSession, UserRole } from '../types';
import { THAI_DAYS_SHORT, THAI_MONTHS, toThaiYear, formatTHB, formatTimeWithDuration } from '../utils';
import { getPastelColor } from '../colorPalettes';

interface CalendarDetailViewProps {
  room: RoomContextData;
  sessions: CheckinSession[];
  onSelectDate: (dateString: string) => void;
  onSelectSession: (session: CheckinSession) => void;
  onQuickCheckinToday: () => void;
  onExportPng: () => void;
  onGoToLedger: () => void;
  currentRole: UserRole;
}

export const CalendarDetailView: React.FC<CalendarDetailViewProps> = ({
  room,
  sessions,
  onSelectDate,
  onSelectSession,
  onQuickCheckinToday,
  onExportPng,
  onGoToLedger,
  currentRole,
}) => {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // October
  const [isCheckinEnabled, setIsCheckinEnabled] = useState(true);
  const [copiedKey, setCopiedKey] = useState(false);

  const copyPasscode = () => {
    navigator.clipboard.writeText(room.pairPasscode);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Month grid computation
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
  const gridCells = [];

  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - firstDayOfMonth + 1;
    const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;

    if (isCurrentMonth) {
      const monthStr = (currentMonth + 1).toString().padStart(2, '0');
      const dayStr = dayNumber.toString().padStart(2, '0');
      const dateKey = `${currentYear}-${monthStr}-${dayStr}`;
      const daySessions = sessions.filter((s) => s.date === dateKey);
      const isToday = currentYear === 2026 && currentMonth === 9 && dayNumber === 13;

      gridCells.push({
        dayNumber,
        dateKey,
        isCurrentMonth: true,
        isToday,
        sessions: daySessions,
      });
    } else {
      gridCells.push({
        dayNumber: 0,
        dateKey: '',
        isCurrentMonth: false,
        isToday: false,
        sessions: [],
      });
    }
  }

  // Stats
  const verifiedCount = sessions.filter((s) => s.status === 'verified').length;
  const pendingCount = sessions.filter((s) => s.status === 'pending').length;
  const totalCount = sessions.length;
  const percentCompleted = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

  const currentThaiYear = toThaiYear(currentYear);
  const currentMonthName = THAI_MONTHS[currentMonth];

  return (
    <div className="space-y-6">
      {/* 1. Project Detail Header matching Screenshot 09.36.01 */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        {/* Title, Icon, Passcode */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {/* Match Check-in symbol in soft box */}
            <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                  {room.roomName}
                </h1>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>กำลังดำเนินการ</span>
                </span>
              </div>

              {/* Passcode Chip */}
              <div className="flex items-center gap-2 pt-0.5">
                <span className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-200/70 text-indigo-700 font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg">
                  Passcode: {room.pairPasscode}
                  <button onClick={copyPasscode} className="hover:text-indigo-900 ml-1">
                    {copiedKey ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <button className="p-1.5 hover:text-slate-700 hover:bg-slate-50 rounded-lg">
              <Pencil className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subtitle description */}
        <p className="text-xs sm:text-sm text-slate-500">
          ระบบติดตามและสรุปค่าสอนอัจฉริยะ พร้อมระบบการยืนยันสองทาง (Mutual Verification)
        </p>

        {/* Meta Chips Strip */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 pt-1">
          <span className="bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg">
            ผู้สอน/ผู้ให้บริการ: <strong>{room.hostName}</strong>
          </span>
          <span className="bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg">
            คู่เช็กอิน: <strong>{room.clientName}</strong>
          </span>
          <span className="bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>รอบเดือน: ตุลาคม 2569 (31 วัน)</span>
          </span>
        </div>

        {/* Action Controls & Fast Check-in Button */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl font-medium text-slate-600">
              รอบเช็กอิน (7 วัน)
            </span>

            {/* Toggle: เปิดเช็กอิน */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1 rounded-xl text-xs">
              <span className="text-slate-600 font-medium">เปิดเช็กอิน</span>
              <button
                type="button"
                onClick={() => setIsCheckinEnabled(!isCheckinEnabled)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  isCheckinEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition ${
                    isCheckinEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Prominent Check-in Button */}
          {currentRole !== 'observer' && (
            <button
              onClick={onQuickCheckinToday}
              className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm shadow-indigo-200"
            >
              <UserCheck className="w-4 h-4" />
              <span>เช็กอินวันนี้ทันที</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Deliverables Donut Card matching Screenshot 09.36.01 */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="font-bold text-slate-900 text-sm">
              ความสำเร็จของการเช็กอิน / งานส่งมอบ (Deliverables)
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            อนุมัติแล้ว {verifiedCount} / {totalCount}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center py-4">
          {/* Donut Ring */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#F1F5F9" strokeWidth="10" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#10B981"
                strokeWidth="10"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * percentCompleted) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-[11px] text-slate-400 font-medium block">อนุมัติแล้ว {verifiedCount}</span>
              <span className="text-2xl font-black text-slate-900 font-mono">{percentCompleted}%</span>
              <span className="block text-[10px] text-slate-500 font-medium">งานส่งมอบ</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>{verifiedCount} อนุมัติแล้ว (Mutual Verified)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>{pendingCount} รอยืนยัน</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span>0 กำลังแก้ไข</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 7x5 Month Calendar Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        {/* Month Selector Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
              <button
                onClick={() => setCurrentMonth((m) => (m === 0 ? 11 : m - 1))}
                className="p-1 rounded-lg text-slate-600 hover:text-slate-900"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-0.5 font-bold text-slate-900 text-sm min-w-[120px] text-center">
                {currentMonthName} {currentThaiYear}
              </span>
              <button
                onClick={() => setCurrentMonth((m) => (m === 11 ? 0 : m + 1))}
                className="p-1 rounded-lg text-slate-600 hover:text-slate-900"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => {
                setCurrentYear(2026);
                setCurrentMonth(9);
              }}
              className="text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5"
            >
              วันนี้
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onGoToLedger}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50/70 border border-indigo-200 px-3 py-1.5 rounded-xl"
            >
              ดูบัญชีค่าตอบแทน
            </button>
          </div>
        </div>

        {/* Day Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-semibold text-slate-400 py-1">
          {THAI_DAYS_SHORT.map((d, i) => (
            <div key={d} className={i === 0 || i === 6 ? 'text-rose-500' : 'text-slate-500'}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {gridCells.map((cell, idx) => {
            if (!cell.isCurrentMonth) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[85px] sm:min-h-[115px] rounded-xl bg-slate-50/40 border border-slate-100 p-1.5 opacity-30 select-none"
                />
              );
            }

            return (
              <div
                key={cell.dateKey}
                onClick={() => {
                  if (currentRole !== 'observer') onSelectDate(cell.dateKey);
                }}
                className={`min-h-[85px] sm:min-h-[115px] rounded-xl p-1.5 sm:p-2 border transition-all flex flex-col justify-between ${
                  cell.isToday
                    ? 'border-indigo-500 bg-indigo-50/25 ring-1 ring-indigo-400/80'
                    : 'border-slate-200/80 bg-white hover:border-indigo-200 hover:bg-slate-50/50'
                } ${currentRole !== 'observer' ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-semibold flex items-center justify-center w-5 h-5 rounded-full ${
                      cell.isToday ? 'bg-indigo-600 text-white font-bold' : 'text-slate-700'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>
                </div>

                {/* Session pills */}
                <div className="space-y-1 overflow-y-auto max-h-[85px]">
                  {cell.sessions.map((s) => {
                    const pastel = getPastelColor(s.color);
                    return (
                      <div
                        key={s.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSession(s);
                        }}
                        style={{
                          backgroundColor: pastel.hex,
                          borderColor: pastel.borderHex,
                          color: pastel.textHex,
                        }}
                        className="rounded-xl p-2 mx-0.5 my-0.5 border shadow-sm transition-all flex flex-col justify-between cursor-pointer hover:shadow-md hover:brightness-95"
                        title={`${s.subject} (${s.startTime} - ${s.endTime})`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div className="text-xs font-semibold leading-tight line-clamp-1">
                            {s.subject}
                          </div>
                          <span
                            className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center shrink-0 ${
                              s.status === 'verified'
                                ? 'border-emerald-500 bg-emerald-500 text-white'
                                : 'border-slate-300 bg-white/80'
                            }`}
                            title={s.status === 'verified' ? 'รับรองแล้ว' : 'รอยืนยัน'}
                          >
                            {s.status === 'verified' && (
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            )}
                          </span>
                        </div>
                        <div className="whitespace-nowrap text-[11px] font-medium text-slate-700/90 mt-0.5">
                          {formatTimeWithDuration(s.startTime, s.endTime, s.durationHours)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Export Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-slate-500 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-indigo-600" />
          ระบบจับคู่เช็กอินสองทาง (Mutual Verification) ช่วยยืนยันเวลาสอนถูกต้อง ป้องกันข้อผิดพลาด
        </span>

        <button
          onClick={onExportPng}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm transition-colors px-4 py-2 text-xs flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          <span>บันทึกปฏิทินเป็นรูปภาพ (PNG)</span>
        </button>
      </div>
    </div>
  );
};
