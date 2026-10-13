import { CheckinSession } from '../types';
import { formatThaiDate, formatTHB, getFormattedCurrentThaiDateTime } from '../utils';
import { Locale, translateSessionSubject, getSessionTopic, formatDateByLocale } from '../i18n';

// Helper to trigger download of a canvas
function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Helper to wrap text within a maxWidth constraint and prevent overlap
export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 2
): number {
  if (!text) return y;
  if (ctx.measureText(text).width <= maxWidth) {
    ctx.fillText(text, x, y);
    return y;
  }

  // Tokenize text into words / segments for clean wrapping
  let tokens: string[];
  if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
    try {
      const segmenter = new (Intl as any).Segmenter(['th', 'en'], { granularity: 'word' });
      tokens = Array.from(segmenter.segment(text), (s: any) => s.segment);
    } catch {
      tokens = text.split(/(\s+)/);
    }
  } else {
    tokens = text.split(/(\s+)/);
  }

  let line = '';
  let curY = y;
  let count = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const testLine = line + token;
    if (ctx.measureText(testLine).width > maxWidth && line.trim().length > 0) {
      if (count < maxLines - 1) {
        ctx.fillText(line.trim(), x, curY);
        line = token;
        curY += lineHeight;
        count++;
      } else {
        // Last line: truncate with ellipsis
        let tr = testLine;
        while (ctx.measureText(tr + '...').width > maxWidth && tr.length > 1) {
          tr = tr.slice(0, -1);
        }
        ctx.fillText(tr.trim() + '...', x, curY);
        line = '';
        count++;
        break;
      }
    } else {
      line = testLine;
    }
  }

  if (line.trim().length > 0 && count < maxLines) {
    ctx.fillText(line.trim(), x, curY);
  }

  return curY;
}

/**
 * Generate a professional Slate/Sky Check-in Summary Sheet PNG
 * Role-Neutral, Zero verification stamps, Zero signature blocks
 */
