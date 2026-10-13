export interface PastelPaletteItem {
  id: string;
  name: string;
  hex: string;
  accentHex?: string;
  borderHex: string;
  textHex: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  subtleTextClass: string;
  dotClass: string;
  // Card-specific styles
  cardBgClass: string;
  cardBorderClass: string;
  cardTextClass?: string;
  swatchClass: string;
}

// 12-Color Standardized Theme Palette Matrix
export const PASTEL_PALETTE: PastelPaletteItem[] = [
  // 1. White (Default Baseline)
  {
    id: 'white',
    name: 'White (Default)',
    hex: '#FFFFFF',
    borderHex: '#E2E8F0',
    textHex: '#1E293B',
    bgClass: 'bg-white',
    textClass: 'text-slate-800',
    borderClass: 'border-slate-200',
    subtleTextClass: 'text-slate-500',
    dotClass: 'bg-slate-400',
    cardBgClass: 'bg-white',
    cardBorderClass: 'border-slate-200 hover:border-indigo-400',
    cardTextClass: 'text-slate-800',
    swatchClass: 'bg-white border-2 border-slate-300',
  },
  // 2. Rose Pink (New Accent)
  {
    id: 'pink',
    name: 'Rose Pink',
    hex: '#FCE7F3',
    accentHex: '#F43F5E',
    borderHex: '#FBCFE8',
    textHex: '#831843',
    bgClass: 'bg-[#FCE7F3]',
    textClass: 'text-[#831843]',
    borderClass: 'border-[#FBCFE8]',
    subtleTextClass: 'text-[#831843]/80',
    dotClass: 'bg-[#F43F5E]',
    cardBgClass: 'bg-pink-50/70',
    cardBorderClass: 'border-pink-200 hover:border-pink-400',
    cardTextClass: 'text-pink-900',
    swatchClass: 'bg-pink-100 border border-pink-300',
  },
  // 3. Coral / Peach
  {
    id: 'coral',
    name: 'Coral / Peach',
    hex: '#FEE2E2',
    borderHex: '#FECACA',
    textHex: '#991B1B',
    bgClass: 'bg-[#FEE2E2]',
    textClass: 'text-[#991B1B]',
    borderClass: 'border-[#FECACA]',
    subtleTextClass: 'text-[#991B1B]/80',
    dotClass: 'bg-[#EF4444]',
    cardBgClass: 'bg-red-50/70',
    cardBorderClass: 'border-red-200 hover:border-red-400',
    cardTextClass: 'text-red-900',
    swatchClass: 'bg-red-100 border border-red-200',
  },
  // 4. Amber
  {
    id: 'amber',
    name: 'Amber',
    hex: '#FEF3C7',
    borderHex: '#FDE68A',
    textHex: '#92400E',
    bgClass: 'bg-[#FEF3C7]',
    textClass: 'text-[#92400E]',
    borderClass: 'border-[#FDE68A]',
    subtleTextClass: 'text-[#92400E]/80',
    dotClass: 'bg-[#F59E0B]',
    cardBgClass: 'bg-amber-50/70',
    cardBorderClass: 'border-amber-200 hover:border-amber-400',
    cardTextClass: 'text-amber-900',
    swatchClass: 'bg-amber-100 border border-amber-300',
  },
  // 5. Yellow
  {
    id: 'yellow',
    name: 'Yellow',
    hex: '#FEF9C3',
    borderHex: '#FEF08A',
    textHex: '#854D0E',
    bgClass: 'bg-[#FEF9C3]',
    textClass: 'text-[#854D0E]',
    borderClass: 'border-[#FEF08A]',
    subtleTextClass: 'text-[#854D0E]/80',
    dotClass: 'bg-[#EAB308]',
    cardBgClass: 'bg-yellow-50/70',
    cardBorderClass: 'border-yellow-200 hover:border-yellow-400',
    cardTextClass: 'text-yellow-900',
    swatchClass: 'bg-yellow-100 border border-yellow-300',
  },
  // 6. Emerald
  {
    id: 'emerald',
    name: 'Emerald',
    hex: '#D1FAE5',
    borderHex: '#A7F3D0',
    textHex: '#065F46',
    bgClass: 'bg-[#D1FAE5]',
    textClass: 'text-[#065F46]',
    borderClass: 'border-[#A7F3D0]',
    subtleTextClass: 'text-[#065F46]/80',
    dotClass: 'bg-[#10B981]',
    cardBgClass: 'bg-emerald-50/70',
    cardBorderClass: 'border-emerald-200 hover:border-emerald-400',
    cardTextClass: 'text-emerald-900',
    swatchClass: 'bg-emerald-100 border border-emerald-300',
  },
  // 7. Mint / Teal
  {
    id: 'teal',
    name: 'Mint / Teal',
    hex: '#CCFBF1',
    borderHex: '#99F6E4',
    textHex: '#115E59',
    bgClass: 'bg-[#CCFBF1]',
    textClass: 'text-[#115E59]',
    borderClass: 'border-[#99F6E4]',
    subtleTextClass: 'text-[#115E59]/80',
    dotClass: 'bg-[#14B8A6]',
    cardBgClass: 'bg-teal-50/70',
    cardBorderClass: 'border-teal-200 hover:border-teal-400',
    cardTextClass: 'text-teal-900',
    swatchClass: 'bg-teal-100 border border-teal-300',
  },
  // 8. Sky
  {
    id: 'sky',
    name: 'Sky',
    hex: '#E0F2FE',
    borderHex: '#BAE6FD',
    textHex: '#075985',
    bgClass: 'bg-[#E0F2FE]',
    textClass: 'text-[#075985]',
    borderClass: 'border-[#BAE6FD]',
    subtleTextClass: 'text-[#075985]/80',
    dotClass: 'bg-[#0EA5E9]',
    cardBgClass: 'bg-sky-50/70',
    cardBorderClass: 'border-sky-200 hover:border-sky-400',
    cardTextClass: 'text-sky-900',
    swatchClass: 'bg-sky-100 border border-sky-300',
  },
  // 9. Blue
  {
    id: 'blue',
    name: 'Blue',
    hex: '#DBEAFE',
    borderHex: '#BFDBFE',
    textHex: '#1E40AF',
    bgClass: 'bg-[#DBEAFE]',
    textClass: 'text-[#1E40AF]',
    borderClass: 'border-[#BFDBFE]',
    subtleTextClass: 'text-[#1E40AF]/80',
    dotClass: 'bg-[#3B82F6]',
    cardBgClass: 'bg-blue-50/70',
    cardBorderClass: 'border-blue-200 hover:border-blue-400',
    cardTextClass: 'text-blue-900',
    swatchClass: 'bg-blue-100 border border-blue-300',
  },
  // 10. Indigo
  {
    id: 'indigo',
    name: 'Indigo',
    hex: '#E0E7FF',
    borderHex: '#C7D2FE',
    textHex: '#3730A3',
    bgClass: 'bg-[#E0E7FF]',
    textClass: 'text-[#3730A3]',
    borderClass: 'border-[#C7D2FE]',
    subtleTextClass: 'text-[#3730A3]/80',
    dotClass: 'bg-[#6366F1]',
    cardBgClass: 'bg-indigo-50/70',
    cardBorderClass: 'border-indigo-200 hover:border-indigo-400',
    cardTextClass: 'text-indigo-900',
    swatchClass: 'bg-indigo-100 border border-indigo-300',
  },
  // 11. Purple / Lavender
  {
    id: 'purple',
    name: 'Purple / Lavender',
    hex: '#F3E8FF',
    borderHex: '#E9D5FF',
    textHex: '#6B21A8',
    bgClass: 'bg-[#F3E8FF]',
    textClass: 'text-[#6B21A8]',
    borderClass: 'border-[#E9D5FF]',
    subtleTextClass: 'text-[#6B21A8]/80',
    dotClass: 'bg-[#A855F7]',
    cardBgClass: 'bg-purple-50/70',
    cardBorderClass: 'border-purple-200 hover:border-purple-400',
    cardTextClass: 'text-purple-900',
    swatchClass: 'bg-purple-100 border border-purple-300',
  },
  // 12. Slate / Gray
  {
    id: 'slate',
    name: 'Slate / Gray',
    hex: '#F1F5F9',
    borderHex: '#E2E8F0',
    textHex: '#334155',
    bgClass: 'bg-[#F1F5F9]',
    textClass: 'text-[#334155]',
    borderClass: 'border-[#E2E8F0]',
    subtleTextClass: 'text-[#334155]/80',
    dotClass: 'bg-[#64748B]',
    cardBgClass: 'bg-slate-50/80',
    cardBorderClass: 'border-slate-200 hover:border-slate-400',
    cardTextClass: 'text-slate-800',
    swatchClass: 'bg-slate-100 border border-slate-300',
  },
];

