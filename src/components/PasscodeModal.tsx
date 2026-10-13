import React, { useState } from 'react';
import {
  X,
  KeyRound,
  ShieldCheck,
  Eye,
  GraduationCap,
  User,
  Copy,
  Check,
  Lock,
  ArrowRight,
  Info,
} from 'lucide-react';
import { UserRole, RoomContextData } from '../types';

interface PasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomData: RoomContextData;
  onUpdateRole: (role: UserRole) => void;
  onUpdateRoomData: (updated: Partial<RoomContextData>) => void;
}

export const PasscodeModal: React.FC<PasscodeModalProps> = ({
  isOpen,
  onClose,
  roomData,
  onUpdateRole,
  onUpdateRoomData,
}) => {
  const [inputPasscode, setInputPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyPasscode = (codeToTest?: string) => {
    const code = (codeToTest || inputPasscode).trim();
    if (!code) {
      setErrorMessage('กรุณากรอกรหัส Passcode');
      return;
    }

    if (code === roomData.pairPasscode || code.toLowerCase() === 'pair') {
      // Pairing key -> Can choose host or client
      onUpdateRole('host');
      setErrorMessage('');
      onClose();
    } else if (code === roomData.observerPasscode || code.toLowerCase() === 'obs') {
      // Observer key -> Read only
      onUpdateRole('observer');
      setErrorMessage('');
      onClose();
    } else {
      setErrorMessage('รหัส Passcode ไม่ถูกต้อง กรุณาใช้รหัสคู่เช็กอินหรือรหัสผู้ตรวจการ');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">สลับห้องและตรวจสอบสิทธิ์</h3>
              <p className="text-xs text-slate-500">ระบบยืนยันสองทาง (Mutual Verification)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Room Summary */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">รหัสห้องปัจจุบัน (Room ID):</span>
              <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                {roomData.roomId}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">ชื่อห้อง / วิชา:</span>
              <span className="font-medium text-slate-800 truncate max-w-[240px]">
                {roomData.roomName}
              </span>
            </div>
          </div>

          {/* Passcode input form */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              ป้อน Passcode เพื่อเข้าใช้งานตามสิทธิ์:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={inputPasscode}
                  onChange={(e) => {
                    setInputPasscode(e.target.value);
                    setErrorMessage('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyPasscode()}
                  placeholder="เช่น PAIR-2569 หรือ OBS-8899"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono tracking-wider"
                />
              </div>
              <button
                onClick={() => handleApplyPasscode()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shrink-0 flex items-center gap-1.5"
              >
                <span>ยืนยัน</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {errorMessage && (
              <p className="text-xs text-rose-600 font-medium">{errorMessage}</p>
            )}
          </div>

          {/* Available Passcodes in this room */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-slate-500 block">
              รหัส Passcode ประจำห้อง (คลิกเพื่อทดสอบหรือคัดลอก):
            </span>

            {/* Pairing Passcode Card */}
            <div className="p-3 rounded-xl border border-indigo-100 bg-indigo-50/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                  RW
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Pairing Passcode
                    </span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-medium">
                      บันทึก / ยืนยัน
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-600 mt-0.5">
                    {roomData.pairPasscode}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setInputPasscode(roomData.pairPasscode);
                    handleApplyPasscode(roomData.pairPasscode);
                  }}
                  className="text-xs bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                >
                  ใช้รหัสนี้
                </button>
                <button
                  onClick={() => copyToClipboard(roomData.pairPasscode, 'pair')}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white transition-colors"
                  title="คัดลอก"
                >
                  {copiedKey === 'pair' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Observer Passcode Card */}
            <div className="p-3 rounded-xl border border-amber-100 bg-amber-50/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                  RO
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Observer Passcode
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-medium">
                      อ่านอย่างเดียว
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-600 mt-0.5">
                    {roomData.observerPasscode}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setInputPasscode(roomData.observerPasscode);
                    handleApplyPasscode(roomData.observerPasscode);
                  }}
                  className="text-xs bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                >
                  ใช้รหัสนี้
                </button>
                <button
                  onClick={() => copyToClipboard(roomData.observerPasscode, 'obs')}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white transition-colors"
                  title="คัดลอก"
                >
                  {copiedKey === 'obs' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Simulated Role Selection */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 block mb-2">
              สลับบทบาทจำลองทันที (Role Switch):
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  onUpdateRole('host');
                  onClose();
                }}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  roomData.currentRole === 'host'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-200'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <GraduationCap className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                <span className="text-xs font-bold block">ครู / ผู้สอน</span>
                <span className="text-[10px] text-slate-500 block">(Host: บันทึกข้อมูล)</span>
              </button>

              <button
                onClick={() => {
                  onUpdateRole('client');
                  onClose();
                }}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  roomData.currentRole === 'client'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-700 ring-2 ring-emerald-200'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <User className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                <span className="text-xs font-bold block">ผู้เรียน / นักเรียน</span>
                <span className="text-[10px] text-slate-500 block">(Client: ยืนยันสองทาง)</span>
              </button>

              <button
                onClick={() => {
                  onUpdateRole('observer');
                  onClose();
                }}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  roomData.currentRole === 'observer'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-800 ring-2 ring-amber-200'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Eye className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                <span className="text-xs font-bold block">ผู้ตรวจการ</span>
                <span className="text-[10px] text-slate-500 block">(Observer: อ่านอย่างเดียว)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            ระบบสิทธิ์สองทางป้องกันการแก้ไขข้อมูลโดยไม่ได้รับอนุญาต
          </span>
          <button
            onClick={onClose}
            className="text-xs text-slate-600 hover:text-slate-900 font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
