import React, { useState } from 'react';
import { Trash2, AlertTriangle, X, ShieldCheck, KeyRound } from 'lucide-react';
import { RoomContextData, AuditedRoomRecord } from '../types';
import { Locale, translations, modalTranslations } from '../i18n';
import { RoomCard } from './RoomCard';

interface LandingCardsGridProps {
  rooms: RoomContextData[];
  onSelectRoom: (roomId: string, isObserver?: boolean) => void;
  onEditRoom?: (room: RoomContextData) => void;
  onDeleteRoom?: (roomId: string) => void;
  onChangeRoomColor?: (roomId: string, colorId: string) => void;
  pinnedRoomIds?: string[];
  onTogglePin?: (roomId: string) => void;
  locale: Locale;
  // Audited View props
  isAuditedView?: boolean;
  auditedRecords?: AuditedRoomRecord[];
  onOpenPasscodeModal?: () => void;
  onEditCustomTitle?: (room: RoomContextData) => void;
  onRemoveAuditedRoom?: (roomId: string) => void;
  onUpdateAuditColor?: (roomId: string, colorId: string) => void;
  onBackToMyRooms?: () => void;
}

export const LandingCardsGrid: React.FC<LandingCardsGridProps> = ({
  rooms,
  onSelectRoom,
  onEditRoom,
  onDeleteRoom,
  onChangeRoomColor,
  pinnedRoomIds: controlledPinnedRoomIds,
  onTogglePin: controlledOnTogglePin,
  locale,
  isAuditedView = false,
  auditedRecords = [],
  onOpenPasscodeModal,
  onEditCustomTitle,
  onRemoveAuditedRoom,
  onUpdateAuditColor,
  onBackToMyRooms,
}) => {
  const t = translations[locale];
  const mt = modalTranslations[locale];

  // Internal state fallback for pinned rooms
  const [internalPinnedIds, setInternalPinnedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('match_checkin_pinned_rooms');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const activePinnedIds = controlledPinnedRoomIds ?? internalPinnedIds;

  const handleTogglePin = (roomId: string) => {
    if (controlledOnTogglePin) {
      controlledOnTogglePin(roomId);
    } else {
      setInternalPinnedIds((prev) => {
        const next = prev.includes(roomId)
          ? prev.filter((id) => id !== roomId)
          : [roomId, ...prev];
        localStorage.setItem('match_checkin_pinned_rooms', JSON.stringify(next));
        return next;
      });
    }
  };

  // State for Room Deletion Confirmation Safeguard Dialog (Standard)
  const [roomToDelete, setRoomToDelete] = useState<RoomContextData | null>(null);

  // State for Audited Room Removal Safeguard Dialog
  const [auditedRoomToRemove, setAuditedRoomToRemove] = useState<RoomContextData | null>(null);

  const handleDeleteConfirm = () => {
    if (!roomToDelete) return;
    onDeleteRoom?.(roomToDelete.roomId);
    setRoomToDelete(null);
  };

  // In standard view, sort pinned rooms to the top
  const sortedRooms = isAuditedView
    ? rooms
    : [...rooms].sort((a, b) => {
        const aPinned = activePinnedIds.includes(a.roomId) || Boolean(a.isPinned);
        const bPinned = activePinnedIds.includes(b.roomId) || Boolean(b.isPinned);
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        return 0;
      });

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Audited View Header Ribbon (When on Audited Tab) */}
      {isAuditedView && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span className="text-xs font-semibold text-slate-700">
              {locale === 'th' ? 'หน้ารายการห้องผู้ตรวจการ (Audited Rooms)' : 'Audited Rooms Dashboard'}
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {locale === 'th'
              ? `ทั้งหมด ${sortedRooms.length} ห้อง`
              : `${sortedRooms.length} rooms total`}
          </span>
        </div>
      )}

      {/* Empty State: Audited View vs Standard View */}
      {isAuditedView && sortedRooms.length === 0 ? (
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
      ) : sortedRooms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-2 max-w-lg mx-auto">
          <p className="text-sm font-semibold text-slate-700">
            {locale === 'th'
              ? 'ไม่พบห้องเช็กอินที่ตรงกับคำค้นหา'
              : 'No check-in rooms match your search.'}
          </p>
          <p className="text-xs text-slate-400">
            {locale === 'th'
              ? 'ลองระบุชื่อวิชา ผู้สร้าง หรือสถานที่อื่นเพื่อค้นหาห้องเช็กอิน'
              : 'Try searching by title, creator, or location.'}
          </p>
        </div>
      ) : (
        /* 3-column grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRooms.map((room) => {
            const isPinned =
              activePinnedIds.includes(room.roomId) || Boolean(room.isPinned);
            const auditRecord = isAuditedView
              ? auditedRecords.find((r) => r.roomId === room.roomId)
              : undefined;

            return (
              <RoomCard
                key={room.roomId}
                room={room}
                isPinned={isPinned}
                onSelectRoom={(id) => onSelectRoom(id, isAuditedView)}
                onTogglePin={isAuditedView ? undefined : handleTogglePin}
                onEditRoom={(r) => onEditRoom?.(r)}
                onDeleteClick={(r) => setRoomToDelete(r)}
                onChangeColor={(roomId, colorId) => {
                  if (isAuditedView) {
                    onUpdateAuditColor?.(roomId, colorId);
                  } else {
                    onChangeRoomColor?.(roomId, colorId);
                  }
                }}
                locale={locale}
                isAuditedView={isAuditedView}
                customTitle={auditRecord?.customTitle}
                customAuditColor={auditRecord?.customAuditColor}
                onEditCustomTitle={(r) => onEditCustomTitle?.(r)}
                onRemoveAuditedRoom={(r) => setAuditedRoomToRemove(r)}
              />
            );
          })}
        </div>
      )}

      {/* Delete Safeguard Confirmation Modal Dialog (Standard Rooms) */}
      {roomToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/80 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {mt.confirmDeleteRoomTitle || (locale === 'th' ? 'ยืนยันการลบห้องเช็กอิน' : 'Confirm Room Deletion')}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {mt.confirmDeleteRoomBody || (locale === 'th' ? 'คุณยืนยันที่จะลบห้องนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้' : 'Are you sure you want to delete this room? This action cannot be undone.')}
                </p>

                {/* Selected Room Details Chip */}
                <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs">
                  <div className="font-semibold text-slate-800 truncate">
                    {roomToDelete.titleBilingual?.[locale] || roomToDelete.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {t.creator}: {roomToDelete.creator} • {roomToDelete.locationBilingual?.[locale] || roomToDelete.location}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setRoomToDelete(null)}
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
                onClick={() => setRoomToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer"
              >
                {mt.cancelBtn || (locale === 'th' ? 'ยกเลิก' : 'Cancel')}
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>
                  {mt.deleteBtn || (locale === 'th' ? 'ยืนยันการลบ' : 'Confirm Delete')}
                </span>
              </button>
            </div>
          </div>
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