export function generateCheckinSummaryPng(
  sessions: CheckinSession[],
  roomTitle: string,
  ownerName: string,
  partnerName: string,
  monthName: string,
  yearBE: number,
  issuedDateStr?: string,
  locale: Locale = 'th',
  roomIdOrData?: string | { roomId?: string }
): void {
  // Strictly filter only verified / checked-in sessions
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

  const canvas = document.createElement('canvas');
  const width = 1200;
  const rowHeight = 46;
  const baseHeight = 580;
  const height = baseHeight + Math.max(activeCheckedSessions.length, 1) * rowHeight + 40;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Top header banner - Soft Sky Theme
  ctx.fillStyle = '#F0F9FF';
  ctx.fillRect(0, 0, width, 130);
  ctx.strokeStyle = '#E0F2FE';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 130);
  ctx.lineTo(width, 130);
  ctx.stroke();

  // Document Title
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 28px "Plus Jakarta Sans", "Prompt", sans-serif';
  ctx.fillText(
    locale === 'th'
      ? `ใบสรุปการเช็กอินเดือน${monthName}`
      : `Check-in Summary Sheet - ${monthName} ${yearBE}`,
    60,
    60
  );

  // Subtitle
  ctx.font = 'normal 15px "Prompt", sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText(
    locale === 'th'
      ? 'ระบบบันทึกเวลาและสรุปยอดข้อตกลงการเช็กอิน'
      : 'Dual Check-in & Time Ledger Verification System',
    60,
    94
  );

  // 1. Role-Neutral Metadata Container
  const metaY = 170;
  const metaHeight = 136;
  ctx.fillStyle = '#F8FAFC';
  roundRect(ctx, 60, metaY, width - 120, metaHeight, 16);
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Column 1 Layout Constraints (Left)
  const col1LabelX = 90;
  const col1X = 215;
  const col1MaxWidth = 340; // constrain width before right column x-anchor
  const lineHeight = 19;

  // Column 2 Layout Constraints (Right) - Fixed X coordinate with absolute safety margins
  const col2LabelX = 580;
  const col2ValX = 720;
  const col2MaxWidth = 380;

  const row1Y = metaY + 36;
  const row2Y = metaY + 76;
  const row3Y = metaY + 110;

  // Metadata Fields - Left Column Labels
  ctx.fillStyle = '#64748B';
  ctx.font = '13.5px "Prompt", sans-serif';
  ctx.fillText(locale === 'th' ? 'ห้อง / ข้อตกลง:' : 'Room / Agreement:', col1LabelX, row1Y);
  ctx.fillText(locale === 'th' ? 'รอบประจำเดือน:' : 'Billing Period:', col1LabelX, row2Y);
  ctx.fillText(locale === 'th' ? 'ผู้สร้าง:' : 'Created by:', col1LabelX, row3Y);

  // Metadata Fields - Left Column Values
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 15px "Prompt", sans-serif';
  wrapText(ctx, roomTitle, col1X, row1Y, col1MaxWidth, lineHeight);
  ctx.fillText(`${monthName} ${yearBE}`, col1X, row2Y);
  ctx.fillText(ownerName, col1X, row3Y);

  // Metadata Fields - Right Column Labels
  ctx.fillStyle = '#64748B';
  ctx.font = '13.5px "Prompt", sans-serif';
  ctx.fillText(locale === 'th' ? 'คู่เช็กอิน:' : 'Check-in Partner:', col2LabelX, row1Y);
  ctx.fillText(locale === 'th' ? 'วันที่ออกเอกสาร:' : 'Issued Date:', col2LabelX, row2Y);

  // Metadata Fields - Right Column Values
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 15px "Prompt", sans-serif';
  wrapText(ctx, partnerName, col2ValX, row1Y, col2MaxWidth, lineHeight, 1);
  ctx.fillStyle = '#475569';
  ctx.font = 'normal 14.5px "Prompt", sans-serif';
  ctx.fillText(issuedDateStr || (locale === 'th' ? getFormattedCurrentThaiDateTime() : '13 Oct 2026, 21:19'), col2ValX, row2Y);

  // 2. Clean Metric Overview (3 Cards)
  const kpiY = 325;
  const kpiWidth = (width - 120 - 40) / 3;

  drawKpiCard(
    ctx,
    60,
    kpiY,
    kpiWidth,
    88,
    locale === 'th' ? 'จำนวนครั้งที่เช็กอิน' : 'Check-in Count',
    `${totalSessions} ${locale === 'th' ? 'ครั้ง' : 'sessions'}`,
    '#0F172A'
  );
  drawKpiCard(
    ctx,
    60 + kpiWidth + 20,
    kpiY,
    kpiWidth,
    88,
    locale === 'th' ? 'ชั่วโมงสะสมรวม' : 'Total Hours',
    `${totalHours.toFixed(1)} ${locale === 'th' ? 'ชม.' : 'hrs'}`,
    '#0284C7'
  );
  drawKpiCard(
    ctx,
    60 + (kpiWidth + 20) * 2,
    kpiY,
    kpiWidth,
    88,
    locale === 'th' ? 'ยอดรวมสุทธิ (บาท)' : 'Net Total (THB)',
    `${formatTHB(totalPayable)} ${locale === 'th' ? 'บาท' : 'THB'}`,
    '#0F172A'
  );

  // 3. Session Ledger Table
  const tableStartY = 435;

  // Table Header
  ctx.fillStyle = '#F1F5F9';
  roundRect(ctx, 60, tableStartY, width - 120, 42, 8);
  ctx.fill();

  ctx.fillStyle = '#334155';
  ctx.font = 'bold 13.5px "Prompt", sans-serif';
  ctx.fillText(locale === 'th' ? 'ลำดับ' : 'No.', 85, tableStartY + 26);
  ctx.fillText(locale === 'th' ? 'วันที่' : 'Date', 145, tableStartY + 26);
  ctx.fillText(locale === 'th' ? 'รายละเอียดงาน / หัวข้อ' : 'Topic / Details', 270, tableStartY + 26);
  ctx.fillText(locale === 'th' ? 'ช่วงเวลา' : 'Time', 600, tableStartY + 26);
  ctx.fillText(locale === 'th' ? 'ระยะเวลา (ชม.)' : 'Duration (hrs)', 760, tableStartY + 26);
  ctx.fillText(locale === 'th' ? 'อัตราข้อตกลง' : 'Agreed Rate', 890, tableStartY + 26);
  ctx.fillText(locale === 'th' ? 'ยอดรวม (บาท)' : 'Total (THB)', 1030, tableStartY + 26);

  // Table Rows (Direct real-time sessions, no status dots or badges)
  let curY = tableStartY + 42;

  if (activeCheckedSessions.length === 0) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(60, curY, width - 120, 60);
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'normal 14px "Prompt", sans-serif';
    ctx.fillText(
      locale === 'th'
        ? 'ยังไม่มีรายการเช็กอินที่บันทึกไว้ในรอบเดือนนี้'
        : 'No check-in records for this month.',
      450,
      curY + 35
    );
    curY += 60;
  } else {
    activeCheckedSessions.forEach((s, idx) => {
      ctx.fillStyle = idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
      ctx.fillRect(60, curY, width - 120, rowHeight);

      ctx.strokeStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.moveTo(60, curY + rowHeight);
      ctx.lineTo(width - 60, curY + rowHeight);
      ctx.stroke();

      ctx.fillStyle = '#475569';
      ctx.font = '13.5px "Prompt", sans-serif';
      ctx.fillText(`${idx + 1}`, 95, curY + 28);
      ctx.fillText(locale === 'th' ? formatThaiDate(s.date) : formatDateByLocale(s.date, 'en'), 145, curY + 28);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'medium 14px "Prompt", sans-serif';
      const topic = s.topic?.[locale] || s.title?.[locale] || getSessionTopic(s, locale) || (locale === 'th' ? 'เช็กอิน' : 'Check-in');
      const cleanSubject = topic.length > 32 ? topic.substring(0, 30) + '...' : topic;
      ctx.fillText(cleanSubject, 270, curY + 28);

      ctx.fillStyle = '#334155';
      ctx.font = '13px "Prompt", sans-serif';
      ctx.fillText(`${s.startTime} - ${s.endTime}`, 600, curY + 28);
      ctx.fillText(`${s.durationHours.toFixed(1)} ${locale === 'th' ? 'ชม.' : 'hrs'}`, 780, curY + 28);
      ctx.fillText(s.hourlyRate ? `${formatTHB(s.hourlyRate)} ${locale === 'th' ? 'บ.' : 'THB'}` : '-', 905, curY + 28);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 14px "Prompt", sans-serif';
      ctx.fillText(s.isFinancialCalculated ? `${formatTHB(s.totalAmount)} ${locale === 'th' ? 'บ.' : 'THB'}` : '-', 1040, curY + 28);

      curY += rowHeight;
    });
  }

  // Bottom Notice
  const noticeY = curY + 25;
  ctx.fillStyle = '#F8FAFC';
  roundRect(ctx, 60, noticeY, width - 120, 60, 10);
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.stroke();

  ctx.fillStyle = '#64748B';
  ctx.font = 'normal 13px "Prompt", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    locale === 'th'
      ? 'เอกสารนี้สร้างขึ้นโดยอัตโนมัติจากระบบจับคู่เช็กอิน ที่พัฒนาโดย GraviTask WebApplication เพื่อใช้เป็นหลักฐานสรุปรายการเวลาและชำระค่าตอบแทนตามข้อตกลง'
      : 'Automatically generated by Match Check-in, powered by GraviTask WebApplication for time ledger verification and agreed payment.',
    width / 2,
    noticeY + 36
  );
  ctx.textAlign = 'left';

  const extractedRoomId =
    typeof roomIdOrData === 'string'
      ? roomIdOrData
      : roomIdOrData?.roomId || activeCheckedSessions[0]?.roomId;

  const exportFilename = generateExportFilename(
    partnerName,
    monthName,
    yearBE,
    roomTitle,
    extractedRoomId,
    activeCheckedSessions
  );

  downloadCanvas(canvas, exportFilename);
}

function drawKpiCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: string,
  valColor: string
) {
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, x, y, w, h, 14);
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#64748B';
  ctx.font = 'normal 13px "Prompt", sans-serif';
  ctx.fillText(label, x + 20, y + 30);

  ctx.fillStyle = valColor;
  ctx.font = 'bold 22px "Plus Jakarta Sans", "Prompt", sans-serif';
  ctx.fillText(value, x + 20, y + 66);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Retain legacy export for backwards compatibility
export const generateVerifiedSlipPng = generateCheckinSummaryPng;

/**
 * Map Thai partner names to clean romanized strings
 * e.g. น้องแนน (ศิริพร) -> N-Nan, Kanthida (คุณ) -> Kanthida, ช่างแพรวา -> Praewa, เหล่าซือหวัง -> LaoshiWang
 */
export function getRomanizedPartnerName(partnerName: string, roomId?: string): string {
  if (roomId === 'room-1') return 'N-Nan';
  if (roomId === 'room-2') return 'LaoshiWang';
  if (roomId === 'room-3') return 'Praewa';
  if (roomId === 'room-4') return 'Kanthida';

  const raw = (partnerName || '').trim();
  const lower = raw.toLowerCase();

  if (lower.includes('น้องแนน') || lower.includes('ศิริพร') || lower.includes('n-nan')) {
    return 'N-Nan';
  }
  if (lower.includes('เหล่าซือ') || lower.includes('หวัง') || lower.includes('laoshi') || lower.includes('wang')) {
    return 'LaoshiWang';
  }
  if (lower.includes('แพรวา') || lower.includes('praewa')) {
    return 'Praewa';
  }
  if (lower.includes('kanthida') || lower.includes('กานต์ธิดา') || lower.includes('คุณ') || lower.includes('you')) {
    return 'Kanthida';
  }
  if (lower.includes('ปิยะพร') || lower.includes('piyaporn')) {
    return 'DrPiyaporn';
  }
  if (lower.includes('จอย') || lower.includes('joy')) {
    return 'Joy';
  }
  if (lower.includes('กิ๊ก') || lower.includes('kik')) {
    return 'Kik';
  }
  if (lower.includes('น้ำผึ้ง') || lower.includes('nampueng')) {
    return 'Nampueng';
  }

  // Generic fallback: strip brackets, special characters, and whitespace
  const sanitized = raw
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\{.*?\}/g, '')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  return sanitized || 'Partner';
}

