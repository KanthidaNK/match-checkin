export type BillingMode = 'duration' | 'unit';
export type CheckinStatus = 'verified' | 'pending' | 'rejected';
export type UserRole = 'host' | 'client' | 'observer';

export interface BilingualText {
  th: string;
  en: string;
}

export interface CheckinSession {
  id: string;
  roomId?: string;
  memberId?: string;
  date: string; // YYYY-MM-DD
  subject: string; // วิชา / ชื่องาน (fallback)
  topic?: BilingualText; // { th: string, en: string }
  title?: BilingualText; // alias for topic
  studentName: string; // ผู้เรียน / คู่เช็กอิน
  partnerName?: BilingualText; // { th: string, en: string }
  studentNameBilingual?: BilingualText; // alias for partnerName
  roomFormat: string; // รูปแบบ/สถานที่
  billingMode: BillingMode;
  startTime: string; // "15:15"
  endTime: string; // "17:15"
  durationHours: number; // e.g. 2.0
  quantityUnits: number; // e.g. 1
  hourlyRate: number; // อัตราข้อตกลงต่อชั่วโมง (บาท)
  isFinancialCalculated: boolean;
  totalAmount: number;
  status: CheckinStatus;
  isCheckedIn?: boolean;
  hostLoggedBy: string;
  verifiedBy: string | null;
  verifiedAt: string | null;
  notes?: string;
  subtext?: BilingualText; // { th: string, en: string }
  notesBilingual?: BilingualText; // alias for subtext
  rejectionReason?: string;
  color?: string; // Pastel color id e.g. 'indigo', 'rose', 'sky'
}

export interface RoomMember {
  id: string;
  name: string;
  roleTitle: string;
  isCurrentUser?: boolean;
}

export interface RoomContextData {
  roomId: string;
  title: string; // ชื่องาน / ชื่อวิชา
  titleBilingual?: BilingualText;
  location: string; // สถานที่ / สถาบัน / โรงเรียน
  locationBilingual?: BilingualText;
  creator: string;
  creatorBilingual?: BilingualText;
  currentRoleLabel: string;
  capacityText: string;
  members: RoomMember[];
  passcode: string;
  pairPasscode: string; // Key A: รหัสคู่เช็กอิน MATCH-XXXX
  observerPasscode: string; // Key B: รหัสผู้ตรวจการ AUDIT-XXXX
  currentRole: UserRole;
  roomName: string;
  subjectCategory: string;
  hostName: string;
  clientName: string;
  clientNameBilingual?: BilingualText;
  partnerName?: BilingualText;
  observerName: string;
  workType?: string; // ลักษณะงาน หรือ ประเภทงาน (freeform text)
  workTypeBilingual?: BilingualText;
  subtitleBilingual?: BilingualText;
  startDate?: string; // วันที่เริ่มต้น
  endDate?: string; // วันที่สิ้นสุด
  billingMode?: BillingMode;
  hourlyRate?: number;
  notes?: string;
  isPinned?: boolean;
  themeColor?: string;
}

export interface AuditedRoomRecord {
  roomId: string;
  passcode: string;
  customTitle?: string;       // Local alias for card header title only
  customAuditColor?: string;  // Local card pastel theme
  lastAccessed: string;
}
