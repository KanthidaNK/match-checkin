import { CheckinSession, RoomContextData } from './types';

export const THAI_MONTHS = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

export const THAI_MONTHS_SHORT = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

export const THAI_DAYS = [
  'อาทิตย์',
  'จันทร์',
  'อังคาร',
  'พุธ',
  'พฤหัสบดี',
  'ศุกร์',
  'เสาร์',
];

export const THAI_DAYS_SHORT = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

// Convert CE year to Thai Buddhist Era (พ.ศ.)
export function toThaiYear(ceYear: number): number {
  return ceYear + 543;
}

// Convert "2026-10-13" to "13 ต.ค. 2569"
export function formatThaiDate(dateString: string, isFull = false): string {
  if (!dateString) return '';
  const [yearStr, monthStr, dayStr] = dateString.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);
  const thaiYear = toThaiYear(year);

  if (isFull) {
    return `${day} ${THAI_MONTHS[month]} พ.ศ. ${thaiYear}`;
  }
  return `${day} ${THAI_MONTHS_SHORT[month]} ${thaiYear}`;
}

// Format currency in THB
export function formatTHB(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Time difference calculation in decimal hours: e.g. "15:15" to "17:15" -> 2.00
export function calculateDurationHours(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0;
  const [startH, startM] = startTime.split(':').map((v) => parseInt(v, 10));
  const [endH, endM] = endTime.split(':').map((v) => parseInt(v, 10));

  const startMinutes = startH * 60 + startM;
  let endMinutes = endH * 60 + endM;

  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }

  const diffMinutes = endMinutes - startMinutes;
  const hours = diffMinutes / 60;
  return Math.round(hours * 100) / 100;
}

// Single-line format with duration: e.g. "16:00 - 18:00 (2 ชม.)" or "(2 hrs)"
export function formatTimeWithDuration(
  startTime: string,
  endTime: string,
  durationHours?: number,
  locale: 'th' | 'en' = 'th'
): string {
  if (!startTime || !endTime) return '';
  const dur = durationHours != null && durationHours > 0 ? durationHours : calculateDurationHours(startTime, endTime);
  const unit = locale === 'th' ? 'ชม.' : 'hrs';
  return `${startTime} - ${endTime} (${dur} ${unit})`;
}

// Get dynamic real-time export timestamp in Thai ICT format: e.g. "13 ต.ค. 2569 12:43 น."
export function getFormattedCurrentThaiDateTime(dateObj: Date = new Date()): string {
  const day = dateObj.getDate();
  const monthIdx = dateObj.getMonth();
  const yearBE = toThaiYear(dateObj.getFullYear());
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');

  return `${day} ${THAI_MONTHS_SHORT[monthIdx]} ${yearBE} ${hours}:${minutes} น.`;
}

