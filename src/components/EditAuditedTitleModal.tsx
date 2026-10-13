import React, { useState, useEffect } from 'react';
import { X, Pencil, ShieldCheck, AlertCircle } from 'lucide-react';
import { Locale } from '../i18n';

interface EditAuditedTitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  currentTitle: string;
  originalRoomTitle: string;
  onSave: (roomId: string, newTitle: string) => void;
  locale: Locale;
}

export const EditAuditedTitleModal: React.FC<EditAuditedTitleModalProps> = ({
  isOpen,
  onClose,
  roomId,
  currentTitle,
  originalRoomTitle,
  onSave,
  locale,
}) => {
  const [title, setTitle] = useState(currentTitle);

  useEffect(() => {
    setTitle(currentTitle);
  }, [currentTitle, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(roomId, title.trim());
    onClose();
  };

  const handleReset = () => {
    setTitle(originalRoomTitle);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <Pencil className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-snug">
                {locale === 'th'
                  ? 'แก้ไขชื่อหัวข้อการ์ด (เฉพาะหน้าผู้ตรวจการ)'
                  : 'Edit Card Title (Auditor View Only)'}
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                {locale === 'th' ? 'กำหนดชื่อเรียกเฉพาะตัวของคุณ' : 'Set custom alias for this card'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Boundary Disclaimer Banner */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-800">
              {locale === 'th'
                ? 'ขอบเขตสิทธิ์ผู้ตรวจการ (Auditor Scope Boundary)'
                : 'Auditor Scope Boundary'}
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {locale === 'th'
                ? 'การแก้ไขนี้มีผลเฉพาะในการแสดงผลบนหน้าผู้ตรวจการของคุณเท่านั้น ข้อมูลสถานที่ สมาชิก อัตราค่าบริการ และบันทึกเวลาของห้องจะไม่ถูกเปลี่ยนแปลง'
                : 'This only affects the title shown on your personal auditor dashboard. Room settings, members, rates, and check-in records remain untouched.'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {locale === 'th' ? 'ชื่อหัวข้อการ์ดสำหรับผู้ตรวจการ:' : 'Auditor Card Title:'}
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={originalRoomTitle}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="truncate max-w-[240px]">
              {locale === 'th' ? 'ชื่อเดิม: ' : 'Original: '}
              <strong className="text-slate-700">{originalRoomTitle}</strong>
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer shrink-0 font-medium"
            >
              {locale === 'th' ? 'ใช้ชื่อเดิม' : 'Use Original'}
            </button>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer"
            >
              {locale === 'th' ? 'ยกเลิก' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors shadow-sm cursor-pointer"
            >
              {locale === 'th' ? 'บันทึก' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