/**
 * Format MonthYear strictly in standard English
 * e.g. Oct2026, Nov2026
 */
export function getEnglishMonthYear(
  monthName: string,
  yearBE: number,
  sessions?: CheckinSession[]
): string {
  let ceYear = yearBE > 2400 ? yearBE - 543 : yearBE;
  let monthShort = 'Oct';

  const monthMap: Record<string, string> = {
    'มกราคม': 'Jan', 'ม.ค.': 'Jan', 'january': 'Jan', 'jan': 'Jan',
    'กุมภาพันธ์': 'Feb', 'ก.พ.': 'Feb', 'february': 'Feb', 'feb': 'Feb',
    'มีนาคม': 'Mar', 'มี.ค.': 'Mar', 'march': 'Mar', 'mar': 'Mar',
    'เมษายน': 'Apr', 'เม.ย.': 'Apr', 'april': 'Apr', 'apr': 'Apr',
    'พฤษภาคม': 'May', 'พ.ค.': 'May', 'may': 'May',
    'มิถุนายน': 'Jun', 'มิ.ย.': 'Jun', 'june': 'Jun', 'jun': 'Jun',
    'กรกฎาคม': 'Jul', 'ก.ค.': 'Jul', 'july': 'Jul', 'jul': 'Jul',
    'สิงหาคม': 'Aug', 'ส.ค.': 'Aug', 'august': 'Aug', 'aug': 'Aug',
    'กันยายน': 'Sep', 'ก.ย.': 'Sep', 'september': 'Sep', 'sep': 'Sep',
    'ตุลาคม': 'Oct', 'ต.ค.': 'Oct', 'october': 'Oct', 'oct': 'Oct',
    'พฤศจิกายน': 'Nov', 'พ.ย.': 'Nov', 'november': 'Nov', 'nov': 'Nov',
    'ธันวาคม': 'Dec', 'ธ.ค.': 'Dec', 'december': 'Dec', 'dec': 'Dec',
  };

  const cleanMonth = (monthName || '').trim().toLowerCase();
  for (const [key, val] of Object.entries(monthMap)) {
    if (cleanMonth.includes(key)) {
      monthShort = val;
      break;
    }
  }

  // Cross-reference with session dates if available
  if (sessions && sessions.length > 0 && sessions[0].date) {
    const parts = sessions[0].date.split('-');
    if (parts.length >= 2) {
      const parsedYear = parseInt(parts[0], 10);
      const parsedMonth = parseInt(parts[1], 10);
      if (!isNaN(parsedYear) && parsedYear >= 2000 && parsedYear <= 2100) {
        ceYear = parsedYear;
      }
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      if (parsedMonth >= 1 && parsedMonth <= 12) {
        monthShort = months[parsedMonth - 1];
      }
    }
  }

  return `${monthShort}${ceYear}`;
}