// Helper to find palette item with alias support
export function getPastelColor(colorId?: string): PastelPaletteItem {
  if (!colorId || colorId === 'none' || colorId === 'white') {
    return PASTEL_PALETTE[0]; // White as default baseline
  }
  const cleanId = colorId.toLowerCase();

  // Alias mappings
  const aliasMap: Record<string, string> = {
    'rose': 'pink',
    'rose-pink': 'pink',
    'peach': 'coral',
    'red': 'coral',
    'orange': 'amber',
    'green': 'emerald',
    'mint': 'teal',
    'lavender': 'purple',
    'gray': 'slate',
  };

  const targetId = aliasMap[cleanId] || cleanId;
  const found = PASTEL_PALETTE.find(
    (p) => p.id === targetId || p.hex.toLowerCase() === cleanId
  );
  return found || PASTEL_PALETTE[0];
}

// Helper to get card background and border classes
export function getCardThemeClasses(colorId?: string): string {
  if (!colorId || colorId === 'white' || colorId === 'none') {
    return 'bg-white border-slate-200 hover:border-indigo-400';
  }
  const item = getPastelColor(colorId);
  if (item.id === 'white') {
    return 'bg-white border-slate-200 hover:border-indigo-400';
  }
  return `${item.cardBgClass} ${item.cardBorderClass}`;
}
