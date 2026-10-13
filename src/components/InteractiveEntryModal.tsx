import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Coins,
  Lock,
  UserCheck,
  Calendar,
  Check,
  Ban,
  Trash2,
} from 'lucide-react';
import { CheckinSession, UserRole, BillingMode } from '../types';
import { calculateDurationHours, formatTHB } from '../utils';
import { PASTEL_PALETTE } from '../colorPalettes';
import { Locale, modalTranslations, formatDateByLocale, getPartnerName, translateVenueMode } from '../i18n';

interface InteractiveEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: CheckinSession | null; // null if creating new
  initialDate?: string;
  defaultSubject?: string;
  defaultHourlyRate?: number;
  currentRole: UserRole;
  isAuditObserverMode?: boolean; // When in strict Read-Only Audit Mode
  hostName: string;
  clientName: string;
  onSaveSession: (session: CheckinSession) => void;
  onVerifySession: (sessionId: string) => void;
  onRejectSession: (sessionId: string, reason: string) => void;
  onDeleteSession: (sessionId: string) => void;
  locale?: Locale;
}

export const InteractiveEntryModal: React.FC<InteractiveEntryModalProps> = ({
  isOpen,
  onClose,
  session,
  initialDate,
  defaultSubject,
  defaultHourlyRate,
  currentRole,
  isAuditObserverMode = false,
  hostName,
  clientName,
  onSaveSession,
  onVerifySession,
  onRejectSession,
  onDeleteSession,
  locale = 'th',
}) => {
  const mt = modalTranslations[locale];
  const isEditing = Boolean(session);
  const isObserver = currentRole === 'observer' || isAuditObserverMode;
  const isClient = currentRole === 'client';

  const defaultVenue = locale === 'th' ? 'On-site / หน้างาน' : 'On-site / Venue';
  const [date, setDate] = useState('2026-10-13');
  const [subject, setSubject] = useState(defaultSubject || 'ฟิสิกส์ ม.4');
  const [studentName, setStudentName] = useState(getPartnerName(clientName, locale));
  const [roomFormat, setRoomFormat] = useState(defaultVenue);
  const [billingMode, setBillingMode] = useState<BillingMode>('duration');
  const [startTime, setStartTime] = useState('16:00');
  const [endTime, setEndTime] = useState('18:00');
  const [quantityUnits, setQuantityUnits] = useState(1);
  const [hourlyRate, setHourlyRate] = useState(defaultHourlyRate || 500);
  const [isFinancialCalculated, setIsFinancialCalculated] = useState(true);
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState<string>('indigo');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  useEffect(() => {
    if (session) {
      setDate(session.date);
      setSubject(session.topic?.[locale] || session.title?.[locale] || session.subject || '');
      setStudentName(
        session.partnerName?.[locale] ||
        session.studentNameBilingual?.[locale] ||
        getPartnerName(session.studentName || clientName, locale)
      );
      setRoomFormat(translateVenueMode(session.roomFormat, locale));
      setBillingMode(session.billingMode);
      setStartTime(session.startTime);
      setEndTime(session.endTime);
      setQuantityUnits(session.quantityUnits || 1);
      setHourlyRate(session.hourlyRate);
      setIsFinancialCalculated(session.isFinancialCalculated);
      setNotes(session.subtext?.[locale] || session.notesBilingual?.[locale] || session.notes || '');
      setColor(session.color || 'indigo');
      setShowRejectInput(false);
      setRejectReason(session.rejectionReason || '');
    } else {
      setDate(initialDate || '2026-10-13');
      setSubject(defaultSubject || (locale === 'th' ? 'ฟิสิกส์ ม.4' : 'Physics G10'));
      setStudentName(getPartnerName(clientName, locale));
      setRoomFormat(defaultVenue);
      setBillingMode('duration');
      setStartTime('16:00');
      setEndTime('18:00');
      setQuantityUnits(1);
      setHourlyRate(defaultHourlyRate || 500);
      setIsFinancialCalculated(true);
      setNotes('');
      setColor('indigo');
      setShowRejectInput(false);
      setRejectReason('');
    }
  }, [session, initialDate, isOpen, clientName, defaultSubject, defaultHourlyRate, locale, defaultVenue]);

  // Synchronize roomFormat venue mode if locale changes while modal is active
  useEffect(() => {
    setRoomFormat((prev) => translateVenueMode(prev, locale));
  }, [locale]);

  if (!isOpen) return null;

  // Auto-calculated duration
  const autoDuration = calculateDurationHours(startTime, endTime);
  const calculatedTotal = isFinancialCalculated
    ? billingMode === 'duration'
      ? Math.round(autoDuration * hourlyRate)
      : Math.round(quantityUnits * hourlyRate)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isObserver) return;

    const trimmedSubject = subject.trim() || (locale === 'th' ? 'รายการเช็กอิน' : 'Check-in Item');
    const trimmedNotes = notes.trim();

    const newOrUpdatedSession: CheckinSession = {
      id: session ? session.id : `chk-${Date.now()}`,
      roomId: session?.roomId,
      memberId: session?.memberId,
      date,
      subject: trimmedSubject,
      topic: session?.topic
        ? { ...session.topic, [locale]: trimmedSubject }
        : { th: trimmedSubject, en: trimmedSubject },
      title: session?.title
        ? { ...session.title, [locale]: trimmedSubject }
        : { th: trimmedSubject, en: trimmedSubject },
      studentName: studentName.trim() || clientName,
      partnerName: session?.partnerName
        ? { ...session.partnerName, [locale]: studentName.trim() || clientName }
        : { th: studentName.trim() || clientName, en: studentName.trim() || clientName },
      studentNameBilingual: session?.studentNameBilingual
        ? { ...session.studentNameBilingual, [locale]: studentName.trim() || clientName }
        : { th: studentName.trim() || clientName, en: studentName.trim() || clientName },
      roomFormat,
      billingMode,
      startTime,
      endTime,
      durationHours: autoDuration,
      quantityUnits,
      hourlyRate: Number(hourlyRate) || 0,
      isFinancialCalculated,
      totalAmount: calculatedTotal,
      status: session ? session.status : 'pending',
      isCheckedIn: session?.isCheckedIn !== undefined ? session.isCheckedIn : true,
      hostLoggedBy: session ? session.hostLoggedBy : hostName,
      verifiedBy: session ? session.verifiedBy : null,
      verifiedAt: session ? session.verifiedAt : null,
      notes: trimmedNotes,
      subtext: session?.subtext
        ? { ...session.subtext, [locale]: trimmedNotes }
        : { th: trimmedNotes, en: trimmedNotes },
      notesBilingual: session?.notesBilingual
        ? { ...session.notesBilingual, [locale]: trimmedNotes }
        : { th: trimmedNotes, en: trimmedNotes },
      color,
    };

    onSaveSession(newOrUpdatedSession);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center font-bold text-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {mt.editCheckinTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {formatDateByLocale(date, locale)} · {translateVenueMode(roomFormat, locale)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Observer Mode Safeguard Banner */}
        {isObserver && (
          <div className="mt-4 p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-2.5 text-xs text-slate-700">
            <Lock className="w-4 h-4 text-slate-500 shrink-0" />
            <span>
              <strong>Read-Only Audit Mode:</strong> {locale === 'th' ? 'ข้อมูลแสดงผลแบบอ่านอย่างเดียว' : 'All check-in data is locked.'}
            </span>
          </div>
        )}

        {/* Client Verification Action Bar */}
        {!isObserver && isClient && session && session.status === 'pending' && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
              <UserCheck className="w-4 h-4 text-slate-600 shrink-0" />
              <span>{locale === 'th' ? 'ตรวจเช็กความถูกต้องของเวลา:' : 'Verify time and details:'}</span>
            </div>

            {!showRejectInput ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onVerifySession(session.id);
                    onClose();
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>{locale === 'th' ? 'ยืนยันข้อมูลถูกต้อง' : 'Verify Record'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectInput(true)}
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium text-xs py-2.5 px-3 rounded-xl transition-colors flex items-center gap-1"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>{locale === 'th' ? 'ขอแก้ไข' : 'Request Edit'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <input
                  type="text"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder={mt.notesPlaceholder}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-slate-400"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRejectInput(false)}
                    className="text-xs text-slate-500 hover:text-slate-700 px-2.5 py-1"
                  >
                    {mt.cancelBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onRejectSession(session.id, rejectReason || 'Request adjustment');
                      onClose();
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-3 py-1.5 rounded-xl font-medium"
                  >
                    {mt.saveBtn}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {mt.dateTimeLabel}
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="date"
                disabled={isObserver || (isClient && isEditing)}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 disabled:bg-slate-100 disabled:text-slate-500 font-mono"
              />
            </div>
          </div>

          {/* Subject & Student Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {mt.topicDetailsLabel}
              </label>
              <input
                type="text"
                disabled={isObserver || (isClient && isEditing)}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                placeholder={mt.topicPlaceholder}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 disabled:bg-slate-100 disabled:text-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {mt.partnerLabel}
              </label>
              <input
                type="text"
                disabled={isObserver || (isClient && isEditing)}
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 disabled:bg-slate-100 disabled:text-slate-500"
              />
            </div>
          </div>

          {/* Room Format */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {mt.locationLabel}
            </label>
            <input
              type="text"
              disabled={isObserver || (isClient && isEditing)}
              value={roomFormat}
              onChange={(e) => setRoomFormat(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>

          {/* Billing Mode Segmented Switch */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {mt.calculationEngineLabel}
            </label>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                disabled={isObserver || (isClient && isEditing)}
                onClick={() => setBillingMode('duration')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  billingMode === 'duration'
                    ? 'bg-white text-indigo-600 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mt.hourlyEngineBtn}
              </button>
              <button
                type="button"
                disabled={isObserver || (isClient && isEditing)}
                onClick={() => setBillingMode('unit')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  billingMode === 'unit'
                    ? 'bg-white text-indigo-600 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mt.unitEngineBtn}
              </button>
            </div>
          </div>

          {/* Time Picker Engine */}
          {billingMode === 'duration' ? (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {mt.startTimeLabel}:
                  </label>
                  <input
                    type="time"
                    disabled={isObserver || (isClient && isEditing)}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {mt.endTimeLabel}:
                  </label>
                  <input
                    type="time"
                    disabled={isObserver || (isClient && isEditing)}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg font-mono focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                <span className="text-slate-500">{mt.durationLabel}:</span>
                <span className="font-mono font-bold text-indigo-600">
                  {autoDuration.toFixed(2)} {locale === 'th' ? 'ชม.' : 'hrs'}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {locale === 'th' ? 'จำนวนหน่วย / ครั้ง (Quantity):' : 'Quantity Units:'}
              </label>
              <input
                type="number"
                min="1"
                step="1"
                disabled={isObserver || (isClient && isEditing)}
                value={quantityUnits}
                onChange={(e) => setQuantityUnits(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg font-mono focus:outline-none"
              />
            </div>
          )}

          {/* Agreed Rate */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {mt.agreedRateLabel}
              </label>
              <div className="relative">
                <Coins className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  min="0"
                  step="20"
                  disabled={isObserver || (isClient && isEditing)}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Calculated Total */}
          <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-slate-600 font-medium block">{mt.totalAmountLabel}:</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-slate-900 font-mono">
                {formatTHB(calculatedTotal)} {locale === 'th' ? 'บาท' : 'THB'}
              </span>
            </div>
          </div>

          {/* Description / Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {mt.descriptionLabel}:
            </label>
            <textarea
              rows={2}
              disabled={isObserver || (isClient && isEditing)}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={mt.notesPlaceholder}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 disabled:bg-slate-100 disabled:text-slate-500 resize-none"
            />
          </div>

          {/* Session Color Picker */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                {mt.sessionColorLabel}
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                {PASTEL_PALETTE.find((p) => p.id === color)?.name || 'Indigo Pastel'}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 w-full py-2">
              {PASTEL_PALETTE.map((swatch) => {
                const isSelected = color === swatch.id;
                return (
                  <button
                    key={swatch.id}
                    type="button"
                    disabled={isObserver || (isClient && isEditing)}
                    onClick={() => setColor(swatch.id)}
                    className={`w-7 h-7 rounded-full border border-slate-200/80 transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-slate-400 scale-105 shadow-xs'
                        : 'hover:scale-105 hover:border-slate-300'
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                    title={swatch.name}
                    aria-label={swatch.name}
                  />
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-100">
            <div>
              {session && !isObserver && !isClient && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(mt.confirmDeleteBody)) {
                      onDeleteSession(session.id);
                      onClose();
                    }
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium p-1.5 rounded-lg hover:bg-rose-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{mt.deleteBtn}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {mt.cancelBtn}
              </button>

              {!isObserver && (!isClient || !isEditing) && (
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  {mt.saveBtn}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
