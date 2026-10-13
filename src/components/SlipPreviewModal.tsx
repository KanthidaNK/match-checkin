import React from 'react';
import { X, Download, FileText } from 'lucide-react';
import { CheckinSession, RoomContextData } from '../types';
import { formatTHB, formatTimeWithDuration, getFormattedCurrentThaiDateTime } from '../utils';
import { generateCheckinSummaryPng } from '../utils/canvasExport';
import { Locale, translations, formatDateByLocale, translateSessionSubject, getSessionTopic, getSessionSubtext, getPartnerName } from '../i18n';

interface SlipPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: CheckinSession[];
  roomData: RoomContextData;
  monthName: string;
  yearBE: number;
  locale?: Locale;
}

export const SlipPreviewModal: React.FC<SlipPreviewModalProps> = ({
  isOpen,
  onClose,
  sessions,
  roomData,
  monthName,
  yearBE,
  locale = 'th',
}) => {
  if (!isOpen) return null;

  const t = translations[locale];

  // Enforce strict checked-in filtering and chronological sorting
  const activeCheckedSessions = sessions
    .filter((s) => (s.isCheckedIn === true || s.status === 'verified') && s.isCheckedIn !== false)
    .sort((a, b) => a.date.localeCompare(b.date));

  const totalSessions = activeCheckedSessions.length;
  const totalHours = activeCheckedSessions.reduce(
    (acc, s) => acc + (s.billingMode === 'duration' ? s.durationHours : s.quantityUnits),
    0
  );
  const totalPayable = activeCheckedSessions.reduce(
    (acc, s) => acc + (s.isFinancialCalculated ? s.totalAmount : 0),
    0
  );

  const issuedDate = locale === 'th' ? getFormattedCurrentThaiDateTime() : '13 Oct 2026, 21:19';

  const partnerDisplayName =
    roomData.clientNameBilingual?.[locale] ||
    roomData.partnerName?.[locale] ||
    getPartnerName(roomData.clientName, locale);

  const handleDownload = () => {
    generateCheckinSummaryPng(
      activeCheckedSessions,
      roomData.titleBilingual?.[locale] || roomData.title,
      roomData.creatorBilingual?.[locale] || roomData.creator || (locale === 'th' ? 'Kanthida (คุณ)' : 'Kanthida (You)'),
      partnerDisplayName,
      monthName,
      yearBE,
      issuedDate,
      locale,
      roomData
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar Controls */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {locale === 'th'
                  ? 'ตัวอย่างใบสรุปการเช็กอิน (Preview Summary Sheet)'
                  : 'Check-in Summary Sheet Preview'}
              </h3>
              <p className="text-xs text-slate-500">
                {locale === 'th'
                  ? 'พร้อมส่งออกเป็นไฟล์รูปภาพ PNG ความละเอียดสูง'
                  : 'Ready to export as high-resolution PNG image'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{locale === 'th' ? 'ดาวน์โหลด PNG' : 'Download PNG'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Summary Sheet View (Soft Sky Palette) */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-100/80">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden max-w-3xl mx-auto space-y-0">
            {/* 1. Top Header Banner - Soft Sky Theme */}
            <div className="bg-sky-50/80 border-b border-sky-100 p-6 sm:p-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {t.monthlySummary(monthName)}
                </h2>
                <p className="text-xs text-slate-500 font-normal mt-1">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* 2. Strict Role-Neutral Metadata */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
                {/* Column 1 (Left) */}
                <div className="space-y-2.5 max-w-[340px] break-words leading-snug">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 shrink-0 w-[110px]">
                      {locale === 'th' ? 'ห้อง / ข้อตกลง:' : 'Room / Agreement:'}
                    </span>
                    <strong className="text-slate-900 font-semibold break-words flex-1">
                      {roomData.titleBilingual?.[locale] || roomData.title}
                    </strong>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 shrink-0 w-[110px]">
                      {locale === 'th' ? 'รอบประจำเดือน:' : 'Billing Period:'}
                    </span>
                    <span className="text-slate-800 font-medium">
                      {monthName} {yearBE}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 shrink-0 w-[110px]">
                      {locale === 'th' ? 'ผู้สร้าง:' : 'Created by:'}
                    </span>
                    <span className="text-slate-800 font-medium">
                      {roomData.creatorBilingual?.[locale] || roomData.creator || (locale === 'th' ? 'Kanthida (คุณ)' : 'Kanthida (You)')}
                    </span>
                  </div>
                </div>

                {/* Column 2 (Right) */}
                <div className="space-y-2.5 self-start">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 shrink-0 w-[115px]">
                      {locale === 'th' ? 'คู่เช็กอิน:' : 'Check-in Partner:'}
                    </span>
                    <strong className="text-slate-900 font-semibold break-words flex-1">
                      {partnerDisplayName}
                    </strong>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 shrink-0 w-[115px]">
                      {locale === 'th' ? 'วันที่ออกเอกสาร:' : 'Issued Date:'}
                    </span>
                    <span className="text-slate-700 font-mono">
                      {issuedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Clean Metric Overview (3 Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                  <div className="text-xs text-slate-500 font-medium">
                    {locale === 'th' ? 'จำนวนครั้งที่เช็กอิน' : 'Check-in Count'}
                  </div>
                  <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
                    {totalSessions} <span className="text-xs font-normal text-slate-500">{locale === 'th' ? 'ครั้ง' : 'sessions'}</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                  <div className="text-xs text-slate-500 font-medium">
                    {locale === 'th' ? 'ชั่วโมงสะสมรวม' : 'Total Hours'}
                  </div>
                  <div className="text-xl font-bold text-sky-700 mt-1 font-mono">
                    {totalHours.toFixed(1)} <span className="text-xs font-normal text-slate-500">{locale === 'th' ? 'ชม.' : 'hrs'}</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                  <div className="text-xs text-slate-500 font-medium">
                    {locale === 'th' ? 'ยอดรวมสุทธิ (บาท)' : 'Net Total (THB)'}
                  </div>
                  <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
                    {formatTHB(totalPayable)} <span className="text-xs font-normal text-slate-500">{locale === 'th' ? 'บาท' : 'THB'}</span>
                  </div>
                </div>
              </div>

              {/* 4. Session Ledger Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold">
                        <th className="py-2.5 px-3 text-center">{t.colNo}</th>
                        <th className="py-2.5 px-3">{t.colDate}</th>
                        <th className="py-2.5 px-3">{t.colTopic}</th>
                        <th className="py-2.5 px-3">{t.colTime}</th>
                        <th className="py-2.5 px-3 text-center">{t.colDuration}</th>
                        <th className="py-2.5 px-3 text-right">{t.colRate}</th>
                        <th className="py-2.5 px-3 text-right">{t.colTotal}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                      {activeCheckedSessions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400">
                            {locale === 'th'
                              ? 'ยังไม่มีรายการเช็กอินที่บันทึกไว้ในรอบเดือนนี้'
                              : 'No check-in records for this month.'}
                          </td>
                        </tr>
                      ) : (
                        activeCheckedSessions.map((s, idx) => (
                          <tr key={s.id} className={idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                            <td className="py-2.5 px-3 text-center font-mono text-slate-500">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-900 whitespace-nowrap">
                              {formatDateByLocale(s.date, locale)}
                            </td>
                            <td className="py-2.5 px-3 font-medium text-slate-900">
                              {s.topic?.[locale] || s.title?.[locale] || getSessionTopic(s, locale) || 'Check-in'}
                              {(s.subtext?.[locale] || s.notesBilingual?.[locale] || s.notes) && (
                                <div className="text-[11px] text-slate-400 font-normal truncate max-w-xs">
                                  {s.subtext?.[locale] || s.notesBilingual?.[locale] || getSessionSubtext(s, locale)}
                                </div>
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-mono whitespace-nowrap text-slate-600">
                              {formatTimeWithDuration(s.startTime, s.endTime, s.durationHours, locale)}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-medium">
                              {s.durationHours.toFixed(1)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono">
                              {s.hourlyRate ? `${formatTHB(s.hourlyRate)}` : '-'}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                              {s.isFinancialCalculated ? `${formatTHB(s.totalAmount)}` : '-'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5. Footer Branding & Attribution Update */}
              <div className="bg-slate-50 text-slate-500 border border-slate-200 text-xs text-center py-2.5 px-4 rounded-xl leading-relaxed">
                {t.exportFooterText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
