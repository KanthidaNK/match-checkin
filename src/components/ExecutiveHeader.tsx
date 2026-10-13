import React from 'react';
import { Handshake, KeyRound, ChevronLeft, Plus, Search, ShieldCheck } from 'lucide-react';
import { Locale, translations } from '../i18n';

interface ExecutiveHeaderProps {
  onOpenCreateModal: () => void;
  onOpenPasscodeModal: () => void;
  isAuditedView?: boolean;
  onToggleAuditedView?: () => void;
  onLogoClick?: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  isInWorkspace?: boolean;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  onOpenCreateModal,
  onOpenPasscodeModal,
  isAuditedView = false,
  onToggleAuditedView,
  onLogoClick,
  showBackButton,
  onBack,
  searchQuery = '',
  onSearchChange,
  isInWorkspace = false,
  locale,
  onLocaleChange,
}) => {
  const t = translations[locale];

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-5 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Tier 1 (Top Sub-Navigation Bar): Strict Two-Tier Layout */}
        <div className="flex items-center justify-between w-full mb-6 pb-3 border-b border-slate-100/80">
          {/* Left Group: Back Ghost Button & GraviTask Breadcrumb */}
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                type="button"
                onClick={onBack}
                className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.back}</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span
                onClick={onLogoClick}
                className="text-slate-900 font-bold hover:text-slate-700 cursor-pointer transition-colors"
              >
                GraviTask
              </span>
              <span className="text-slate-300">/</span>
              {isAuditedView ? (
                <>
                  <button
                    type="button"
                    onClick={onBack}
                    className="text-slate-500 hover:text-indigo-600 font-medium cursor-pointer transition-colors"
                  >
                    {t.brandTitle}
                  </button>
                  <span className="text-slate-300">/</span>
                  <span className="text-indigo-600 font-semibold">
                    {locale === 'th' ? 'ห้องผู้ตรวจการ' : 'Audited Rooms'}
                  </span>
                </>
              ) : (
                <span className="text-indigo-600 font-semibold">{t.brandTitle}</span>
              )}
            </div>
          </div>

          {/* Right Group: Language Switcher Strictly */}
          <div className="bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-0.5 border border-slate-200/60">
            <button
              type="button"
              onClick={() => onLocaleChange('th')}
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                locale === 'th'
                  ? 'bg-white text-indigo-600 font-semibold shadow-xs rounded-md'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              TH
            </button>
            <span className="text-slate-300 text-[10px]">|</span>
            <button
              type="button"
              onClick={() => onLocaleChange('en')}
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                locale === 'en'
                  ? 'bg-white text-indigo-600 font-semibold shadow-xs rounded-md'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Tier 2 (Main Action Header Row): Handshake Brand & Search / CTAs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          {/* Left Group: Brand Icon & System Titles */}
          <div className="flex items-center gap-3.5 shrink-0">
            <div
              onClick={onLogoClick}
              className={`w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 ${
                onLogoClick ? 'cursor-pointer hover:bg-indigo-100/80 transition-colors' : ''
              }`}
            >
              <Handshake className="w-5 h-5 text-indigo-600 stroke-[1.75]" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {t.brandTitle}
              </h1>
              <p className="text-xs text-slate-500 font-normal">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Right Group: Search input & Passcode/Create buttons */}
          {isAuditedView ? (
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  placeholder={locale === 'th' ? 'ค้นหาห้องผู้ตรวจการ...' : 'Search audited rooms...'}
                  className="h-9 pl-8 pr-3 w-56 sm:w-64 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-all shadow-xs"
                />
              </div>

              <button
                type="button"
                onClick={onOpenPasscodeModal}
                className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                <span>{locale === 'th' ? 'ใส่ Passcode เข้าร่วม' : 'Enter Passcode'}</span>
              </button>
            </div>
          ) : !isInWorkspace ? (
            <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
              {/* Landing Hub Room Search Input */}
              <div className="relative flex-1 max-w-xs md:max-w-sm">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                />
              </div>

              {/* Action Button 1: Passcode */}
              <button
                type="button"
                onClick={onOpenPasscodeModal}
                className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
              >
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.enterPasscode}</span>
              </button>

              {/* Action Button 2: Audited Rooms Toggle Button (Strictly Positioned Between Passcode & Create Buttons) */}
              <button
                type="button"
                onClick={onToggleAuditedView}
                className={`h-9 px-3.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0 ${
                  isAuditedView
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-indigo-600'
                }`}
                title={locale === 'th' ? 'ห้องผู้ตรวจการ' : 'Audited Rooms'}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>{locale === 'th' ? 'ห้องผู้ตรวจการ' : 'Audited Rooms'}</span>
              </button>

              {/* Action Button 3: Create Room */}
              <button
                type="button"
                onClick={onOpenCreateModal}
                className="h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{t.createNewRoom}</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
