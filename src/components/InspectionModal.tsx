import React, { useState, useEffect } from 'react';
import { X, Pencil, Trash2, Calendar, Clock } from 'lucide-react';
import { CheckinSession } from '../types';
import { formatTimeWithDuration, calculateDurationHours } from '../utils';
import { PASTEL_PALETTE } from '../colorPalettes';
import { Locale, modalTranslations, formatDateByLocale, getSessionTopic, getSessionSubtext, getPartnerName } from '../i18n';

interface InspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: CheckinSession | null;
  clientName?: string;
  isAuditObserverMode?: boolean;
  onEdit?: (session: CheckinSession) => void;
  onSave?: (session: CheckinSession) => void;
  onDelete: (sessionId: string) => void;
  onVerify?: (sessionId: string) => void;
  locale?: Locale;
}

export const InspectionModal: React.FC<InspectionModalProps> = ({
  isOpen,
  onClose,
  session,
  clientName = 'คู่เช็กอิน',
  isAuditObserverMode = false,
  onEdit,
  onSave,
  onDelete,
  locale = 'th',
}) => {
  const mt = modalTranslations[locale];
  const [isEditing, setIsEditing] = useState(false);
  const [editDate, setEditDate] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editPartnerName, setEditPartnerName] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editColor, setEditColor] = useState('indigo');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (session) {
      setEditDate(session.date || '');
      setEditStartTime(session.startTime || '16:00');
      setEditEndTime(session.endTime || '18:00');
      setEditSubject(session.topic?.[locale] || session.title?.[locale] || getSessionTopic(session, locale) || session.subject || '');
      setEditPartnerName(
        session.partnerName?.[locale] ||
        session.studentNameBilingual?.[locale] ||
        getPartnerName(session.studentName || clientName, locale)
      );
      setEditNotes(session.subtext?.[locale] || session.notesBilingual?.[locale] || getSessionSubtext(session, locale) || session.notes || '');
      setEditColor(session.color || 'indigo');
      setIsEditing(false);
      setShowDeleteConfirm(false);
    }
  }, [session, isOpen, clientName, locale]);

  if (!isOpen || !session) return null;

  const partnerName =
    session.partnerName?.[locale] ||
    session.studentNameBilingual?.[locale] ||
    getPartnerName(session.studentName || clientName, locale);

  const handleSaveInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    const trimmedSubj = editSubject.trim() || session.subject || (locale === 'th' ? 'เช็กอิน' : 'Check-in');
    const trimmedNotes = editNotes.trim();
    const dur = calculateDurationHours(editStartTime, editEndTime);
    const updated: CheckinSession = {
      ...session,
      date: editDate || session.date,
      startTime: editStartTime || session.startTime,
      endTime: editEndTime || session.endTime,
      subject: trimmedSubj,
      topic: session.topic
        ? { ...session.topic, [locale]: trimmedSubj }
        : { th: trimmedSubj, en: trimmedSubj },
      title: session.title
        ? { ...session.title, [locale]: trimmedSubj }
        : { th: trimmedSubj, en: trimmedSubj },
      durationHours: dur > 0 ? dur : session.durationHours,
      totalAmount: session.isFinancialCalculated
        ? Math.round((dur > 0 ? dur : session.durationHours) * (session.hourlyRate || 500))
        : session.totalAmount,
      studentName: editPartnerName.trim() || partnerName,
      partnerName: session.partnerName
        ? { ...session.partnerName, [locale]: editPartnerName.trim() || partnerName }
        : { th: editPartnerName.trim() || partnerName, en: editPartnerName.trim() || partnerName },
      studentNameBilingual: session.studentNameBilingual
        ? { ...session.studentNameBilingual, [locale]: editPartnerName.trim() || partnerName }
        : { th: editPartnerName.trim() || partnerName, en: editPartnerName.trim() || partnerName },
      notes: trimmedNotes,
      subtext: session.subtext
        ? { ...session.subtext, [locale]: trimmedNotes }
        : { th: trimmedNotes, en: trimmedNotes },
      notesBilingual: session.notesBilingual
        ? { ...session.notesBilingual, [locale]: trimmedNotes }
        : { th: trimmedNotes, en: trimmedNotes },
      color: editColor,
    };
    onSave?.(updated);
    if (onEdit) {
      onEdit(updated);
    }
    setIsEditing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-900 text-lg leading-snug break-words">
              {isEditing ? mt.editCheckinTitle : (session.topic?.[locale] || session.title?.[locale] || getSessionTopic(session, locale))}
            </h3>
            {isEditing && (
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                {session.topic?.[locale] || session.title?.[locale] || getSessionTopic(session, locale)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0 -mr-1 -mt-1">
            {!isEditing && !isAuditObserverMode && (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  title={mt.editCheckinTitle}
                  aria-label={mt.editCheckinTitle}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  title={mt.deleteBtn}
                  aria-label={mt.deleteBtn}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={isEditing ? () => setIsEditing(false) : onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Close"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {isEditing ? (
          <form onSubmit={handleSaveInline} className="mt-5 space-y-4">
            {/* Date & Time */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {mt.dateTimeLabel}
              </label>
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="time"
                    value={editStartTime}
                    onChange={(e) => setEditStartTime(e.target.value)}
                    required
                    className="w-full bg-transparent text-xs font-mono text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="time"
                    value={editEndTime}
                    onChange={(e) => setEditEndTime(e.target.value)}
                    required
                    className="w-full bg-transparent text-xs font-mono text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Topic / Details */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {mt.topicDetailsLabel}
              </label>
              <input
                type="text"
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                placeholder={mt.topicPlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Partner */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {mt.partnerLabel}
              </label>
              <input
                type="text"
                value={editPartnerName}
                onChange={(e) => setEditPartnerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {mt.descriptionLabel}
              </label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={3}
                placeholder={mt.notesPlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed resize-none"
              />
            </div>

            {/* Color Tag */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {mt.sessionColorLabel}
              </label>
              <div className="flex items-center justify-center gap-2.5 w-full py-2 flex-wrap">
                {PASTEL_PALETTE.map((p) => {
                  const isActive = (editColor || 'indigo').toLowerCase() === p.id.toLowerCase();
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setEditColor(p.id)}
                      className={`w-6 h-6 rounded-full cursor-pointer ring-offset-2 transition-all border ${p.borderClass} ${
                        isActive ? 'ring-2 ring-indigo-500 scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: p.hex }}
                      title={p.name}
                      aria-label={p.name}
                    />
                  );
                })}
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer"
              >
                {mt.cancelBtn}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors shadow-sm cursor-pointer"
              >
                {mt.saveBtn}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-5 space-y-4">
            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                {mt.descriptionLabel}
              </label>
              <div className="text-xs sm:text-sm text-slate-800 bg-slate-50 border border-slate-100 rounded-xl p-3.5 min-h-[72px] whitespace-pre-wrap leading-relaxed">
                {session.subtext?.[locale] || session.notesBilingual?.[locale] || (session.notes && session.notes.trim().length > 0 ? (
                  getSessionSubtext(session, locale)
                ) : (
                  <span className="text-slate-400 italic">
                    {locale === 'th' ? 'ไม่มีรายละเอียดเพิ่มเติม' : 'No additional details'}
                  </span>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                {mt.dateTimeLabel}
              </label>
              <div className="text-xs sm:text-sm font-medium text-slate-800 bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="whitespace-nowrap text-[11px] font-medium text-slate-700/90">
                  {formatDateByLocale(session.date, locale)} ({formatTimeWithDuration(session.startTime, session.endTime, session.durationHours, locale)})
                </span>
              </div>
            </div>

            {/* Partner */}
            <div className="pt-1">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  {mt.partnerLabel}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-900">
                  {partnerName}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Overlay Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-sm animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div>
              <h4 className="text-base font-bold text-slate-900">
                {mt.confirmDeleteTitle}
              </h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {mt.confirmDeleteBody}
              </p>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer"
              >
                {mt.cancelBtn}
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(session.id);
                  setShowDeleteConfirm(false);
                  onClose();
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white font-medium px-4 py-2 rounded-xl text-sm transition-colors shadow-sm cursor-pointer"
              >
                {mt.deleteBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
