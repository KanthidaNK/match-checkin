import React, { useState } from 'react';
import { X, KeyRound, Shield, Key, ShieldCheck } from 'lucide-react';
import { RoomContextData } from '../types';
import { Locale, modalTranslations } from '../i18n';

interface JoinPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: RoomContextData[];
  onJoinRoom: (roomId: string, isObserver?: boolean, observerPasscode?: string) => void;
  locale?: Locale;
  isAuditedOnly?: boolean;
  isAuditedDashboardView?: boolean;
}

export const JoinPasscodeModal: React.FC<JoinPasscodeModalProps> = ({
  isOpen,
  onClose,
  rooms,
  onJoinRoom,
  locale = 'th',
  isAuditedOnly = false,
  isAuditedDashboardView = isAuditedOnly,
}) => {
  const mt = modalTranslations[locale];
  const [passcode, setPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = passcode.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMessage(
        isAuditedOnly
          ? locale === 'th'
            ? 'กรุณาระบุรหัสผู้ตรวจการ (AUDIT-xxxx)'
            : 'Please enter an observer passcode (AUDIT-xxxx)'
          : locale === 'th'
          ? 'กรุณาระบุรหัส Passcode'
          : 'Please enter a Passcode'
      );
      return;
    }

    // Check observer key first
    const matchedObserver = rooms.find(
      (r) => r.observerPasscode?.toUpperCase() === cleanCode
    );

    if (matchedObserver) {
      setErrorMessage('');
      onJoinRoom(matchedObserver.roomId, true, matchedObserver.observerPasscode || cleanCode);
      onClose();
      setPasscode('');
      return;
    }

    // If in audited-only mode, do not allow pair passcodes
    if (isAuditedOnly) {
      const isPairCode = rooms.some(
        (r) =>
          r.pairPasscode?.toUpperCase() === cleanCode ||
          r.passcode?.toUpperCase() === cleanCode
      );
      if (isPairCode) {
        setErrorMessage(
          locale === 'th'
            ? 'ไม่พบห้องตรวจ (รหัสนี้สำหรับคู่เช็กอิน ไม่สามารถใช้ในโหมดผู้ตรวจการได้)'
            : 'Audited room not found (This passcode is for check-in partners only)'
        );
      } else {
        setErrorMessage(
          locale === 'th'
            ? 'ไม่พบห้องที่ตรงกับรหัสผู้ตรวจการนี้ หรือรหัสไม่ถูกต้อง (เช่น AUDIT-1001)'
            : 'No room matches this observer passcode or code is invalid (e.g. AUDIT-1001)'
        );
      }
      return;
    }

    // Check pair key or general passcode
    const matchedPair = rooms.find(
      (r) =>
        r.pairPasscode?.toUpperCase() === cleanCode ||
        r.passcode?.toUpperCase() === cleanCode ||
        r.roomId?.toUpperCase() === cleanCode
    );

    if (matchedPair) {
      setErrorMessage('');
      onJoinRoom(matchedPair.roomId, false);
      onClose();
      setPasscode('');
      return;
    }

    setErrorMessage(
      locale === 'th'
        ? 'ไม่พบห้องที่ตรงกับรหัส Passcode นี้ หรือรหัสไม่ถูกต้อง'
        : 'No room matches this passcode or code is invalid'
    );
  };

  const isAuditedView = isAuditedDashboardView || isAuditedOnly;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 shadow-xl space-y-5 animate-in fade-in duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isAuditedView
                  ? locale === 'th'
                    ? 'ใส่ Passcode ผู้ตรวจการ'
                    : 'Enter Auditor Passcode'
                  : mt.enterPasscodeTitle}
              </h3>
              <p className="text-[11px] text-slate-500 font-normal">
                {isAuditedView
                  ? locale === 'th'
                    ? 'กรอกรหัสผู้ตรวจการ (AUDIT-xxxx) เพื่อบันทึกห้องตรวจ'
                    : 'Enter an auditor passcode (AUDIT-xxxx) to save the room'
                  : mt.enterPasscodeDesc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {isAuditedView
                ? locale === 'th'
                  ? 'รหัสผู้ตรวจการ (Observer Passcode)'
                  : 'Observer Passcode'
                : locale === 'th'
                ? 'รหัสผ่านห้อง (Passcode)'
                : 'Room Passcode'}
            </label>
            <input
              type="text"
              autoFocus
              placeholder={
                isAuditedView
                  ? locale === 'th'
                    ? 'เช่น AUDIT-4021'
                    : 'e.g. AUDIT-4021'
                  : mt.passcodePlaceholder
              }
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setErrorMessage('');
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-mono tracking-wider uppercase text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-center"
            />
            {errorMessage && (
              <p className="text-xs text-rose-600 font-medium mt-1.5">{errorMessage}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-xs rounded-xl transition-colors cursor-pointer"
            >
              {mt.cancelBtn}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm transition-colors text-xs cursor-pointer"
            >
              {isAuditedView
                ? locale === 'th'
                  ? 'บันทึกห้องตรวจ'
                  : 'Save Audited Room'
                : mt.joinRoomBtn}
            </button>
          </div>
        </form>

        {/* Render test shortcut chips ONLY when invoked from the Main Landing Page */}
        {!isAuditedDashboardView && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 mb-2">
              {locale === 'th' ? 'คลิกเลือกรหัสทดสอบในระบบ:' : 'Click to test system passcodes:'}
            </p>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {rooms.map((room) => (
                <div key={room.roomId} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-xs">
                  <span className="font-medium text-slate-700 truncate max-w-[170px]">
                    {room.titleBilingual?.[locale] || room.title}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Pair Check-in Passcode Chip */}
                    <button
                      type="button"
                      onClick={() => setPasscode(room.pairPasscode)}
                      className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <KeyRound className="w-2.5 h-2.5 text-slate-400"/>
                      <span>{room.pairPasscode}</span>
                    </button>
                    {/* Observer Passcode Chip */}
                    <button
                      type="button"
                      onClick={() => setPasscode(room.observerPasscode)}
                      className="px-2 py-0.5 rounded-md bg-indigo-50/70 border border-indigo-200 text-[10px] font-mono text-indigo-700 hover:bg-indigo-100 transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <ShieldCheck className="w-2.5 h-2.5 text-indigo-500"/>
                      <span>{room.observerPasscode}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
