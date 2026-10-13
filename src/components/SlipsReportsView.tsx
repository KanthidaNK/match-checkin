import React from 'react';
import {
  FileCheck2,
  Download,
  Printer,
  ShieldCheck,
  Calendar,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { CheckinSession, RoomContextData } from '../types';
import { formatThaiDate, formatTHB, THAI_MONTHS, toThaiYear } from '../utils';
import { generateVerifiedSlipPng } from '../utils/canvasExport';

interface SlipsReportsViewProps {
  sessions: CheckinSession[];
  roomData: RoomContextData;
  onOpenSlipModal: () => void;
}

export const SlipsReportsView: React.FC<SlipsReportsViewProps> = ({
  sessions,
  roomData,
  onOpenSlipModal,
}) => {
  const verifiedSessions = sessions.filter((s) => s.status === 'verified');
  const totalVerifiedHours = verifiedSessions.reduce((acc, s) => acc + s.durationHours, 0);
  const totalPayable = verifiedSessions.reduce(
    (acc, s) => acc + (s.isFinancialCalculated ? s.totalAmount : 0),
    0
  );

  const monthName = 'ตุลาคม';
  const yearBE = 2569;

  const handleDownloadSlip = () => {
    generateVerifiedSlipPng(
      sessions,
      roomData.roomName,
      roomData.hostName,
      roomData.clientName,
      monthName,
      yearBE
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-indigo-600" />
            <span>ส่งออกใบสรุปยอด & สลิปรับรองสองทาง</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            เอกสารสรุปชั่วโมงสอนและค่าตอบแทน พร้อมตรารับรองสองทาง (Mutual Verified) และลายมือชื่อ
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadSlip}
            className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-indigo-200"
          >
            <Download className="w-4 h-4" />
            <span>ดาวน์โหลดสลิป PNG</span>
          </button>
        </div>
      </div>

      {/* Embedded Live Slip Document Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
        {/* Slip Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-xs">
              ✓
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-900 leading-tight">จับคู่เช็คอิน</h1>
              <p className="text-xs text-slate-500">
                ระบบสรุปค่าตอบแทนและรับรองสองทาง (Mutual Verified Slip)
              </p>
            </div>
          </div>

          {/* Official Stamp */}
          <div className="border-2 border-emerald-500 text-emerald-600 rounded-xl px-3.5 py-1.5 text-center rotate-[-2deg] select-none bg-emerald-50/50 shadow-2xs">
            <span className="text-[10px] tracking-wider block font-bold uppercase">
              MUTUAL VERIFIED
            </span>
            <span className="text-xs font-black block">รับรองสองทางครบถ้วน</span>
          </div>
        </div>

        {/* Room & Target Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div>
            <span className="text-slate-500 block mb-0.5">ห้อง / วิชา:</span>
            <span className="font-bold text-slate-900 text-sm block">{roomData.roomName}</span>
            <span className="text-slate-500 block mt-2.5 mb-0.5">ผู้สอน (Host):</span>
            <span className="font-semibold text-slate-800 block">{roomData.hostName}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">รอบประจำเดือน:</span>
            <span className="font-bold text-slate-900 text-sm block">
              {monthName} พ.ศ. {yearBE}
            </span>
            <span className="text-slate-500 block mt-2.5 mb-0.5">ผู้เรียน / ผู้รับบริการ:</span>
            <span className="font-semibold text-slate-800 block">{roomData.clientName}</span>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-slate-200 text-center bg-white shadow-2xs">
            <span className="text-[11px] text-slate-500 block font-medium">จำนวนครั้งที่เช็กอิน</span>
            <span className="text-2xl font-bold font-mono text-slate-900">
              {verifiedSessions.length}
            </span>
            <span className="text-[10px] text-slate-400 block">ครั้ง</span>
          </div>
          <div className="p-3.5 rounded-xl border border-indigo-100 text-center bg-indigo-50/40 shadow-2xs">
            <span className="text-[11px] text-indigo-700 block font-medium">ชั่วโมงสะสมรวม</span>
            <span className="text-2xl font-bold font-mono text-indigo-700">
              {totalVerifiedHours.toFixed(2)}
            </span>
            <span className="text-[10px] text-indigo-500 block">ชม.</span>
          </div>
          <div className="p-3.5 rounded-xl border border-emerald-100 text-center bg-emerald-50/40 shadow-2xs">
            <span className="text-[11px] text-emerald-700 block font-medium">ค่าสอนรวมสุทธิ</span>
            <span className="text-2xl font-bold font-mono text-emerald-700">
              ฿{formatTHB(totalPayable)}
            </span>
            <span className="text-[10px] text-emerald-500 block">บาท</span>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                <th className="py-2.5 px-3">วันที่</th>
                <th className="py-2.5 px-3">วิชา / รายการ</th>
                <th className="py-2.5 px-3">เวลา</th>
                <th className="py-2.5 px-3 text-right">ชม.</th>
                <th className="py-2.5 px-3 text-right">อัตรา</th>
                <th className="py-2.5 px-3 text-right">จำนวนเงิน</th>
                <th className="py-2.5 px-3 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {verifiedSessions.map((s) => (
                <tr key={s.id}>
                  <td className="py-2.5 px-3 text-slate-700 font-medium whitespace-nowrap">
                    {formatThaiDate(s.date)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-900 font-semibold">{s.subject}</td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                    {s.startTime} - {s.endTime}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">{s.durationHours.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right font-mono">฿{formatTHB(s.hourlyRate)}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    ฿{formatTHB(s.totalAmount)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ✓ รับรองแล้ว
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300 font-bold text-slate-900 text-xs sm:text-sm bg-slate-50/40">
                <td colSpan={3} className="py-3 px-3 text-right">
                  รวมค่าสอนสุทธิทั้งสิ้น:
                </td>
                <td className="py-3 px-3 text-right font-mono">{totalVerifiedHours.toFixed(2)}</td>
                <td></td>
                <td className="py-3 px-3 text-right font-mono text-emerald-700 text-base">
                  ฿{formatTHB(totalPayable)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-center text-xs">
          <div>
            <div className="border-b border-slate-300 w-40 mx-auto mb-2 pb-6 text-slate-500 font-serif italic text-base">
              {roomData.hostName.split(' ')[0]}
            </div>
            <span className="font-semibold text-slate-800 block">ผู้สอน (Host / Service Pro)</span>
            <span className="text-[11px] text-slate-500">({roomData.hostName})</span>
          </div>
          <div>
            <div className="border-b border-slate-300 w-40 mx-auto mb-2 pb-6 text-emerald-600 font-serif italic text-base">
              ✓ Verified
            </div>
            <span className="font-semibold text-slate-800 block">ผู้เรียน / ผู้ปกครอง (Client)</span>
            <span className="text-[11px] text-slate-500">({roomData.clientName})</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 text-center">
          <button
            onClick={handleDownloadSlip}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm transition-colors px-5 py-2.5 text-xs inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>บันทึกใบสรุปยอดเป็นรูปภาพ (PNG)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