/**
 * Map room title to a concise English slug
 * Room 1: PhysicsG10
 * Room 2: ChineseHSK4
 * Room 3: NailSpaBranch1
 * Room 4: ClinicPremier
 */
export function getRomanizedRoomSlug(roomTitle: string, roomId?: string): string {
  if (roomId === 'room-1') return 'PhysicsG10';
  if (roomId === 'room-2') return 'ChineseHSK4';
  if (roomId === 'room-3') return 'NailSpaBranch1';
  if (roomId === 'room-4') return 'ClinicPremier';

  const lower = (roomTitle || '').toLowerCase();
  if (lower.includes('ฟิสิกส์') || lower.includes('physics')) {
    return 'PhysicsG10';
  }
  if (lower.includes('จีน') || lower.includes('chinese') || lower.includes('hsk')) {
    return 'ChineseHSK4';
  }
  if (lower.includes('เล็บ') || lower.includes('nail') || lower.includes('สปา') || lower.includes('spa')) {
    return 'NailSpaBranch1';
  }
  if (lower.includes('คลินิก') || lower.includes('clinic') || lower.includes('พรีเมียร์') || lower.includes('premier')) {
    return 'ClinicPremier';
  }

  // Generic fallback: clean special characters, brackets, whitespace, and convert to PascalCase
  const sanitized = roomTitle
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\{.*?\}/g, '')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  return sanitized || 'CheckinWorkspace';
}

/**
 * Universal English filename generator
 * [RomanizedPartnerName]_[MonthYear]_[RomanizedCleanRoomName].png
 */
export function generateExportFilename(
  partnerName: string,
  monthName: string,
  yearBE: number,
  roomTitle: string,
  roomId?: string,
  sessions?: CheckinSession[]
): string {
  const partnerSlug = getRomanizedPartnerName(partnerName, roomId);
  const monthYearSlug = getEnglishMonthYear(monthName, yearBE, sessions);
  const roomSlug = getRomanizedRoomSlug(roomTitle, roomId);

  return `${partnerSlug}_${monthYearSlug}_${roomSlug}.png`;
}
