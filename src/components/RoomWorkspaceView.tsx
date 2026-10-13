import React, { useState } from 'react';
import {
  FolderOpen,
  CheckCircle2,
  Clock,
  Key,
  Shield,
  Copy,
  Check,
  Edit3,
  Lock,
  ChevronDown,
  Sliders,
} from 'lucide-react';
import { RoomContextData, CheckinSession } from '../types';
import { formatTHB, getRoomDisplayLabel, formatTimeWithDuration } from '../utils';
import { getPastelColor } from '../colorPalettes';
import { SlipPreviewModal } from './SlipPreviewModal';
import {
  Locale,
  translations,
  formatDateByLocale,
  getMonthNameByLocale,
  translateRole,
  translateSessionSubject,
  translateSessionNotes,
  getSessionTopic,
  getSessionSubtext,
} from '../i18n';

interface RoomWorkspaceViewProps {
  room: RoomContextData;
  rooms?: RoomContextData[];
  onSwitchRoom?: (roomId: string) => void;
  sessions: CheckinSession[];
  isObserverMode?: boolean;
  onBackToLanding?: () => void;
  onOpenEditRoom?: () => void;
  onOpenCheckin: (dateStr?: string) => void;
  onSelectSession: (session: CheckinSession) => void;
  onVerifySession: (sessionId: string) => void;
  onSaveSession?: (session: CheckinSession) => void;
  locale: Locale;
}

