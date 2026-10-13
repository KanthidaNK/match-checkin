import React, { useState, useEffect } from 'react';
import { X, Key, Eye } from 'lucide-react';
import { RoomContextData, RoomMember, BillingMode } from '../types';
import { generatePairPasscode, generateObserverPasscode } from '../utils';
import { Locale, modalTranslations, translateRole } from '../i18n';
import { PASTEL_PALETTE } from '../colorPalettes';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room?: RoomContextData | null; // When passed, modal functions as "แก้ไขห้อง"
  onSaveRoom: (room: RoomContextData) => void;
  onCreateRoom?: (room: RoomContextData) => void;
  locale?: Locale;
}

const PRESET_ROLES_TH = ['ครู / ติวเตอร์', 'นักเรียน', 'พนักงาน', 'เจ้าของกิจการ'];

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  room,
  onSaveRoom,
  onCreateRoom,
  locale = 'th',
}) => {
  const mt = modalTranslations[locale];
  const isEditing = Boolean(room);

  // Form Fields
  const [title, setTitle] = useState('');
  const [locationMode, setLocationMode] = useState<'online' | 'onsite' | null>('online');
  const [customLocation, setCustomLocation] = useState('');
  const [workType, setWorkType] = useState('');
  const [selectedRolePreset, setSelectedRolePreset] = useState<string>('ครู / ติวเตอร์');
  const [customRole, setCustomRole] = useState('');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-31');
  const [billingMode, setBillingMode] = useState<BillingMode>('duration');
  const [hourlyRate, setHourlyRate] = useState<number>(500);
  const [notes, setNotes] = useState('');
  const [themeColor, setThemeColor] = useState<string>('white');

  // Dual-Key Access Architecture
  const [pairPasscode, setPairPasscode] = useState('');
  const [observerPasscode, setObserverPasscode] = useState('');
  const [capacity, setCapacity] = useState('2');

  useEffect(() => {
    if (!isOpen) return;

    if (room) {
      setTitle(room.title || room.roomName || '');
      const loc = room.location || '';
      if (loc.includes('ออนไลน์') || loc.toLowerCase().includes('online')) {
        setLocationMode('online');
        setCustomLocation(
          loc
            .replace(/ออนไลน์\s*(-|\|)?\s*/gi, '')
            .replace(/Online\s*(-|\|)?\s*/gi, '')
            .trim()
        );
      } else if (loc.includes('Onsite') || loc.includes('On-site') || loc.includes('หน้างาน')) {
        setLocationMode('onsite');
        setCustomLocation(
          loc
            .replace(/Onsite\s*(-|\|)?\s*/gi, '')
            .replace(/On-site\s*(-|\|)?\s*/gi, '')
            .replace(/หน้างาน\s*(-|\|)?\s*/gi, '')
            .trim()
        );
      } else {
        setLocationMode(null);
        setCustomLocation(loc);
      }
      setWorkType(room.workType || room.subjectCategory || '');
      if (PRESET_ROLES_TH.includes(room.currentRoleLabel)) {
        setSelectedRolePreset(room.currentRoleLabel);
        setCustomRole('');
      } else {
        setSelectedRolePreset('other');
        setCustomRole(room.currentRoleLabel || '');
      }
      setStartDate(room.startDate || '2026-10-01');
      setEndDate(room.endDate || '2026-10-31');
      setBillingMode(room.billingMode || 'duration');
      setHourlyRate(room.hourlyRate || 500);
      setNotes(room.notes || '');
      setThemeColor(room.themeColor || 'white');
      setPairPasscode(room.pairPasscode || room.passcode || generatePairPasscode());
      setObserverPasscode(room.observerPasscode || generateObserverPasscode());
      const num = parseInt(room.capacityText?.replace(/\D/g, '') || '2', 10);
      setCapacity(num.toString());
    } else {
      setTitle('');
      setLocationMode('online');
      setCustomLocation('');
      setWorkType('');
      setSelectedRolePreset('ครู / ติวเตอร์');
      setCustomRole('');
      setStartDate('2026-10-01');
      setEndDate('2026-10-31');
      setBillingMode('duration');
      setHourlyRate(500);
      setNotes('');
      setThemeColor('white');
      setPairPasscode(generatePairPasscode());
      setObserverPasscode(generateObserverPasscode());
      setCapacity('2');
    }
  }, [isOpen, room]);

  if (!isOpen) return null;

  const currentEffectiveRole =
    selectedRolePreset === 'other'
      ? customRole.trim() || (locale === 'th' ? 'สมาชิก' : 'Member')
      : selectedRolePreset;

  const handleRandomizePair = () => {
    setPairPasscode(generatePairPasscode());
  };

  const handleRandomizeObserver = () => {
    setObserverPasscode(generateObserverPasscode());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const capacityNum = parseInt(capacity, 10) || 2;
    const finalPairCode = pairPasscode.trim().toUpperCase() || generatePairPasscode();
    const finalObserverCode = observerPasscode.trim().toUpperCase() || generateObserverPasscode();

    const modeLabel = locationMode === 'online' ? (locale === 'th' ? 'ออนไลน์' : 'Online') : locationMode === 'onsite' ? 'Onsite' : '';
    const constructedLocation = [modeLabel, customLocation.trim()].filter(Boolean).join(' - ') || 'Online / Onsite';

    if (isEditing && room) {
      const updatedRoom: RoomContextData = {
        ...room,
        title: title.trim(),
        roomName: title.trim(),
        location: constructedLocation,
        workType: workType.trim(),
        subjectCategory: workType.trim() || title.trim(),
        currentRoleLabel: currentEffectiveRole,
        startDate,
        endDate,
        billingMode,
        hourlyRate: Number(hourlyRate) || 0,
        notes: notes.trim(),
        pairPasscode: finalPairCode,
        passcode: finalPairCode,
        observerPasscode: finalObserverCode,
        capacityText: `${capacityNum} ${locale === 'th' ? 'สมาชิก' : 'Members'}`,
        themeColor,
      };

      if (onSaveRoom) onSaveRoom(updatedRoom);
      else if (onCreateRoom) onCreateRoom(updatedRoom);
      onClose();
      return;
    }

    // Creating new room
    const newRoomId = `room-${Date.now()}`;
    const initialMembers: RoomMember[] = [
      {
        id: `mem-${newRoomId}-1`,
        name: locale === 'th' ? 'Kanthida (คุณ)' : 'Kanthida (You)',
        roleTitle: currentEffectiveRole,
        isCurrentUser: true,
      },
      {
        id: `mem-${newRoomId}-2`,
        name: locale === 'th' ? 'คู่เช็กอิน' : 'Check-in Partner',
        roleTitle: locale === 'th' ? 'ผู้ร่วมเช็กอิน' : 'Partner',
      },
    ];

    for (let i = 3; i <= capacityNum; i++) {
      initialMembers.push({
        id: `mem-${newRoomId}-${i}`,
        name: locale === 'th' ? `สมาชิกคนที่ ${i}` : `Member ${i}`,
        roleTitle: locale === 'th' ? 'สมาชิกห้อง' : 'Member',
      });
    }

    const newRoom: RoomContextData = {
      roomId: newRoomId,
      title: title.trim(),
      roomName: title.trim(),
      location: constructedLocation,
      creator: locale === 'th' ? 'Kanthida (คุณ)' : 'Kanthida (You)',
      currentRoleLabel: currentEffectiveRole,
      capacityText: `${capacityNum} ${locale === 'th' ? 'สมาชิก' : 'Members'}`,
      members: initialMembers,
      passcode: finalPairCode,
      pairPasscode: finalPairCode,
      observerPasscode: finalObserverCode,
      currentRole:
        currentEffectiveRole.includes('ครู') || currentEffectiveRole.includes('กิจการ') || currentEffectiveRole.toLowerCase().includes('teacher')
          ? 'host'
          : 'client',
      subjectCategory: workType.trim() || title.trim(),
      workType: workType.trim(),
      hostName: locale === 'th' ? 'Kanthida (คุณ)' : 'Kanthida (You)',
      clientName: locale === 'th' ? 'คู่เช็กอิน' : 'Check-in Partner',
      observerName: 'Observer',
      startDate,
      endDate,
      billingMode,
      hourlyRate: Number(hourlyRate) || 0,
      notes: notes.trim(),
      themeColor,
    };

    if (onSaveRoom) onSaveRoom(newRoom);
    else if (onCreateRoom) onCreateRoom(newRoom);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isEditing ? mt.editRoomTitle : mt.createRoomTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? (locale === 'th' ? 'ปรับปรุงรายละเอียดห้องเช็กอินและรหัสผ่านเข้าถึง' : 'Update room settings and access passcodes')
                : (locale === 'th' ? 'ระบุรายละเอียดห้องเพื่อเริ่มต้นการจับคู่เช็กอินสองทาง' : 'Specify room details for dual check-in matching')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Field 1: Room Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {mt.roomNameLabel}
            </label>
            <input
              type="text"
              required
              placeholder={mt.roomNamePlaceholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
            />
          </div>

          {/* Field 2: Location Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {mt.locationLabel}
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setLocationMode((prev) => (prev === 'online' ? null : 'online'))
                  }
                  className={
                    locationMode === 'online'
                      ? 'px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-semibold shadow-xs cursor-pointer transition-colors'
                      : 'px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs hover:bg-slate-50 cursor-pointer transition-colors'
                  }
                >
                  {mt.onlineBtn}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLocationMode((prev) => (prev === 'onsite' ? null : 'onsite'))
                  }
                  className={
                    locationMode === 'onsite'
                      ? 'px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-semibold shadow-xs cursor-pointer transition-colors'
                      : 'px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs hover:bg-slate-50 cursor-pointer transition-colors'
                  }
                >
                  {mt.onsiteBtn}
                </button>
              </div>

              <input
                type="text"
                placeholder={
                  locationMode === 'online'
                    ? mt.onlinePlaceholder
                    : mt.onsitePlaceholder
                }
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                className="flex-1 h-9 px-3.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Field 3: Work Category */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {mt.workTypeLabel}
            </label>
            <input
              type="text"
              placeholder={mt.workTypePlaceholder}
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
            />
          </div>

          {/* Field 4: Role Selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              {mt.yourRoleLabel}
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {PRESET_ROLES_TH.map((role) => {
                const isSelected = selectedRolePreset === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setSelectedRolePreset(role);
                      setCustomRole('');
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {translateRole(role, locale)}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setSelectedRolePreset('other')}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  selectedRolePreset === 'other'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {locale === 'th' ? 'ระบุบทบาทอื่น...' : 'Other Role...'}
              </button>
            </div>
            {selectedRolePreset === 'other' && (
              <input
                type="text"
                autoFocus
                placeholder={mt.otherRolePlaceholder}
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 transition-all"
              />
            )}
          </div>

          {/* Field 5: Period */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              {mt.checkinPeriodLabel}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="block text-[11px] text-slate-500 mb-1">{mt.startDateLabel}</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-mono"
                />
              </div>
              <div>
                <span className="block text-[11px] text-slate-500 mb-1">{mt.endDateLabel}</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Field 6: Calculation Engine */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              {mt.calculationEngineLabel}
            </label>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setBillingMode('duration')}
                className={`flex-1 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${
                  billingMode === 'duration'
                    ? 'bg-white text-indigo-600 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                {mt.hourlyEngineBtn}
              </button>
              <button
                type="button"
                onClick={() => setBillingMode('unit')}
                className={`flex-1 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${
                  billingMode === 'unit'
                    ? 'bg-white text-indigo-600 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                {mt.unitEngineBtn}
              </button>
            </div>
          </div>

          {/* Field 7: Rate & Capacity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {mt.agreedRateLabel}
              </label>
              <input
                type="number"
                min="0"
                step="20"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {mt.roomCapacityLabel}
              </label>
              <input
                type="number"
                min="2"
                max="30"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          {/* Dual-Key Architecture */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="font-semibold text-slate-800">
              {mt.dualKeySectionTitle}
            </div>

            {/* Pair Code */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-700">
                  {mt.pairCodeLabel}
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={pairPasscode}
                  onChange={(e) => setPairPasscode(e.target.value.toUpperCase())}
                  placeholder="MATCH-XXXX"
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-400"
                />
                <button
                  type="button"
                  onClick={handleRandomizePair}
                  className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 text-slate-500" />
                  <span>{mt.randomizeBtn}</span>
                </button>
              </div>
            </div>

            {/* Observer Code */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-700">
                  {mt.observerCodeLabel}
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={observerPasscode}
                  onChange={(e) => setObserverPasscode(e.target.value.toUpperCase())}
                  placeholder="AUDIT-XXXX"
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-400"
                />
                <button
                  type="button"
                  onClick={handleRandomizeObserver}
                  className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>{mt.randomizeBtn}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {mt.notesFieldLabel}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={mt.notesPlaceholder}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 resize-none"
            />
          </div>

          {/* Bottom Actions Row with Color Theme Swatches on Left & Action Buttons on Right */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 w-full pt-4 border-t border-slate-100">
            {/* Left Side: 12 Color Theme Swatches */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1 shrink-0">
                {locale === 'th' ? 'เลือกสีการ์ด' : 'Card Color'}
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {PASTEL_PALETTE.map((p) => {
                  const currentThemeId = (themeColor || 'white').toLowerCase();
                  const isActive =
                    currentThemeId === p.id.toLowerCase() ||
                    (currentThemeId === 'none' && p.id === 'white') ||
                    (!themeColor && p.id === 'white');
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setThemeColor(p.id)}
                      className={`w-5 h-5 rounded-full cursor-pointer hover:scale-110 transition-transform shrink-0 ${
                        p.id === 'white' ? 'border-2 border-slate-300' : 'border border-black/10'
                      } ${
                        isActive
                          ? 'ring-2 ring-offset-1 ring-indigo-500 scale-110 shadow-xs'
                          : 'opacity-90 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: p.hex }}
                      title={p.name}
                      aria-label={p.name}
                    />
                  );
                })}
              </div>
            </div>

            {/* Right Side: Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-xs rounded-xl transition-colors cursor-pointer"
              >
                {mt.cancelBtn}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm transition-colors text-xs cursor-pointer"
              >
                {isEditing ? mt.editRoomTitle : mt.createRoomTitle}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
