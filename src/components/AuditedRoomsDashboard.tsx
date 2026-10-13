import React, { useState } from 'react';
import { ShieldCheck, KeyRound, Trash2, X, Search, Handshake } from 'lucide-react';
import { RoomContextData, AuditedRoomRecord } from '../types';
import { Locale, translations, modalTranslations } from '../i18n';
import { RoomCard } from './RoomCard';

interface AuditedRoomsDashboardProps {
  rooms: RoomContextData[];
  auditedRecords: AuditedRoomRecord[];
  locale: Locale;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onBackToMyRooms?: () => void;
  onSelectRoom: (roomId: string, isObserver?: boolean) => void;
  onOpenPasscodeModal?: () => void;
  onEditCustomTitle?: (room: RoomContextData) => void;
  onRemoveAuditedRoom?: (roomId: string) => void;
  onUpdateAuditColor?: (roomId: string, colorId: string) => void;
}

export const AuditedRoomsDashboard: React.FC<AuditedRoomsDashboardProps> = ({
  rooms,
  auditedRecords,
  locale,
  searchQuery = '',
  onSearchChange,
  onSelectRoom,
  onOpenPasscodeModal,
  onEditCustomTitle,
  onRemoveAuditedRoom,
  onUpdateAuditColor,
}) => {
  const t = translations[locale];
  const mt = modalTranslations[locale];

  // State for Audited Room Removal Safeguard Dialog
  const [auditedRoomToRemove, setAuditedRoomToRemove] = useState<RoomContextData | null>(null);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">

      {/* Empty State vs Audited Rooms Grid */}
      {auditedRecords.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {locale === 'th'
                ? 'ยังไม่มีห้องที่บันทึกไว้ในโหมดผู้ตรวจการ'
                : 'No audited rooms saved yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              {locale === 'th'
                ? 'ใส่รหัสผู้ตรวจการผ่านปุ่ม "ใส่ Passcode เข้าร่วม" เพื่อบันทึกห้องตรวจลงในหน้านี้อัตโนมัติ'
                : 'Enter an observer passcode via "Enter Passcode" to automatically save inspected rooms here.'}
            </p>
          </div>
          {onOpenPasscodeModal && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenPasscodeModal}
                className="h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{locale === 'th' ? 'ใส่ Passcode เข้าร่วม' : 'Enter Passcode'}</span>
              </button>
            </div>
          )}
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3 max-w-md mx-auto shadow-xs">
          <p className="text-sm font-semibold text-slate-700">
            {locale === 'th' ? 'ไม่พบห้องตรวจที่ตรงกับคำค้นหา' : 'No audited rooms match your search'}
          </p>
          {onSearchChange && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              {locale === 'th' ? 'ล้างคำค้นหา' : 'Clear search'}
            </button>
          )}
        </div>
      ) : (
        /* 3-column grid of Audited Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => {
            const auditRecord = auditedRecords.find((r) => r.roomId === room.roomId);

            return (
              <RoomCard
                key={room.roomId}
                room={room}
                onSelectRoom={(id) => onSelectRoom(id, true)}
                onChangeColor={(roomId, colorId) => {
                  onUpdateAuditColor?.(roomId, colorId);
                }}
                locale={locale}
                isAuditedView={true}
                customTitle={auditRecord?.customTitle}
                customAuditColor={auditRecord?.customAuditColor}
                onEditCustomTitle={(r) => onEditCustomTitle?.(r)}
                onRemoveAuditedRoom={(r) => setAuditedRoomToRemove(r)}
              />
            );
          })}
        </div>
      )}

      {/* Remove from Audited Rooms Safeguard Confirmation Modal Dialog */}
      {auditedRoomToRemove && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {locale === 'th' ? 'นำออกจากรายการตรวจ?' : 'Remove from your audited rooms?'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {locale === 'th'
                    ? 'คุณต้องการนำห้องนี้ออกจากรายการห้องผู้ตรวจการใช่หรือไม่? คุณสามารถใส่รหัสผู้ตรวจการเพื่อเข้าใช้งานใหม่ได้ตลอดเวลา'
                    : 'Do you want to remove this room from your audited rooms list? You can re-enter the observer passcode anytime.'}
                </p>

                {/* Selected Room Details Chip */}
                <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs">
                  <div className="font-semibold text-slate-800 truncate">
                    {auditedRecords.find((r) => r.roomId === auditedRoomToRemove.roomId)?.customTitle ||
                      auditedRoomToRemove.titleBilingual?.[locale] ||
                      auditedRoomToRemove.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {t.creator}: {auditedRoomToRemove.creator} • {auditedRoomToRemove.locationBilingual?.[locale] || auditedRoomToRemove.location}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAuditedRoomToRemove(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0 -mt-1 -mr-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAuditedRoomToRemove(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer"
              >
                {mt.cancelBtn || (locale === 'th' ? 'ยกเลิก' : 'Cancel')}
              </button>
              <button
                type="button"
                onClick={() => {
                  onRemoveAuditedRoom?.(auditedRoomToRemove.roomId);
                  setAuditedRoomToRemove(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>
                  {locale === 'th' ? 'นำออก' : 'Remove'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