export const RoomWorkspaceView: React.FC<RoomWorkspaceViewProps> = ({
  room,
  rooms = [],
  onSwitchRoom,
  sessions,
  isObserverMode = false,
  onBackToLanding,
  onOpenEditRoom,
  onOpenCheckin,
  onSelectSession,
  onVerifySession,
  onSaveSession,
  locale,
}) => {
  const t = translations[locale];

  // Dual-Key State & Copy Badges
  const [copiedKey, setCopiedKey] = useState<'pair' | 'observer' | null>(null);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const copyToClipboard = (text: string, type: 'pair' | 'observer') => {
    navigator.clipboard.writeText(text);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const pairKey = room.pairPasscode || room.passcode || 'MATCH-0000';
  const observerKey = room.observerPasscode || 'AUDIT-0000';

  // Strict Read-Only Audit Mode flag
  const isStrictAuditMode =
    Boolean(isObserverMode) ||
    room.currentRole === 'observer' ||
    (room.currentRole as string) === 'audit' ||
    (room as any).isObserver === true;

  // Month navigation (Defaults to October 2026)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 9 = October

  // Toggle Check-in Circle on Date Header Row: ONLY toggles status, NEVER opens modal
  const handleToggleDateOnly = (cell: { dateKey: string; sessions: CheckinSession[] }) => {
    if (isStrictAuditMode) return;
    const existing = cell.sessions[0];
    if (existing) {
      if (existing.status === 'verified' || existing.isCheckedIn === true) {
        const updated: CheckinSession = {
          ...existing,
          status: 'pending',
          isCheckedIn: false,
          verifiedBy: null,
          verifiedAt: null,
        };
        onSaveSession?.(updated);
      } else {
        const updated: CheckinSession = {
          ...existing,
          status: 'verified',
          isCheckedIn: true,
          verifiedBy: room.creator || 'ผู้รับรองสองทาง',
          verifiedAt: new Date().toISOString(),
        };
        onSaveSession?.(updated);
      }
    } else {
      const dur = 2;
      const rate = room.hourlyRate || 500;
      const newSession: CheckinSession = {
        id: `chk-${Date.now()}`,
        roomId: room.roomId,
        date: cell.dateKey,
        subject: room.title || 'รายการเช็กอิน',
        studentName: room.clientName || 'คู่เช็กอิน',
        roomFormat: room.location || 'On-site / หน้างาน',
        billingMode: room.billingMode || 'duration',
        startTime: '16:00',
        endTime: '18:00',
        durationHours: dur,
        quantityUnits: 1,
        hourlyRate: rate,
        isFinancialCalculated: true,
        totalAmount: dur * rate,
        status: 'verified',
        isCheckedIn: true,
        hostLoggedBy: room.creator || 'ผู้บันทึก',
        verifiedBy: room.creator || 'ผู้รับรองสองทาง',
        verifiedAt: new Date().toISOString(),
        color: 'indigo',
        notes: '',
      };
      onSaveSession?.(newSession);
    }
  };

  const handleTodayQuickCheckin = () => {
    if (isStrictAuditMode) return;
    const todayKey = '2026-10-13';
    setCurrentYear(2026);
    setCurrentMonth(9); // October
    const existing = sessions.find(
      (s) => (s.roomId ? s.roomId === room.roomId : room.roomId === 'room-1') && s.date === todayKey
    );
    if (existing) {
      if (existing.status === 'verified' || existing.isCheckedIn === true) {
        const updated: CheckinSession = {
          ...existing,
          status: 'pending',
          isCheckedIn: false,
          verifiedBy: null,
          verifiedAt: null,
        };
        onSaveSession?.(updated);
      } else {
        const updated: CheckinSession = {
          ...existing,
          status: 'verified',
          isCheckedIn: true,
          verifiedBy: room.creator || 'ผู้รับรองสองทาง',
          verifiedAt: new Date().toISOString(),
        };
        onSaveSession?.(updated);
      }
    } else {
      const dur = 2;
      const rate = room.hourlyRate || 500;
      const newSession: CheckinSession = {
        id: `chk-${Date.now()}`,
        roomId: room.roomId,
        date: todayKey,
        subject: room.title || 'รายการเช็กอิน',
        studentName: room.clientName || 'คู่เช็กอิน',
        roomFormat: room.location || 'On-site / หน้างาน',
        billingMode: room.billingMode || 'duration',
        startTime: '16:00',
        endTime: '18:00',
        durationHours: dur,
        quantityUnits: 1,
        hourlyRate: rate,
        isFinancialCalculated: true,
        totalAmount: dur * rate,
        status: 'verified',
        isCheckedIn: true,
        hostLoggedBy: room.creator || 'ผู้บันทึก',
        verifiedBy: room.creator || 'ผู้รับรองสองทาง',
        verifiedAt: new Date().toISOString(),
        color: 'emerald',
        notes: '',
      };
      onSaveSession?.(newSession);
    }
  };

  // Filter sessions for this room
  const roomSessions = sessions.filter((s) => {
    if (s.roomId) {
      return s.roomId === room.roomId;
    }
    return room.roomId === 'room-1';
  });

  const todayKey = '2026-10-13';
  const todaySession = roomSessions.find((s) => s.date === todayKey);
  const isTodayChecked = (todaySession?.isCheckedIn === true || todaySession?.status === 'verified') && todaySession?.isCheckedIn !== false;

  // Filter by current month and sort strictly by Date in Ascending order
  const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
  const monthlySessions = roomSessions
    .filter((s) => s.date.startsWith(monthString))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Enforce strict checked-in filtering for summary ledger and export canvas
  const activeCheckedSessions = monthlySessions.filter(
    (s) => (s.isCheckedIn === true || s.status === 'verified') && s.isCheckedIn !== false
  );

  // Compute stats mathematically synchronized strictly with activeCheckedSessions
  const totalHours = activeCheckedSessions.reduce(
    (acc, s) => acc + (s.billingMode === 'duration' ? s.durationHours : s.quantityUnits),
    0
  );
  const totalAmount = activeCheckedSessions.reduce(
    (acc, s) => acc + (s.isFinancialCalculated ? s.totalAmount : 0),
    0
  );

  // Month grid computation
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
  const gridCells = [];

  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - firstDayOfMonth + 1;
    const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;

    if (isCurrentMonth) {
      const dayStr = dayNumber.toString().padStart(2, '0');
      const dateKey = `${monthString}-${dayStr}`;
      const daySessions = monthlySessions.filter((s) => s.date === dateKey);
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

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const formattedMonthYearHeader = `${getMonthNameByLocale(currentMonth, locale, true)} ${
    locale === 'th' ? currentYear + 543 : currentYear
  }`;

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6 animate-in fade-in duration-150">
      {/* 1. In-Room Header with Dual-Key Badges & Clean Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        {/* Top Header Bar: Clean Status Tag & Dual-Key Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>
              {locale === 'th'
                ? 'พื้นที่ทำงานห้องเช็กอินสองทาง (Active Match Workspace)'
                : 'Active Dual Check-in Workspace'}
            </span>
          </div>

          {/* Dual-Key Badges (Pair code strictly masked in Observer Mode) */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Key Badge 1: Pair Passcode - Hidden in Observer Mode */}
            {!isStrictAuditMode && (
              <button
                onClick={() => copyToClipboard(pairKey, 'pair')}
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                title={locale === 'th' ? 'คลิกเพื่อคัดลอกรหัสคู่เช็กอิน' : 'Click to copy pair code'}
              >
                <Key className="w-3.5 h-3.5 text-slate-600" />
                <span>{locale === 'th' ? 'รหัสคู่เช็กอิน:' : 'Pair Code:'}</span>
                <span className="font-mono font-bold text-slate-900">{pairKey}</span>
                {copiedKey === 'pair' ? (
                  <Check className="w-3 h-3 text-slate-900" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400" />
                )}
              </button>
            )}

            {/* Key Badge 2: Observer Passcode */}
            <button
              onClick={() => copyToClipboard(observerKey, 'observer')}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              title={locale === 'th' ? 'คลิกเพื่อคัดลอกรหัสผู้ตรวจการ' : 'Click to copy observer code'}
            >
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              <span>{locale === 'th' ? 'รหัสผู้ตรวจการ:' : 'Observer Code:'}</span>
              <span className="font-mono font-bold text-slate-900">{observerKey}</span>
              {copiedKey === 'observer' ? (
                <Check className="w-3 h-3 text-slate-900" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Room Title, Location, and Workspace Room Selector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            {/* Line 1: Work Title / Subject + Role Badge */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {room.titleBilingual?.[locale] || room.title}
              </h2>
              <span className="bg-indigo-50 text-indigo-600 border border-indigo-100/80 text-xs font-medium px-2.5 py-0.5 rounded-lg shadow-none">
                {translateRole(room.currentRoleLabel, locale)}
              </span>
              {(room.subtitleBilingual?.[locale] || room.workTypeBilingual?.[locale] || room.workType) && (
                <span className="text-xs text-slate-500">
                  {room.subtitleBilingual?.[locale] || `· ${room.workTypeBilingual?.[locale] || room.workType}`}
                </span>
              )}
            </div>
            {/* Line 2: Creator & Capacity */}
            <div className="text-xs text-slate-500 font-medium mt-1">
              {t.creator}: {room.creatorBilingual?.[locale] || room.creator || (locale === 'th' ? 'Kanthida (คุณ)' : 'Kanthida (You)')} ({room.capacityText || (locale === 'th' ? '2 สมาชิก' : '2 Members')})
            </div>
            {/* Line 3: Location */}
            <div className="text-xs text-slate-400 mt-0.5">
              {t.location}: {room.locationBilingual?.[locale] || room.location}
            </div>
          </div>

          {/* Workspace Room Selector - Strictly isolate Observer Mode: completely hidden from DOM */}
          {!isStrictAuditMode && (
            <div className="flex items-center gap-2 justify-end w-full sm:w-auto self-end lg:self-auto shrink-0">
              <span className="text-xs text-slate-700 font-semibold shrink-0">
                {t.roomList}
              </span>
              <div className="w-64 max-w-[260px]">
                <select
                  value={room.roomId}
                  onChange={(e) => onSwitchRoom?.(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer shadow-2xs truncate"
                >
                  {(rooms && rooms.length > 0 ? rooms : [room]).map((r) => (
                    <option key={r.roomId} value={r.roomId} className="truncate">
                      {r.titleBilingual?.[locale] || getRoomDisplayLabel(r, locale)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar / Mode Banner */}
        {isStrictAuditMode ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-100 border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl text-xs font-medium">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-600 shrink-0" />
              <span>
                <strong>
                  {locale === 'th' ? 'โหมดผู้ตรวจการ (Read-Only Audit Mode):' : 'Observer Audit Mode:'}
                </strong>{' '}
                {locale === 'th'
                  ? 'ข้อมูลทั้งหมดถูกล็อกแบบอ่านอย่างเดียว เพื่อการตรวจสอบเวลาและสถิติ'
                  : 'All check-in data is locked in read-only mode.'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="h-8 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shrink-0 self-start sm:self-auto"
            >
              <span>{t.saveAsImage}</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="text-xs text-slate-500">
              {locale === 'th'
                ? `คุณกำลังทำงานในโหมดเจ้าของสิทธิ์ ${room.creator || 'คุณ'}`
                : `Active as owner: ${room.creator || 'You'}`}
            </div>
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
              {/* Button 1: Save as Image */}
              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                className="h-8 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
              >
                <span>{t.saveAsImage}</span>
              </button>

              {/* Button 2: Check In Today / Checked In Today */}
              <button
                type="button"
                onClick={handleTodayQuickCheckin}
                className={
                  isTodayChecked
                    ? 'h-8 px-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium flex items-center gap-1.5 transition-all shadow-none cursor-pointer'
                    : 'h-8 px-3 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition-all shadow-none cursor-pointer'
                }
              >
                {isTodayChecked ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span>{isTodayChecked ? t.checkedInToday : t.checkinToday}</span>
              </button>

              {/* Button 3: Edit Check-in */}
              <div className="relative inline-flex items-center shrink-0">
                <div className="inline-flex rounded-xl shadow-sm h-8">
                  <button
                    onClick={() => onOpenCheckin('2026-10-13')}
                    className="h-8 px-3 rounded-l-xl text-xs font-medium flex items-center gap-1.5 justify-center transition-all shadow-sm cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t.editCheckin}</span>
                  </button>
                  {onOpenEditRoom && (
                    <button
                      onClick={() => setIsActionMenuOpen((prev) => !prev)}
                      className="h-8 px-2 rounded-r-xl border-l border-indigo-500/60 flex items-center justify-center transition-colors cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white"
                      title={locale === 'th' ? 'ตัวเลือกเพิ่มเติม' : 'More options'}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Dropdown Menu */}
                {isActionMenuOpen && onOpenEditRoom && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setIsActionMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                      <button
                        onClick={() => {
                          setIsActionMenuOpen(false);
                          onOpenCheckin('2026-10-13');
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                        <div>
                          <div className="text-slate-900 font-semibold">{t.editCheckin}</div>
                          <div className="text-[10px] text-slate-400">
                            {locale === 'th' ? 'บันทึกหรือปรับปรุงเวลาเช็กอิน' : 'Log or edit session records'}
                          </div>
                        </div>
                      </button>
                      <div className="my-1 border-t border-slate-100" />
                      <button
                        onClick={() => {
                          setIsActionMenuOpen(false);
                          onOpenEditRoom();
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Sliders className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        <div>
                          <div className="text-slate-900 font-semibold">
                            {locale === 'th' ? 'แก้ไขข้อมูลห้องและรหัส' : 'Edit Room & Passcodes'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {locale === 'th' ? 'ชื่อห้อง อัตราค่าบริการ Passcode' : 'Room title, rate, passcodes'}
                          </div>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Month Controls & Metric Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Month Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              {locale === 'th' ? 'เดือนก่อนหน้า' : 'Prev'}
            </button>
            <div className="px-3 py-1 font-bold text-slate-900 text-base min-w-[170px] text-center">
              {formattedMonthYearHeader}
            </div>
            <button
              onClick={handleNextMonth}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              {locale === 'th' ? 'เดือนถัดไป' : 'Next'}
            </button>
          </div>

          {/* Metric Overview (3 Cards) */}
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              {t.recordedSessions(activeCheckedSessions.length)}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              {t.totalHours(totalHours.toFixed(1))}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-semibold text-slate-900">
              {t.netTotal(formatTHB(totalAmount))}
            </div>
          </div>
        </div>

        {/* 3. Calendar Grid */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 bg-slate-100 border-b border-slate-200 text-center py-2 text-xs font-semibold text-slate-600">
            {t.weekDays.map((day, idx) => (
              <div key={idx}>{day}</div>
            ))}
          </div>

          {/* Month Days */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-200 bg-white">
            {gridCells.map((cell, idx) => {
              if (!cell.isCurrentMonth) {
                return (
                  <div key={idx} className="min-h-[110px] bg-slate-50/50 p-2 text-slate-300 text-xs" />
                );
              }

              const hasSessions = cell.sessions.length > 0;
              const isCellChecked = cell.sessions.some(
                (s) => (s.isCheckedIn === true || s.status === 'verified') && s.isCheckedIn !== false
              );

              return (
                <div
                  key={idx}
                  className={`min-h-[110px] p-1.5 flex flex-col justify-between bg-white transition-colors ${
                    cell.isToday ? 'ring-1 ring-inset ring-indigo-400 bg-indigo-50/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between px-1 mb-1">
                    <span
                      className={`text-xs font-mono font-medium ${
                        cell.isToday
                          ? 'w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]'
                          : 'text-slate-700'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {!isStrictAuditMode && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleDateOnly(cell);
                        }}
                        className={`w-4 h-4 rounded-full border border-slate-300 hover:border-sky-500 cursor-pointer flex items-center justify-center transition-all shrink-0 ${
                          isCellChecked
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'bg-white/80'
                        }`}
                        title={isCellChecked ? 'เช็กอินแล้ว' : 'คลิกเพื่อเช็กอิน'}
                      >
                        {isCellChecked && (
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        )}
                      </button>
                    )}
                  </div>

                  {hasSessions ? (
                    <div className="space-y-1 flex-1 flex flex-col justify-start">
                      {cell.sessions.map((s) => {
                        const pastel = getPastelColor(s.color);
                        return (
                          <div
                            key={s.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectSession(s);
                            }}
                            className={`rounded-xl p-2 cursor-pointer transition-all flex flex-col justify-between border shadow-2xs ${pastel.bgClass} ${pastel.borderClass} ${pastel.textClass} hover:opacity-90`}
                          >
                            <div className="text-xs font-semibold leading-tight line-clamp-1">
                              {s.topic?.[locale] || s.title?.[locale] || getSessionTopic(s, locale)}
                            </div>
                            <div className="whitespace-nowrap text-[11px] font-medium opacity-90 mt-0.5">
                              {formatTimeWithDuration(s.startTime, s.endTime, s.durationHours, locale)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Session Logs Detail Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {locale === 'th' ? 'รายการบันทึกเวลา' : 'Session Logs'} ({activeCheckedSessions.length})
            </h3>
            <p className="text-xs text-slate-500">
              {locale === 'th'
                ? `บันทึกเวลาและตรวจสอบการเช็กอินสองทางของ ${room.titleBilingual?.[locale] || room.title}`
                : `Dual check-in logs and verification records for ${room.titleBilingual?.[locale] || room.title}`}
            </p>
          </div>
        </div>

        {activeCheckedSessions.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
            {locale === 'th'
              ? 'ยังไม่มีรายการบันทึกเวลาที่เช็กอินแล้วในเดือนนี้สำหรับห้องนี้'
              : 'No verified check-in session records for this month.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-semibold">
                  <th className="py-2.5 px-3 text-center">{t.colNo}</th>
                  <th className="py-2.5 px-3">{t.colDate}</th>
                  <th className="py-2.5 px-3">{t.colTopic}</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">{t.colTime}</th>
                  <th className="py-2.5 px-3">{t.colDuration}</th>
                  <th className="py-2.5 px-3">{t.colRate}</th>
                  <th className="py-2.5 px-3">{t.colTotal}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeCheckedSessions.map((s, idx) => {
                  return (
                    <tr
                      key={s.id}
                      onClick={() => onSelectSession(s)}
                      className="cursor-pointer hover:bg-slate-50/60 transition-colors group"
                    >
                      <td className="py-3 px-3 text-center font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3 font-mono font-medium text-slate-900 whitespace-nowrap">
                        {formatDateByLocale(s.date, locale)}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {s.topic?.[locale] || s.title?.[locale] || getSessionTopic(s, locale)}
                        </div>
                        {(s.subtext?.[locale] || s.notesBilingual?.[locale] || s.notes) && (
                          <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {s.subtext?.[locale] || s.notesBilingual?.[locale] || getSessionSubtext(s, locale)}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono whitespace-nowrap text-[11px] font-medium text-slate-700/90">
                        {formatTimeWithDuration(s.startTime, s.endTime, s.durationHours, locale)}
                      </td>
                      <td className="py-3 px-3 font-mono whitespace-nowrap">
                        {s.durationHours} {locale === 'th' ? 'ชม.' : 'hrs'}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-900 whitespace-nowrap">
                        {s.hourlyRate ? `${formatTHB(s.hourlyRate)}` : '-'}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-900 whitespace-nowrap">
                        {s.isFinancialCalculated ? `${formatTHB(s.totalAmount)}` : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Check-in Summary Sheet Export Modal & Canvas Engine */}
      <SlipPreviewModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        sessions={activeCheckedSessions}
        roomData={room}
        monthName={getMonthNameByLocale(currentMonth, locale, true)}
        yearBE={locale === 'th' ? currentYear + 543 : currentYear}
        locale={locale}
      />
    </div>
  );
};
