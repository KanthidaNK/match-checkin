import React, { useState } from 'react';
import { Pin, Palette, Pencil, Trash2, Shield, ShieldCheck } from 'lucide-react';
import { RoomContextData } from '../types';
import { Locale, translations, modalTranslations, translateRole } from '../i18n';
import { PASTEL_PALETTE, getCardThemeClasses } from '../colorPalettes';

interface RoomCardProps {
  room: RoomContextData;
  isPinned?: boolean;
  onSelectRoom: (roomId: string) => void;
  onTogglePin?: (roomId: string) => void;
  onEditRoom?: (room: RoomContextData) => void;
  onDeleteClick?: (room: RoomContextData) => void;
  onChangeColor?: (roomId: string, colorId: string) => void;
  locale: Locale;
  // Audited Rooms View props
  isAuditedView?: boolean;
  customTitle?: string;
  customAuditColor?: string;
  onEditCustomTitle?: (room: RoomContextData) => void;
  onRemoveAuditedRoom?: (room: RoomContextData) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  isPinned = false,
  onSelectRoom,
  onTogglePin,
  onEditRoom,
  onDeleteClick,
  onChangeColor,
  locale,
  isAuditedView = false,
  customTitle,
  customAuditColor,
  onEditCustomTitle,
  onRemoveAuditedRoom,
}) => {
  const t = translations[locale];
  const mt = modalTranslations[locale];
  const roleLabelTranslated = translateRole(room.currentRoleLabel, locale);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  // Full-Card Dynamic Pastel Theming calculation supporting 12 standardized tokens
  // If in Audited view, use customAuditColor if set, without altering shared room data
  const effectiveThemeColor = isAuditedView ? (customAuditColor || room.themeColor) : room.themeColor;
  const cardThemeClasses = getCardThemeClasses(effectiveThemeColor);

  const displayTitle = (isAuditedView && customTitle)
    ? customTitle
    : (room.titleBilingual?.[locale] || room.title);

  return (
    <div
      onClick={() => onSelectRoom(room.roomId)}
      className={`p-5 flex flex-col justify-between min-h-[230px] max-h-[250px] ${cardThemeClasses} rounded-2xl border shadow-sm transition-all duration-200 ease-out cursor-pointer group hover:-translate-y-1 hover:shadow-md relative`}
    >

      {/* Row 1: Role Badge (Left) & Compact Action Strip (Right) */}
      <div className="flex items-center justify-between w-full mb-1.5">
        {isAuditedView ? (
          <span className="bg-indigo-50 text-indigo-700 border border-indigo-100/60 text-xs font-semibold px-2.5 py-0.5 rounded-lg shadow-none shrink-0 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>{locale === 'th' ? 'ผู้ตรวจการ (Read-Only)' : 'Observer (Read-Only)'}</span>
          </span>
        ) : (
          <span className="bg-indigo-50 text-indigo-600 border border-indigo-100/80 text-xs font-medium px-2.5 py-0.5 rounded-lg shadow-none shrink-0">
            {roleLabelTranslated}
          </span>
        )}

        {/* Right Side: Dedicated Action Group (3 icons in audited mode, 4 in standard mode) */}
        <div className="flex items-center gap-1 text-slate-400 shrink-0 relative">
          {/* Action 1 (Standard View Only): Pin with Amber Active State */}
          {!isAuditedView && onTogglePin && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(room.roomId);
              }}
              title={isPinned ? mt.unpinRoom : mt.pinRoom}
              aria-label={isPinned ? mt.unpinRoom : mt.pinRoom}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                isPinned
                  ? 'bg-amber-50 border border-amber-200/90 text-amber-600 fill-amber-400 stroke-amber-600 hover:bg-amber-100/80'
                  : 'hover:bg-slate-100 hover:text-slate-600 text-slate-400'
              }`}
            >
              <Pin
                className={`w-3.5 h-3.5 ${
                  isPinned ? 'fill-amber-400 stroke-amber-600 text-amber-600' : ''
                }`}
              />
            </button>
          )}

          {/* Action 2: Color Palette / Paint Bucket with Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsColorPickerOpen((prev) => !prev);
              }}
              title={locale === 'th' ? 'เลือกสีการ์ด' : 'Card Color'}
              aria-label={locale === 'th' ? 'เลือกสีการ์ด' : 'Card Color'}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer hover:bg-slate-100 hover:text-slate-600 text-slate-400 ${
                isColorPickerOpen ? 'bg-slate-100 text-indigo-600' : ''
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
            </button>

            {/* Mini Popover Color Picker */}
            {isColorPickerOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-9 z-30 p-3 bg-white rounded-xl shadow-lg border border-slate-200 min-w-[210px] animate-in fade-in-50 zoom-in-95"
              >
                <span className="text-[11px] font-semibold text-slate-500 mb-2 block">
                  {locale === 'th' ? 'เลือกสีการ์ด' : 'Card Color'}
                </span>
                <div className="grid grid-cols-4 gap-2.5">
                  {PASTEL_PALETTE.map((p) => {
                    const currentThemeId = (effectiveThemeColor || 'white').toLowerCase();
                    const isSelected =
                      currentThemeId === p.id.toLowerCase() ||
                      (currentThemeId === 'none' && p.id === 'white') ||
                      (!effectiveThemeColor && p.id === 'white');
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onChangeColor?.(room.roomId, p.id);
                          setIsColorPickerOpen(false);
                        }}
                        className={`w-7 h-7 rounded-lg transition-all flex items-center justify-center cursor-pointer ${p.swatchClass} ${
                          isSelected
                            ? 'ring-2 ring-offset-1 ring-indigo-500 scale-105 shadow-xs'
                            : 'hover:scale-105 opacity-90 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: p.hex }}
                        title={p.name}
                        aria-label={p.name}
                      >
                        {isSelected && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.id === 'white' ? 'bg-slate-700' : 'bg-slate-900'
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action 2 or 3: Edit Pencil Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isAuditedView) {
                onEditCustomTitle?.(room);
              } else {
                onEditRoom?.(room);
              }
            }}
            title={isAuditedView ? (locale === 'th' ? 'แก้ไขชื่อหัวข้อการ์ด' : 'Edit Card Title') : mt.editRoomTitle}
            aria-label={isAuditedView ? (locale === 'th' ? 'แก้ไขชื่อหัวข้อการ์ด' : 'Edit Card Title') : mt.editRoomTitle}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer hover:bg-slate-100 hover:text-indigo-600 text-slate-400"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          {/* Action 3 or 4: Trash Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isAuditedView) {
                onRemoveAuditedRoom?.(room);
              } else {
                onDeleteClick?.(room);
              }
            }}
            title={isAuditedView ? (locale === 'th' ? 'นำออกจากรายการตรวจ' : 'Remove from audited rooms') : mt.deleteRoom}
            aria-label={isAuditedView ? (locale === 'th' ? 'นำออกจากรายการตรวจ' : 'Remove from audited rooms') : mt.deleteRoom}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer hover:bg-rose-50 hover:text-rose-600 text-slate-400"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Row 2: Sub-header Row with Creator Metadata (No hard width truncation) */}
      <div className="text-xs text-slate-500 mb-2">
        {t.creator}: {room.creatorBilingual?.[locale] || room.creator}
      </div>

      {/* 2. Middle Area (Compact Spacing) */}
      <div className="space-y-1.5 my-auto py-1">
        <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">
          {displayTitle}
        </h3>
        {isAuditedView && customTitle && customTitle !== (room.titleBilingual?.[locale] || room.title) && (
          <p className="text-[11px] text-slate-400 truncate">
            {locale === 'th' ? 'ห้องหลัก: ' : 'Original: '}
            {room.titleBilingual?.[locale] || room.title}
          </p>
        )}
        <p className="text-xs text-slate-500 line-clamp-1">
          {t.location}: {room.locationBilingual?.[locale] || room.location}
        </p>
        <div className="text-[11px] text-slate-400 font-mono">
          {room.capacityText}
        </div>
      </div>

      {/* 3. Bottom Row */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
          {isAuditedView
            ? (locale === 'th' ? 'เข้าสู่โหมดตรวจการ (Read-Only)' : 'Enter Observer Mode (Read-Only)')
            : t.enterWorkspace}
        </span>
      </div>
    </div>
  );
};