// Dual-Key generator functions adhering strictly to specification pattern
export function generatePairPasscode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MATCH-${code}`;
}

export function generateObserverPasscode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `AUDIT-${code}`;
}

// Format room name for selector dropdown adhering strictly to 4 active rooms specification
export function getRoomDisplayLabel(room: RoomContextData, locale: 'th' | 'en' = 'th'): string {
  if (room.titleBilingual && room.titleBilingual[locale]) {
    return room.titleBilingual[locale];
  }
  if (room.roomId === 'room-1') {
    return locale === 'th' ? 'ฟิสิกส์ ม.4 น้องแนน (Zoom 02)' : 'Physics G10 N-Nan (Zoom 02)';
  }
  if (room.roomId === 'room-2') {
    return locale === 'th'
      ? 'สนทนาภาษาจีน HSK 4 (สถาบันภาษาเอเชียตะวันออก)'
      : 'Conversational Chinese HSK 4 (East Asia Language Institute)';
  }
  if (room.roomId === 'room-3') {
    return locale === 'th'
      ? 'งานช่างทำเล็บและสปา (ร้าน Nail & Beauty Studio สาขา 1)'
      : 'Nail & Spa Technician (Nail & Beauty Studio Branch 1)';
  }
  if (room.roomId === 'room-4') {
    return locale === 'th'
      ? 'ผู้ช่วยเคาน์เตอร์และประสานงานคลินิก (คลินิกเวชกรรมความงาม เดอะพรีเมียร์)'
      : 'Clinic Assistant & Receptionist (The Premier Aesthetic Clinic)';
  }
  return room.title || room.roomName || (locale === 'th' ? 'ห้องเช็กอิน' : 'Check-in Workspace');
}

// Initial 4 Mockup Rooms matching Executive Production Specification with 100% full bilingual schema
export const INITIAL_ROOMS: RoomContextData[] = [
  {
    roomId: 'room-1',
    title: 'ฟิสิกส์ ม.4 น้องแนน (Zoom 02)',
    titleBilingual: {
      th: 'ฟิสิกส์ ม.4 น้องแนน (Zoom 02)',
      en: 'Physics G10 N-Nan (Zoom 02)',
    },
    location: 'กวดวิชาฟิสิกส์เตรียมวิศวะ (Zoom 02)',
    locationBilingual: {
      th: 'กวดวิชาฟิสิกส์เตรียมวิศวะ (Zoom 02)',
      en: 'Prep-Engineering Physics Tutoring (Zoom 02)',
    },
    creator: 'Kanthida (คุณ)',
    creatorBilingual: {
      th: 'Kanthida (คุณ)',
      en: 'Kanthida (You)',
    },
    currentRoleLabel: 'ครู / ติวเตอร์',
    capacityText: '2 สมาชิก',
    currentRole: 'host',
    passcode: 'MATCH-4021',
    pairPasscode: 'MATCH-4021',
    observerPasscode: 'AUDIT-4021',
    roomName: 'ฟิสิกส์ ม.4 น้องแนน (Zoom 02)',
    subjectCategory: 'ฟิสิกส์ ม.ปลาย & ตะลุยโจทย์',
    workType: 'กวดวิชาและเตรียมสอบแข่งขัน',
    workTypeBilingual: {
      th: 'กวดวิชาและเตรียมสอบแข่งขัน',
      en: 'Tutoring & Competitive Exam Prep',
    },
    subtitleBilingual: {
      th: '· กวดวิชาและเตรียมสอบแข่งขัน',
      en: '· Tutoring & Competitive Exam Prep',
    },
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    billingMode: 'duration',
    hourlyRate: 500,
    hostName: 'Kanthida (คุณ)',
    clientName: 'น้องแนน (ศิริพร)',
    clientNameBilingual: {
      th: 'น้องแนน (ศิริพร)',
      en: 'N-Nan (Siriporn)',
    },
    partnerName: {
      th: 'น้องแนน (ศิริพร)',
      en: 'N-Nan (Siriporn)',
    },
    observerName: 'ผู้ปกครองน้องแนน',
    notes: 'บันทึกเวลาเรียนตัวต่อตัวและการบ้านรายสัปดาห์',
    themeColor: 'indigo',
    members: [
      { id: 'mem-1-1', name: 'Kanthida (คุณ)', roleTitle: 'ครู / ติวเตอร์', isCurrentUser: true },
      { id: 'mem-1-2', name: 'น้องแนน (ศิริพร)', roleTitle: 'นักเรียน (ผู้รับบริการ)' },
    ],
  },
  {
    roomId: 'room-2',
    title: 'สนทนาภาษาจีน HSK 4 (สถาบันภาษาเอเชียตะวันออก)',
    titleBilingual: {
      th: 'สนทนาภาษาจีน HSK 4 (สถาบันภาษาเอเชียตะวันออก)',
      en: 'Conversational Chinese HSK 4 (East Asia Language Institute)',
    },
    location: 'สถาบันภาษาเอเชียตะวันออก',
    locationBilingual: {
      th: 'สถาบันภาษาเอเชียตะวันออก',
      en: 'East Asia Language Institute',
    },
    creator: 'เหล่าซือหวัง',
    creatorBilingual: {
      th: 'เหล่าซือหวัง',
      en: 'Laoshi Wang',
    },
    currentRoleLabel: 'นักเรียน',
    capacityText: '4 สมาชิก',
    currentRole: 'client',
    passcode: 'MATCH-4482',
    pairPasscode: 'MATCH-4482',
    observerPasscode: 'AUDIT-4482',
    roomName: 'สนทนาภาษาจีน HSK 4 (สถาบันภาษาเอเชียตะวันออก)',
    subjectCategory: 'ภาษาจีนระดับกลาง',
    workType: 'หลักสูตรภาษาและการสนทนาเชิงธุรกิจ',
    workTypeBilingual: {
      th: 'หลักสูตรภาษาและการสนทนาเชิงธุรกิจ',
      en: 'Language Course & Business Conversation',
    },
    subtitleBilingual: {
      th: '· หลักสูตรภาษาและการสนทนาเชิงธุรกิจ',
      en: '· Language Course & Business Conversation',
    },
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    billingMode: 'duration',
    hourlyRate: 450,
    hostName: 'เหล่าซือหวัง',
    clientName: 'Kanthida (คุณ)',
    clientNameBilingual: {
      th: 'Kanthida (คุณ)',
      en: 'Kanthida (You)',
    },
    partnerName: {
      th: 'เหล่าซือหวัง',
      en: 'Laoshi Wang',
    },
    observerName: 'สถาบันภาษา',
    notes: 'คอร์สกลุ่มย่อย 4 คนเพื่อเตรียมสอบ HSK ระดับ 4',
    themeColor: 'amber',
    members: [
      { id: 'mem-2-1', name: 'Kanthida (คุณ)', roleTitle: 'นักเรียน (ผู้เรียน)', isCurrentUser: true },
      { id: 'mem-2-2', name: 'เหล่าซือหวัง', roleTitle: 'ครู / ติวเตอร์ (ผู้สอน)' },
      { id: 'mem-2-3', name: 'นายปกรณ์ วงศ์วิบูลย์', roleTitle: 'นักเรียนร่วมชั้น' },
      { id: 'mem-2-4', name: 'น.ส.ชญาดา มงคลกิจ', roleTitle: 'นักเรียนร่วมชั้น' },
    ],
  },
  {
    roomId: 'room-3',
    title: 'งานช่างทำเล็บและสปา (ร้าน Nail & Beauty Studio สาขา 1)',
    titleBilingual: {
      th: 'งานช่างทำเล็บและสปา (ร้าน Nail & Beauty Studio สาขา 1)',
      en: 'Nail & Spa Technician (Nail & Beauty Studio Branch 1)',
    },
    location: 'ร้าน Nail & Beauty Studio สาขา 1',
    locationBilingual: {
      th: 'ร้าน Nail & Beauty Studio สาขา 1',
      en: 'Nail & Beauty Studio Branch 1',
    },
    creator: 'Kanthida (คุณ)',
    creatorBilingual: {
      th: 'Kanthida (คุณ)',
      en: 'Kanthida (You)',
    },
    currentRoleLabel: 'เจ้าของกิจการ',
    capacityText: '6 สมาชิก',
    currentRole: 'host',
    passcode: 'MATCH-3019',
    pairPasscode: 'MATCH-3019',
    observerPasscode: 'AUDIT-3019',
    roomName: 'งานช่างทำเล็บและสปา (ร้าน Nail & Beauty Studio สาขา 1)',
    subjectCategory: 'การบริการ & สปาเล็บ',
    workType: 'บริการเสริมความงาม ทำเล็บ สปา และต่อขนตา',
    workTypeBilingual: {
      th: 'บริการเสริมความงาม ทำเล็บ สปา และต่อขนตา',
      en: 'Beauty Services, Nails, Spa & Eyelash Extensions',
    },
    subtitleBilingual: {
      th: '· บริการเสริมความงาม ทำเล็บ สปา และต่อขนตา',
      en: '· Beauty Services, Nails, Spa & Eyelash Extensions',
    },
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    billingMode: 'duration',
    hourlyRate: 200,
    hostName: 'Kanthida (คุณ)',
    clientName: 'ช่างแพรวา',
    clientNameBilingual: {
      th: 'ช่างแพรวา',
      en: 'Technician Praewa',
    },
    partnerName: {
      th: 'ช่างแพรวา',
      en: 'Technician Praewa',
    },
    observerName: 'ผู้จัดการฝ่ายตรวจสอบ',
    notes: 'ตารางบันทึกเวลาทำงานกะบ่ายและการให้บริการลูกค้า',
    themeColor: 'pink',
    members: [
      { id: 'mem-3-1', name: 'Kanthida (คุณ)', roleTitle: 'เจ้าของกิจการ (นายจ้าง)', isCurrentUser: true },
      { id: 'mem-3-2', name: 'ช่างแพรวา', roleTitle: 'พนักงาน (ช่างทำเล็บอาวุโส)' },
      { id: 'mem-3-3', name: 'ช่างจอย', roleTitle: 'พนักงาน (ช่างเพ้นท์เล็บ & สปา)' },
      { id: 'mem-3-4', name: 'ช่างกิ๊ก', roleTitle: 'พนักงาน (ช่างต่อขนตา)' },
      { id: 'mem-3-5', name: 'ช่างน้ำผึ้ง', roleTitle: 'พนักงาน (ช่างดูแลมือเท้า)' },
      { id: 'mem-3-6', name: 'คุณสุมล เกียรติกร', roleTitle: 'ผู้ตรวจสอบบัญชี (Observer)' },
    ],
  },
  {
    roomId: 'room-4',
    title: 'ผู้ช่วยเคาน์เตอร์และประสานงานคลินิก (คลินิกเวชกรรมความงาม เดอะพรีเมียร์)',
    titleBilingual: {
      th: 'ผู้ช่วยเคาน์เตอร์และประสานงานคลินิก (คลินิกเวชกรรมความงาม เดอะพรีเมียร์)',
      en: 'Clinic Assistant & Receptionist (The Premier Aesthetic Clinic)',
    },
    location: 'คลินิกเวชกรรมความงาม เดอะพรีเมียร์',
    locationBilingual: {
      th: 'คลินิกเวชกรรมความงาม เดอะพรีเมียร์',
      en: 'The Premier Aesthetic Clinic',
    },
    creator: 'พญ.ปิยะพร',
    creatorBilingual: {
      th: 'พญ.ปิยะพร',
      en: 'Dr. Piyaporn',
    },
    currentRoleLabel: 'พนักงาน',
    capacityText: '8 สมาชิก',
    currentRole: 'client',
    passcode: 'MATCH-9025',
    pairPasscode: 'MATCH-9025',
    observerPasscode: 'AUDIT-9025',
    roomName: 'ผู้ช่วยเคาน์เตอร์และประสานงานคลินิก (คลินิกเวชกรรมความงาม เดอะพรีเมียร์)',
    subjectCategory: 'เวชกรรมคลินิก & บริการคนไข้',
    workType: 'งานต้อนรับ ประสานงานนัดหมาย และจัดการเวชระเบียน',
    workTypeBilingual: {
      th: 'งานต้อนรับ ประสานงานนัดหมาย และจัดการเวชระเบียน',
      en: 'Front Desk, Appointment Coordination & Medical Records',
    },
    subtitleBilingual: {
      th: '· งานต้อนรับ ประสานงานนัดหมาย และจัดการเวชระเบียน',
      en: '· Front Desk, Appointment Coordination & Medical Records',
    },
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    billingMode: 'duration',
    hourlyRate: 180,
    hostName: 'พญ.ปิยะพร',
    clientName: 'Kanthida (คุณ)',
    clientNameBilingual: {
      th: 'Kanthida (คุณ)',
      en: 'Kanthida (You)',
    },
    partnerName: {
      th: 'พญ.ปิยะพร',
      en: 'Dr. Piyaporn',
    },
    observerName: 'ที่ปรึกษาทางการแพทย์',
    notes: 'บันทึกเวลางานกะคลินิกประจำวัน',
    themeColor: 'emerald',
    members: [
      { id: 'mem-4-1', name: 'Kanthida (คุณ)', roleTitle: 'พนักงาน (ผู้ช่วยเคาน์เตอร์)', isCurrentUser: true },
      { id: 'mem-4-2', name: 'พญ.ปิยะพร', roleTitle: 'เจ้าของกิจการ (แพทย์ประจำคลินิก)' },
      { id: 'mem-4-3', name: 'คุณนภาพร', roleTitle: 'ผู้ช่วยพยาบาล' },
      { id: 'mem-4-4', name: 'นายเอกชัย', roleTitle: 'เจ้าหน้าที่เวชระเบียน' },
      { id: 'mem-4-5', name: 'น.ส.อรทัย', roleTitle: 'ผู้ช่วยเภสัชกรรม' },
      { id: 'mem-4-6', name: 'นายธีรเดช', roleTitle: 'เจ้าหน้าที่ต้อนรับ' },
      { id: 'mem-4-7', name: 'น.ส.กมลวรรณ', roleTitle: 'เจ้าหน้าที่คิวและนัดหมาย' },
      { id: 'mem-4-8', name: 'นพ.วิศรุต', roleTitle: 'ที่ปรึกษาการแพทย์ (Observer)' },
    ],
  },
];

// Seed sessions for October 2026 with 100% full bilingual schema ({ th: string, en: string })
export const INITIAL_SESSIONS: CheckinSession[] = [
  // Room 1 Sessions: ฟิสิกส์ ม.4 น้องแนน (Kanthida สอน น้องแนน)
  {
    id: 'chk-r1-01',
    roomId: 'room-1',
    memberId: 'mem-1-1',
    date: '2026-10-01',
    subject: 'ฟิสิกส์ ม.4 บทนำและเวกเตอร์',
    topic: {
      th: 'ฟิสิกส์ ม.4 บทนำและเวกเตอร์',
      en: 'Physics G10 Intro & Vectors',
    },
    title: {
      th: 'ฟิสิกส์ ม.4 บทนำและเวกเตอร์',
      en: 'Physics G10 Intro & Vectors',
    },
    studentName: 'น้องแนน (ศิริพร)',
    roomFormat: 'Zoom 02 (Online)',
    billingMode: 'duration',
    startTime: '16:00',
    endTime: '18:00',
    durationHours: 2.0,
    quantityUnits: 1,
    hourlyRate: 500,
    isFinancialCalculated: true,
    totalAmount: 1000,
    status: 'verified',
    isCheckedIn: true,
    hostLoggedBy: 'Kanthida (คุณ)',
    verifiedBy: 'น้องแนน (ศิริพร)',
    verifiedAt: '2026-10-01T18:05:00Z',
    notes: 'ทบทวนการแตกเวกเตอร์และการหาแรงลัพธ์',
    subtext: {
      th: 'ทบทวนการแตกเวกเตอร์และการหาแรงลัพธ์',
      en: 'Review vector decomposition & resultant force',
    },
    notesBilingual: {
      th: 'ทบทวนการแตกเวกเตอร์และการหาแรงลัพธ์',
      en: 'Review vector decomposition & resultant force',
    },
    color: 'sky',
  },
  {
    id: 'chk-r1-02',
    roomId: 'room-1',
    memberId: 'mem-1-1',
    date: '2026-10-03',
    subject: 'การเคลื่อนที่แนวตรง 1 มิติ',
    topic: {
      th: 'การเคลื่อนที่แนวตรง 1 มิติ',
      en: '1D Linear Motion',
    },
    title: {
      th: 'การเคลื่อนที่แนวตรง 1 มิติ',
      en: '1D Linear Motion',
    },
    studentName: 'น้องแนน (ศิริพร)',
    roomFormat: 'Zoom 02 (Online)',
    billingMode: 'duration',
    startTime: '16:00',
    endTime: '18:00',
    durationHours: 2.0,
    quantityUnits: 1,
    hourlyRate: 500,
    isFinancialCalculated: true,
    totalAmount: 1000,
    status: 'verified',
    isCheckedIn: true,
    hostLoggedBy: 'Kanthida (คุณ)',
    verifiedBy: 'น้องแนน (ศิริพร)',
    verifiedAt: '2026-10-03T18:02:00Z',
    notes: 'สมการ 5 สูตรการเคลื่อนที่และการอ่านกราฟ s-t, v-t',
    subtext: {
      th: 'สมการ 5 สูตรการเคลื่อนที่และการอ่านกราฟ s-t, v-t',
      en: '5 motion equations and reading s-t, v-t graphs',
    },
    notesBilingual: {
      th: 'สมการ 5 สูตรการเคลื่อนที่และการอ่านกราฟ s-t, v-t',
      en: '5 motion equations and reading s-t, v-t graphs',
    },
    color: 'indigo',
  },
  {
    id: 'chk-r1-03',
    roomId: 'room-1',
    memberId: 'mem-1-1',
    date: '2026-10-06',
    subject: 'การตกแบบเสรี (Free Fall)',
    topic: {
      th: 'การตกแบบเสรี (Free Fall)',
      en: 'Free Fall Motion',
    },
    title: {
      th: 'การตกแบบเสรี (Free Fall)',
      en: 'Free Fall Motion',
    },
    studentName: 'น้องแนน (ศิริพร)',
    roomFormat: 'Zoom 02 (Online)',
    billingMode: 'duration',
    startTime: '16:00',
    endTime: '18:00',
    durationHours: 2.0,
    quantityUnits: 1,
    hourlyRate: 500,
    isFinancialCalculated: true,
    totalAmount: 1000,
    status: 'verified',
    isCheckedIn: true,
    hostLoggedBy: 'Kanthida (คุณ)',
    verifiedBy: 'น้องแนน (ศิริพร)',
    verifiedAt: '2026-10-06T18:10:00Z',
    notes: 'ทำแบบฝึกหัด 15 ข้อ น้องแนนเข้าใจดีมาก',
    subtext: {
      th: 'ทำแบบฝึกหัด 15 ข้อ น้องแนนเข้าใจดีมาก',
      en: 'Practiced 15 problems, understood very well',
    },
    notesBilingual: {
      th: 'ทำแบบฝึกหัด 15 ข้อ น้องแนนเข้าใจดีมาก',
      en: 'Practiced 15 problems, understood very well',
    },
    color: 'purple',
  },
  {
    id: 'chk-r1-04',
    roomId: 'room-1',
    memberId: 'mem-1-1',
    date: '2026-10-08',
    subject: 'กฎการเคลื่อนที่ของนิวตัน',
    topic: {
      th: 'กฎการเคลื่อนที่ของนิวตัน',
      en: "Newton's Laws of Motion",
    },
    title: {
      th: 'กฎการเคลื่อนที่ของนิวตัน',
      en: "Newton's Laws of Motion",
    },
    studentName: 'น้องแนน (ศิริพร)',
    roomFormat: 'Zoom 02 (Online)',
    billingMode: 'duration',
    startTime: '16:00',
    endTime: '18:00',
    durationHours: 2.0,
    quantityUnits: 1,
    hourlyRate: 500,
    isFinancialCalculated: true,
    totalAmount: 1000,
    status: 'verified',
    isCheckedIn: true,
    hostLoggedBy: 'Kanthida (คุณ)',
    verifiedBy: 'น้องแนน (ศิริพร)',
    verifiedAt: '2026-10-08T18:07:00Z',
    notes: 'แรงเสียดทานและแรงดึงเชือก Free-body diagram',
    subtext: {
      th: 'แรงเสียดทานและแรงดึงเชือก Free-body diagram',
      en: 'Friction & Tension Free-body diagram',
    },
    notesBilingual: {
      th: 'แรงเสียดทานและแรงดึงเชือก Free-body diagram',
      en: 'Friction & Tension Free-body diagram',
    },
    color: 'rose',
  },
  {
    id: 'chk-r1-05',
    roomId: 'room-1',
    memberId: 'mem-1-1',
    date: '2026-10-10',
    subject: 'ตะลุยโจทย์สอบกลางภาค',
    topic: {
      th: 'ตะลุยโจทย์สอบกลางภาค',
      en: 'Midterm Exam Practice',
    },
    title: {
      th: 'ตะลุยโจทย์สอบกลางภาค',
      en: 'Midterm Exam Practice',
    },
    studentName: 'น้องแนน (ศิริพร)',
    roomFormat: 'Zoom 02 (Online)',
    billingMode: 'duration',
    startTime: '10:00',
    endTime: '12:00',
    durationHours: 2.0,
    quantityUnits: 1,
    hourlyRate: 500,
    isFinancialCalculated: true,
    totalAmount: 1000,
    status: 'verified',
    isCheckedIn: true,
    hostLoggedBy: 'Kanthida (คุณ)',
    verifiedBy: 'น้องแนน (ศิริพร)',
    verifiedAt: '2026-10-10T12:04:00Z',
    notes: 'เก็งข้อสอบโรงเรียน 25 ข้อ',
    subtext: {
      th: 'เก็งข้อสอบโรงเรียน 25 ข้อ',
      en: 'School exam preparation 25 questions',
    },
    notesBilingual: {
      th: 'เก็งข้อสอบโรงเรียน 25 ข้อ',
      en: 'School exam preparation 25 questions',
    },
    color: 'amber',
  },
  {
    id: 'chk-r1-06',
    roomId: 'room-1',
    memberId: 'mem-1-1',
    date: '2026-10-12',
    subject: 'การเคลื่อนที่แบบโพรเจกไทล์',
    topic: {
      th: 'การเคลื่อนที่แบบโพรเจกไทล์',
      en: 'Projectile Motion',
    },
    title: {
      th: 'การเคลื่อนที่แบบโพรเจกไทล์',
      en: 'Projectile Motion',
    },
    studentName: 'น้องแนน (ศิริพร)',
    roomFormat: 'Zoom 02 (Online)',
    billingMode: 'duration',
    startTime: '16:00',
    endTime: '18:00',
    durationHours: 2.0,
    quantityUnits: 1,
    hourlyRate: 500,
    isFinancialCalculated: true,
    totalAmount: 1000,
    status: 'pending',
    isCheckedIn: false,
    hostLoggedBy: 'Kanthida (คุณ)',
    verifiedBy: null,
    verifiedAt: null,
    notes: 'รอการรับรองสองทางจากน้องแนน',
    subtext: {
      th: 'รอการรับรองสองทางจากน้องแนน',
      en: 'Pending dual verification from N-Nan',
    },
    notesBilingual: {
      th: 'รอการรับรองสองทางจากน้องแนน',
      en: 'Pending dual verification from N-Nan',
    },
    color: 'emerald',
  },
  {
    id: 'chk-r1-07',
    roomId: 'room-1',
    memberId: 'mem-1-1',
    date: '2026-10-13',
    subject: 'การเคลื่อนที่แบบวงกลม',
    topic: {
      th: 'การเคลื่อนที่แบบวงกลม',
      en: 'Circular Motion',
    },
    title: {
      th: 'การเคลื่อนที่แบบวงกลม',
      en: 'Circular Motion',
    },
    studentName: 'น้องแนน (ศิริพร)',
    roomFormat: 'Zoom 02 (Online)',
    billingMode: 'duration',
    startTime: '16:00',
    endTime: '18:00',
    durationHours: 2.0,
    quantityUnits: 1,
    hourlyRate: 500,
    isFinancialCalculated: true,
    totalAmount: 1000,
    status: 'pending',
    isCheckedIn: false,
    hostLoggedBy: 'Kanthida (คุณ)',
    verifiedBy: null,
    verifiedAt: null,
    notes: 'การเช็กอินวันนี้ (13 ต.ค. 2569)',
    subtext: {
      th: 'การเช็กอินวันนี้ (13 ต.ค. 2569)',
      en: 'Check-in today (13 Oct 2026)',
    },
    notesBilingual: {
      th: 'การเช็กอินวันนี้ (13 ต.ค. 2569)',
      en: 'Check-in today (13 Oct 2026)',
    },
    color: 'orange',
  },

  // Member 2 in Room 1 (น้องแนน log study hours)
  {
    id: 'chk-r1-mem2-01',
    roomId: 'room-1',
    memberId: 'mem-1-2',
    date: '2026-10-02',
    subject: 'ทบทวนการบ้านฟิสิกส์ด้วยตนเอง',
    topic: {
      th: 'ทบทวนการบ้านฟิสิกส์ด้วยตนเอง',
      en: 'Self Physics Homework Review',
    },
    title: {
      th: 'ทบทวนการบ้านฟิสิกส์ด้วยตนเอง',
      en: 'Self Physics Homework Review',
    },
    studentName: 'น้องแนน (ศิริพร)',
    roomFormat: 'ห้องอ่านหนังสือ',
    billingMode: 'duration',
    startTime: '19:00',
    endTime: '20:30',
    durationHours: 1.5,
    quantityUnits: 1,
    hourlyRate: 0,
    isFinancialCalculated: false,
    totalAmount: 0,
    status: 'verified',
    isCheckedIn: true,
    hostLoggedBy: 'น้องแนน (ศิริพร)',
    verifiedBy: 'Kanthida (คุณ)',
    verifiedAt: '2026-10-02T21:00:00Z',
    notes: 'ส่งการบ้านข้อ 1-10 ทางแชตครบถ้วน',
    subtext: {
      th: 'ส่งการบ้านข้อ 1-10 ทางแชตครบถ้วน',
      en: 'Submitted homework 1-10 completely via chat',
    },
    notesBilingual: {
      th: 'ส่งการบ้านข้อ 1-10 ทางแชตครบถ้วน',
      en: 'Submitted homework 1-10 completely via chat',
    },
  },

  // Room 2 Sessions: Conversational Chinese HSK 4
  {
    id: 'chk-r2-01',
    roomId: 'room-2',
    memberId: 'mem-2-1',
    date: '2026-10-02',
    subject: 'ไวยากรณ์ HSK 4 บทที่ 1-2',
    topic: {
      th: 'ไวยากรณ์ HSK 4 บทที่ 1-2',
      en: 'HSK 4 Grammar Chapters 1-2',
    },
    title: {
      th: 'ไวยากรณ์ HSK 4 บทที่ 1-2',
      en: 'HSK 4 Grammar Chapters 1-2',
    },
    studentName: 'Kanthida (คุณ)',
    roomFormat: 'ห้องเรียน 301',
    billingMode: 'duration',
    startTime: '18:00',
    endTime: '20:00',
    durationHours: 2.0,
    quantityUnits: 1,
    hourlyRate: 400,
    isFinancialCalculated: true,
    totalAmount: 800,
    status: 'verified',
    isCheckedIn: true,
    hostLoggedBy: 'เหล่าซือหวัง',
    verifiedBy: 'Kanthida (คุณ)',
    verifiedAt: '2026-10-02T20:10:00Z',
    notes: 'ฝึกการใช้ 把字句 และ 被字句',
    subtext: {
      th: 'ฝึกการใช้ 把字句 และ 被字句',
      en: 'Practice using 把 and 被 sentence patterns',
    },
    notesBilingual: {
      th: 'ฝึกการใช้ 把字句 และ 被字句',
      en: 'Practice using 把 and 被 sentence patterns',
    },
  },
  {
    id: 'chk-r2-02',
    roomId: 'room-2',
    memberId: 'mem-2-1',
    date: '2026-10-05',
    subject: 'สนทนาสถานการณ์ธุรกิจและการท่องเที่ยว',
    topic: {
      th: 'สนทนาสถานการณ์ธุรกิจและการท่องเที่ยว',
      en: 'Business & Travel Conversation',
    },
    title: {
      th: 'สนทนาสถานการณ์ธุรกิจและการท่องเที่ยว',
      en: 'Business & Travel Conversation',
    },
    studentName: 'Kanthida (คุณ)',
    roomFormat: 'ห้องเรียน 301',
    billingMode: 'duration',
    startTime: '18:00',
    endTime: '20:00',
    durationHours: 2.0,
    quantityUnits: 1,
    hourlyRate: 400,
    isFinancialCalculated: true,
    totalAmount: 800,
    status: 'verified',
    isCheckedIn: true,
    hostLoggedBy: 'เหล่าซือหวัง',
    verifiedBy: 'Kanthida (คุณ)',
    verifiedAt: '2026-10-05T20:05:00Z',
    notes: 'Roleplay การเจรจาธุรกิจและสั่งอาหาร',
    subtext: {
      th: 'Roleplay การเจรจาธุรกิจและสั่งอาหาร',
      en: 'Roleplay: Business Negotiation & Dining',
    },
    notesBilingual: {
      th: 'Roleplay การเจรจาธุรกิจและสั่งอาหาร',
      en: 'Roleplay: Business Negotiation & Dining',
    },
  },
  {
    id: 'chk-r2-03',
    roomId: 'room-2',
    memberId: 'mem-2-1',
    date: '2026-10-09',
    subject: 'การอ่านบทความสั้นและการเขียนประโยค',
    topic: {
      th: 'การอ่านบทความสั้นและการเขียนประโยค',
      en: 'Short Article Reading & Sentence Writing',
    },
    title: {
      th: 'การอ่านบทความสั้นและการเขียนประโยค',
      en: 'Short Article Reading & Sentence Writing',
    },
    studentName: 'Kanthida (คุณ)',
    roomFormat: 'ห้องเรียน 301',
    billingMode: 'duration',
    startTime: '18:00',
    endTime: '20:00',
    durationHours: 2.0,
    quantityUnits: 1,
    hourlyRate: 400,
    isFinancialCalculated: true,
    totalAmount: 800,
    status: 'verified',
    isCheckedIn: true,
    hostLoggedBy: 'เหล่าซือหวัง',
    verifiedBy: 'Kanthida (คุณ)',
    verifiedAt: '2026-10-09T20:15:00Z',
    notes: 'ข้อสอบการอ่านส่วนที่ 2 HSK 4',
    subtext: {
      th: 'ข้อสอบการอ่านส่วนที่ 2 HSK 4',
      en: 'HSK 4 Reading Section Part 2',
    },
    notesBilingual: {
      th: 'ข้อสอบการอ่านส่วนที่ 2 HSK 4',
      en: 'HSK 4 Reading Section Part 2',
    },
  },

  // Room 3 Sessions: Nail & Spa Technician
  {
    id: 'chk-r3-01',
    roomId: 'room-3',
    memberId: 'mem-3-2',
    date: '2026-10-01',
    subject: 'กะงานบ่าย - ช่างทำเล็บ',
    topic: {
      th: 'กะงานบ่าย - ช่างทำเล็บ',
      en: 'Afternoon Shift - Nail Technician',
    },
    title: {
      th: 'กะงานบ่าย - ช่างทำเล็บ',
      en: 'Afternoon Shift - Nail Technician',
    },
    studentName: 'ช่างแพรวา',
    partnerName: {
      th: 'ช่างแพรวา',
      en: 'Technician Praewa',
    },
    studentNameBilingual: {
      th: 'ช่างแพรวา',
      en: 'Technician Praewa',
    },
    roomFormat: 'สาขา 1 (โซน A)',
    billingMode: 'duration',
    startTime: '13:00',
    endTime: '20:00',
    durationHours: 7.0,
    quantityUnits: 1,
    hourlyRate: 150,
    isFinancialCalculated: true,
    totalAmount: 1050,
    status: 'verified',
    isCheckedIn: true,
    hostLoggedBy: 'Kanthida (คุณ)',
    verifiedBy: 'ช่างแพรวา',
    verifiedAt: '2026-10-01T20:10:00Z',
    notes: 'ดูแลลูกค้าสปามือเท้าและทาสีเจล',
    subtext: {
      th: 'ดูแลลูกค้าสปามือเท้าและทาสีเจล',
      en: 'Hand & Foot Spa and Gel Polish Services',
    },
    notesBilingual: {
      th: 'ดูแลลูกค้าสปามือเท้าและทาสีเจล',
      en: 'Hand & Foot Spa and Gel Polish Services',
    },
  },
  {
    id: 'chk-r3-02',
    roomId: 'room-3',
    memberId: 'mem-3-3',
    date: '2026-10-01',
    subject: 'กะงานบ่าย - ช่างเพ้นท์เล็บและต่อขนตา',
    topic: {
      th: 'กะงานบ่าย - ช่างเพ้นท์เล็บและต่อขนตา',
      en: 'Afternoon Shift - Nail Art & Lash Specialist',
    },
    title: {
      th: 'กะงานบ่าย - ช่างเพ้นท์เล็บและต่อขนตา',
      en: 'Afternoon Shift - Nail Art & Lash Specialist',
    },
    studentName: 'ช่างจอย',
    partnerName: {
      th: 'ช่างจอย',
      en: 'Technician Joy',
    },
    studentNameBilingual: {
      th: 'ช่างจอย',
      en: 'Technician Joy',
    },
    roomFormat: 'สาขา 1 (โซน B)',
    billingMode: 'duration',
    startTime: '13:00',
    endTime: '20:00',
    durationHours: 7.0,
    quantityUnits: 1,
    hourlyRate: 150,
    isFinancialCalculated: true,
    totalAmount: 1050,
    status: 'verified',
    isCheckedIn: true,
    hostLoggedBy: 'Kanthida (คุณ)',
    verifiedBy: 'ช่างจอย',
    verifiedAt: '2026-10-01T20:12:00Z',
    notes: 'งานเพ้นท์ลายกราฟิกและต่อขนตาเส้นต่อเส้น',
    subtext: {
      th: 'งานเพ้นท์ลายกราฟิกและต่อขนตาเส้นต่อเส้น',
      en: 'Graphic Nail Art & One-by-one Lash Extensions',
    },
    notesBilingual: {
      th: 'งานเพ้นท์ลายกราฟิกและต่อขนตาเส้นต่อเส้น',
      en: 'Graphic Nail Art & One-by-one Lash Extensions',
    },
  },
  {
    id: 'chk-r3-03',
    roomId: 'room-3',
    memberId: 'mem-3-2',
    date: '2026-10-05',
    subject: 'กะงานบ่าย - ช่างทำเล็บ',
    topic: {
      th: 'กะงานบ่าย - ช่างทำเล็บ',
      en: 'Afternoon Shift - Nail Technician',
    },
    title: {
      th: 'กะงานบ่าย - ช่างทำเล็บ',
      en: 'Afternoon Shift - Nail Technician',
    },
    studentName: 'ช่างแพรวา',
    partnerName: {
      th: 'ช่างแพรวา',
      en: 'Technician Praewa',
    },
    studentNameBilingual: {
      th: 'ช่างแพรวา',
      en: 'Technician Praewa',
    },
    roomFormat: 'สาขา 1 (โซน A)',
    billingMode: 'duration',
    startTime: '13:00',
    endTime: '20:00',
    durationHours: 7.0,
    quantityUnits: 1,
    hourlyRate: 150,
    isFinancialCalculated: true,
    totalAmount: 1050,
    status: 'verified',
    isCheckedIn: true,
    hostLoggedBy: 'Kanthida (คุณ)',
    verifiedBy: 'ช่างแพรวา',
    verifiedAt: '2026-10-05T20:05:00Z',
    notes: 'ดูแลลูกค้าสปามือเท้าและทาสีเจล',
    subtext: {
      th: 'ดูแลลูกค้าสปามือเท้าและทาสีเจล',
      en: 'Hand & Foot Spa and Gel Polish Services',
    },
    notesBilingual: {
      th: 'ดูแลลูกค้าสปามือเท้าและทาสีเจล',
      en: 'Hand & Foot Spa and Gel Polish Services',
    },
  },

  // Room 4 Sessions: Clinic Assistant & Receptionist
  {
    id: 'chk-r4-01',
    roomId: 'room-4',
    memberId: 'mem-4-1',
    date: '2026-10-02',
    subject: 'เวรเคาน์เตอร์บริการผู้ป่วยและรับสายบัตรนัด',
    topic: {
      th: 'เวรเคาน์เตอร์บริการผู้ป่วยและรับสายบัตรนัด',
      en: 'Front Desk & Patient Appointment Management',
    },
    title: {
      th: 'เวรเคาน์เตอร์บริการผู้ป่วยและรับสายบัตรนัด',
      en: 'Front Desk & Patient Appointment Management',
    },
    studentName: 'Kanthida (คุณ)',
    roomFormat: 'เคาน์เตอร์หน้า ชั้น 1',
    billingMode: 'duration',
    startTime: '09:00',
    endTime: '18:00',
    durationHours: 9.0,
    quantityUnits: 1,
    hourlyRate: 120,
    isFinancialCalculated: true,
    totalAmount: 1080,
    status: 'verified',
    isCheckedIn: true,
    hostLoggedBy: 'พญ.ปิยะพร',
    verifiedBy: 'Kanthida (คุณ)',
    verifiedAt: '2026-10-02T18:15:00Z',
    notes: 'บันทึกประวัติคนไข้ใหม่ 18 ราย ประสานคิวแพทย์',
    subtext: {
      th: 'บันทึกประวัติคนไข้ใหม่ 18 ราย ประสานคิวแพทย์',
      en: 'Recorded 18 New Patient Profiles & Queued Physicians',
    },
    notesBilingual: {
      th: 'บันทึกประวัติคนไข้ใหม่ 18 ราย ประสานคิวแพทย์',
      en: 'Recorded 18 New Patient Profiles & Queued Physicians',
    },
  },
  {
    id: 'chk-r4-02',
    roomId: 'room-4',
    memberId: 'mem-4-1',
    date: '2026-10-06',
    subject: 'เวรเคาน์เตอร์บริการผู้ป่วยและรับสายบัตรนัด',
    topic: {
      th: 'เวรเคาน์เตอร์บริการผู้ป่วยและรับสายบัตรนัด',
      en: 'Front Desk & Patient Appointment Management',
    },
    title: {
      th: 'เวรเคาน์เตอร์บริการผู้ป่วยและรับสายบัตรนัด',
      en: 'Front Desk & Patient Appointment Management',
    },
    studentName: 'Kanthida (คุณ)',
    roomFormat: 'เคาน์เตอร์หน้า ชั้น 1',
    billingMode: 'duration',
    startTime: '09:00',
    endTime: '18:00',
    durationHours: 9.0,
    quantityUnits: 1,
    hourlyRate: 120,
    isFinancialCalculated: true,
    totalAmount: 1080,
    status: 'verified',
    isCheckedIn: true,
    hostLoggedBy: 'พญ.ปิยะพร',
    verifiedBy: 'Kanthida (คุณ)',
    verifiedAt: '2026-10-06T18:10:00Z',
    notes: 'ดูแลระบบนัดหมายออนไลน์ ตรวจสอบความถูกต้อง',
    subtext: {
      th: 'ดูแลระบบนัดหมายออนไลน์ ตรวจสอบความถูกต้อง',
      en: 'Online Booking Maintenance & Accuracy Verification',
    },
    notesBilingual: {
      th: 'ดูแลระบบนัดหมายออนไลน์ ตรวจสอบความถูกต้อง',
      en: 'Online Booking Maintenance & Accuracy Verification',
    },
  },
];
