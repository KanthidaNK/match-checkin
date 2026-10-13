import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Check,
  Eye,
  Trash2,
  Coins,
  Hourglass,
  CalendarCheck2,
} from 'lucide-react';
import { CheckinSession, UserRole } from '../types';
import { formatThaiDate, formatTHB } from '../utils';

interface LedgerViewProps {
  sessions: CheckinSession[];
  onSelectSession: (session: CheckinSession) => void;
  onVerifySession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onExportSlip: () => void;
  currentRole: UserRole;
}

export const LedgerView: React.FC<LedgerViewProps> = ({
  sessions,
  onSelectSession,
  onVerifySession,
  onDeleteSession,
  onExportSlip,
  currentRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending'>('all');

  // Filtered list
  const filteredSessions = sessions
    .filter((s) => {
      const matchesSearch =
        s.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.roomFormat.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  // Calculate Metrics strictly according to Master Blueprint
  // Total Net Payable = Sum (Duration_k * Rate_k) for verified sessions
  const verifiedSessions = sessions.filter((s) => s.status === 'verified');
  const pendingSessions = sessions.filter((s) => s.status === 'pending');

  const verifiedCount = verifiedSessions.length;
  const totalVerifiedHours = verifiedSessions.reduce(
    (acc, s) => acc + (s.billingMode === 'duration' ? s.durationHours : s.quantityUnits),
    0
  );
  const totalNetPayable = verifiedSessions.reduce(
    (acc, s) => acc + (s.isFinancialCalculated ? s.totalAmount : 0),
    0
  );

  const pendingAmount = pendingSessions.reduce(
    (acc, s) => acc + (s.isFinancialCalculated ? s.totalAmount : 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* 3 KPI Summary Cards Grid (Mandatory Blueprint Specification) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Session Count */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              จำนวนครั้งที่สอน
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-slate-900 font-bold text-3xl font-mono tabular-nums">
                {verifiedCount}
              </span>
              <span className="text-sm font-medium text-slate-500">ครั้ง</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              จากทั้งหมด {sessions.length} ครั้งที่ลงบันทึก
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700">
            <CalendarCheck2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Cumulative Hours */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              ชั่วโมงสะสมรวม
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-indigo-600 font-bold text-3xl font-mono tabular-nums">
                {totalVerifiedHours.toFixed(2)}
              </span>
              <span className="text-sm font-medium text-indigo-500">ชม.</span>
            </div>
            <span className="text-[11px] text-indigo-400 mt-1 block">
              คิดจากครั้งที่รับรองสองทางแล้ว
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Hourglass className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Total Net Payable */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              ค่าสอนรวมสุทธิ
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-emerald-600 font-bold text-3xl font-mono tabular-nums">
                {formatTHB(totalNetPayable)}
              </span>
              <span className="text-sm font-medium text-emerald-600">บาท</span>
            </div>
            <span className="text-[11px] text-amber-600 mt-1 block">
              {pendingAmount > 0 ? `(รอยืนยัน ${formatTHB(pendingAmount)} บาท)` : 'ครบถ้วนทุกรายการ'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Coins className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Ledger Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Toolbar & Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาวิชา, ผู้เรียน, หรือรูปแบบ..."
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Segmented Filter */}
          <div className="flex items-center bg-slate-200/60 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ทั้งหมด ({sessions.length})
            </button>
            <button
              onClick={() => setStatusFilter('verified')}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === 'verified'
                  ? 'bg-white text-emerald-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              รับรองแล้ว ({verifiedCount})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === 'pending'
                  ? 'bg-white text-amber-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              รอยืนยัน ({pendingSessions.length})
            </button>
          </div>
        </div>

        {/* High Density Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">วันที่</th>
                <th className="py-3 px-4 font-semibold">รูปแบบ/ห้อง</th>
                <th className="py-3 px-4 font-semibold">วิชา</th>
                <th className="py-3 px-4 font-semibold">คู่เช็กอิน</th>
                <th className="py-3 px-4 font-semibold">เวลา</th>
                <th className="py-3 px-4 font-semibold text-right">ชม./หน่วย</th>
                <th className="py-3 px-4 font-semibold text-right">ค่าตอบแทน</th>
                <th className="py-3 px-4 font-semibold text-center">สถานะ</th>
                <th className="py-3 px-4 font-semibold text-center">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-sm">
                    ไม่พบรายการเช็กอินที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                filteredSessions.map((s) => {
                  const isVerified = s.status === 'verified';
                  return (
                    <tr
                      key={s.id}
                      onClick={() => onSelectSession(s)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Date */}
                      <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                        {formatThaiDate(s.date)}
                      </td>

                      {/* Format / Room */}
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">
                          {s.roomFormat}
                        </span>
                      </td>

                      {/* Subject */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {s.subject}
                        {s.notes && (
                          <span className="block text-[11px] text-slate-400 font-normal truncate max-w-xs">
                            {s.notes}
                          </span>
                        )}
                      </td>

                      {/* Student / Partner */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                        {s.studentName}
                      </td>

                      {/* Time Window */}
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                        {s.startTime} - {s.endTime}
                      </td>

                      {/* Duration / Units */}
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-800 tabular-nums">
                        {s.billingMode === 'duration'
                          ? `${s.durationHours.toFixed(2)} ชม.`
                          : `${s.quantityUnits} หน่วย`}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono tabular-nums font-bold">
                        {s.isFinancialCalculated ? (
                          <span className={isVerified ? 'text-emerald-600' : 'text-slate-700'}>
                            ฿{formatTHB(s.totalAmount)}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>

                      {/* Status Indicator Pill */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {isVerified ? (
                          <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>รับรองแล้ว</span>
                          </span>
                        ) : (
                          <span className="bg-amber-50 text-amber-600 border border-amber-200 text-xs px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>รอยืนยัน</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-4 text-center whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          {/* If Client and Pending, quick verify */}
                          {currentRole === 'client' && !isVerified && (
                            <button
                              onClick={() => onVerifySession(s.id)}
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="ยืนยันความถูกต้อง"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>รับรอง</span>
                            </button>
                          )}

                          {/* Inspect / Edit */}
                          <button
                            onClick={() => onSelectSession(s)}
                            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                            title="ดูรายละเอียด"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete if Host */}
                          {currentRole === 'host' && (
                            <button
                              onClick={() => {
                                if (window.confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) {
                                  onDeleteSession(s.id);
                                }
                              }}
                              className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                              title="ลบรายการ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Actions Bar (Blueprint Specification: Primary Export Button) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 block">
            สรุปยอดสุทธิที่ผ่านการรับรอง: {formatTHB(totalNetPayable)} บาท ({verifiedCount} ครั้ง)
          </span>
          <span className="text-[11px] text-slate-500 block">
            เอกสารสลิปจะรวบรวมเฉพาะรายการที่มีสถานะรับรองสองทาง (Mutual Verified) เท่านั้น
          </span>
        </div>

        <button
          onClick={onExportSlip}
          className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl px-5 py-2.5 text-sm font-medium flex items-center gap-2 transition-all shadow-sm shadow-indigo-200"
        >
          <FileText className="w-4 h-4" />
          <span>ส่งออกใบสรุปยอด (PNG)</span>
        </button>
      </div>
    </div>
  );
};
