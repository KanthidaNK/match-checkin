export type Locale = 'th' | 'en';

export const modalTranslations = {
  th: {
    // Edit Check-in Modal ("แก้ไขการเช็กอิน")
    editCheckinTitle: 'แก้ไขการเช็กอิน',
    dateTimeLabel: 'วันที่ และ เวลา',
    topicDetailsLabel: 'รายละเอียดงาน / หัวข้อ',
    partnerLabel: 'คู่เช็กอิน',
    descriptionLabel: 'รายละเอียด',
    sessionColorLabel: 'สีแท็กการเช็กอิน (Session Color)',
    cancelBtn: 'ยกเลิก',
    saveBtn: 'บันทึก',
    startTimeLabel: 'เวลาเริ่มต้น',
    endTimeLabel: 'เวลาสิ้นสุด',
    durationLabel: 'ระยะเวลา (ชั่วโมง)',
    hourlyRateLabel: 'อัตราข้อตกลง (บาท/ชม.)',
    totalAmountLabel: 'ยอดรวมคำนวณ (บาท)',
    topicPlaceholder: 'เช่น ฟิสิกส์ ม.4 บทนำและเวกเตอร์',
    notesPlaceholder: 'ระบุรายละเอียดเพิ่มเติม...',

    // Inspection Modal (Read-Only Popover)
    inspectionTitle: 'รายละเอียดการเช็กอิน',
    confirmDeleteTitle: 'ยืนยันการลบรายการ',
    confirmDeleteBody: 'คุณยืนยันที่จะลบรายการนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้',
    deleteBtn: 'ยืนยันการลบ',
    verifyBtn: 'รับรองรายการ',
    verifiedStatus: 'ตรวจสอบและรับรองแล้ว',
    pendingStatus: 'รอการตรวจสอบสองทาง',

    // Create Room & Passcode Modals
    createRoomTitle: 'สร้างห้องเช็กอินใหม่',
    editRoomTitle: 'แก้ไขห้อง',
    confirmDeleteRoomTitle: 'ยืนยันการลบห้องเช็กอิน',
    confirmDeleteRoomBody: 'คุณยืนยันที่จะลบห้องนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้',
    pinRoom: 'ปักหมุด',
    unpinRoom: 'ถอนหมุด',
    deleteRoom: 'ลบห้อง',
    roomNameLabel: 'ชื่อห้อง / ชื่อวิชา (จำเป็น)',
    roomNamePlaceholder: 'เช่น ฟิสิกส์ ม.4 น้องแนน, งานช่างทำเล็บกะบ่าย',
    locationLabel: 'สถานที่ / สถาบัน / โรงเรียน',
    onlineBtn: 'ออนไลน์',
    onsiteBtn: 'Onsite / สถานที่',
    onlinePlaceholder: 'ระบุแพลตฟอร์ม เช่น Zoom 02, Google Meet, Microsoft Teams...',
    onsitePlaceholder: 'ระบุสถานที่ เช่น Zoom 02, กวดวิชาฟิสิกส์เตรียมวิศวะ, ร้านสาขา 1...',
    workTypeLabel: 'ลักษณะงาน หรือ ประเภทงาน',
    workTypePlaceholder: 'เช่น กวดวิชาและเตรียมสอบแข่งขัน, บริการทำเล็บและสปา...',
    yourRoleLabel: 'บทบาทของคุณ',
    otherRolePlaceholder: 'ระบุบทบาทของคุณ เช่น ผู้จัดการสาขา, พี่เลี้ยง...',
    checkinPeriodLabel: 'ช่วงเวลาการเช็กอิน',
    startDateLabel: 'วันที่เริ่มต้น:',
    endDateLabel: 'วันที่สิ้นสุด:',
    calculationEngineLabel: 'รูปแบบการคิดคำนวณ (Calculation Engine)',
    hourlyEngineBtn: 'คำนวณตามชั่วโมง (Duration Engine)',
    unitEngineBtn: 'คำนวณตามหน่วย / ครั้ง (Unit Engine)',
    agreedRateLabel: 'อัตราข้อตกลงต่อชั่วโมง (บาท)',
    roomCapacityLabel: 'จำนวนสมาชิกในห้อง',
    enterPasscodeTitle: 'ใส่ Passcode เข้าร่วม',
    enterPasscodeDesc: 'กรอกรหัสคู่เช็กอิน (MATCH-XXXX) หรือ รหัสผู้ตรวจการ (AUDIT-XXXX)',
    passcodePlaceholder: 'เช่น MATCH-8821 หรือ AUDIT-9902',
    joinRoomBtn: 'เข้าร่วมห้องเช็กอิน',
    dualKeySectionTitle: 'ระบบสิทธิ์สองทาง (Dual-Key Access Architecture)',
    pairCodeLabel: 'รหัสคู่เช็กอิน (Pair Passcode) — สำหรับสมาชิก / ผู้ร่วมเช็กอิน (Read & Write)',
    observerCodeLabel: 'รหัสผู้ตรวจการ (Observer Passcode) — สำหรับผู้ปกครอง / ออดิท (Read-Only)',
    randomizeBtn: 'สุ่มรหัส (Generate)',
    notesFieldLabel: 'หมายเหตุ (Notes):',
  },
  en: {
    // Edit Check-in Modal ("แก้ไขการเช็กอิน")
    editCheckinTitle: 'Edit Check-in',
    dateTimeLabel: 'Date & Time',
    topicDetailsLabel: 'Topic / Details',
    partnerLabel: 'Check-in Partner',
    descriptionLabel: 'Description',
    sessionColorLabel: 'Session Tag Color',
    cancelBtn: 'Cancel',
    saveBtn: 'Save',
    startTimeLabel: 'Start Time',
    endTimeLabel: 'End Time',
    durationLabel: 'Duration (Hours)',
    hourlyRateLabel: 'Agreed Rate (THB/hr)',
    totalAmountLabel: 'Calculated Total (THB)',
    topicPlaceholder: 'e.g., Physics G10 Intro & Vectors',
    notesPlaceholder: 'Enter additional details...',

    // Inspection Modal (Read-Only Popover)
    inspectionTitle: 'Check-in Record Details',
    confirmDeleteTitle: 'Confirm Deletion',
    confirmDeleteBody: 'Are you sure you want to delete this session? This action cannot be undone.',
    deleteBtn: 'Delete',
    verifyBtn: 'Verify Session',
    verifiedStatus: 'Verified & Approved',
    pendingStatus: 'Pending Dual Verification',

    // Create Room & Passcode Modals
    createRoomTitle: 'Create New Check-in Room',
    editRoomTitle: 'Edit Room',
    confirmDeleteRoomTitle: 'Confirm Room Deletion',
    confirmDeleteRoomBody: 'Are you sure you want to delete this room? This action cannot be undone.',
    pinRoom: 'Pin',
    unpinRoom: 'Unpin',
    deleteRoom: 'Delete Room',
    roomNameLabel: 'Room / Course Name (Required)',
    roomNamePlaceholder: 'e.g., Physics G10 N-Nan, Afternoon Nail Shift',
    locationLabel: 'Location / Institution',
    onlineBtn: 'Online',
    onsiteBtn: 'Onsite / Venue',
    onlinePlaceholder: 'Specify platform, e.g., Zoom 02, Google Meet, Microsoft Teams...',
    onsitePlaceholder: 'Specify venue, e.g., Zoom 02, Prep-Engineering Physics, Branch 1...',
    workTypeLabel: 'Work / Service Category',
    workTypePlaceholder: 'e.g., Exam Tutoring, Nail & Spa Services...',
    yourRoleLabel: 'Your Role',
    otherRolePlaceholder: 'Specify your role, e.g., Branch Manager, Mentor...',
    checkinPeriodLabel: 'Check-in Period',
    startDateLabel: 'Start Date:',
    endDateLabel: 'End Date:',
    calculationEngineLabel: 'Calculation Engine',
    hourlyEngineBtn: 'Hourly Duration Engine',
    unitEngineBtn: 'Unit / Per-session Engine',
    agreedRateLabel: 'Agreed Hourly Rate (THB)',
    roomCapacityLabel: 'Room Capacity',
    enterPasscodeTitle: 'Enter Join Passcode',
    enterPasscodeDesc: 'Enter Pair Passcode (MATCH-XXXX) or Observer Passcode (AUDIT-XXXX)',
    passcodePlaceholder: 'e.g., MATCH-8821 or AUDIT-9902',
    joinRoomBtn: 'Join Workspace',
    dualKeySectionTitle: 'Dual-Key Access Architecture',
    pairCodeLabel: 'Pair Passcode — For Members / Check-in Partners (Read & Write)',
    observerCodeLabel: 'Observer Passcode — For Parents / Audit Observers (Read-Only)',
    randomizeBtn: 'Generate Code',
    notesFieldLabel: 'Notes:',
  },
};

export const translations = {
  th: {
    // Top Navigation & Branding
    back: 'ย้อนกลับ',
    brandTitle: 'จับคู่เช็กอิน',
    subtitle: 'ระบบบันทึกเวลาและตรวจสอบการเช็กอินสองทาง',
    exportFooterText: 'เอกสารนี้สร้างขึ้นโดยอัตโนมัติจากระบบจับคู่เช็กอิน ที่พัฒนาโดย GraviTask WebApplication...',

    // Landing Hub Actions & Filters
    searchPlaceholder: 'ค้นหาห้องเช็กอิน...',
    enterPasscode: 'ใส่ Passcode เข้าร่วม',
    createNewRoom: 'สร้างห้องเช็กอินใหม่',
    enterWorkspace: 'เข้าสู่ห้องเช็กอิน...',

    // Role Badges & Labels
    teacherRole: 'ครู / ติวเตอร์',
    studentRole: 'นักเรียน',
    ownerRole: 'เจ้าของกิจการ',
    staffRole: 'พนักงาน',
    parentRole: 'ผู้ปกครอง / คู่เช็กอิน',
    inspectorRole: 'ครูผู้สอน / ผู้ตรวจการ',

    // Workspace Action Strip
    saveAsImage: 'บันทึกเป็นรูปภาพ',
    checkinToday: 'เช็กอินวันนี้',
    checkedInToday: 'คุณเช็กอินวันนี้แล้ว',
    editCheckin: 'แก้ไขการเช็กอิน',
    roomList: 'รายชื่อห้อง:',

    // Calendar Metrics & Summaries
    recordedSessions: (count: number) => `บันทึกแล้ว: ${count} ครั้ง`,
    totalHours: (hours: number | string) => `ชั่วโมงรวม: ${hours} ชม.`,
    netTotal: (amount: string) => `ยอดสุทธิ: ${amount} บาท`,

    // Days of Week
    weekDays: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],

    // Table Headers
    colNo: 'ลำดับ',
    colDate: 'วันที่',
    colTopic: 'รายละเอียดงาน / หัวข้อ',
    colTime: 'ช่วงเวลา',
    colDuration: 'ระยะเวลา (ชม.)',
    colRate: 'อัตราข้อตกลง',
    colTotal: 'ยอดรวม (บาท)',

    // Additional common UI terms
    monthlySummary: (monthName: string) => `ใบสรุปการเช็กอินเดือน${monthName}`,
    creator: 'ผู้สร้าง',
    location: 'สถานที่',
    period: 'ช่วงเวลา',
    rateUnit: 'บาท/ชั่วโมง',
    rateCountUnit: 'บาท/ครั้ง',
    verified: 'ตรวจสอบแล้ว',
    pending: 'รอตรวจสอบ',
    rejected: 'ปฏิเสธ',
  },
  en: {
    // Top Navigation & Branding
    back: 'Back',
    brandTitle: 'Match Check-in',
    subtitle: 'Dual Check-in & Verification System',
    exportFooterText: 'Automatically generated by Match Check-in, powered by GraviTask WebApplication...',

    // Landing Hub Actions & Filters
    searchPlaceholder: 'Search check-in rooms...',
    enterPasscode: 'Enter Passcode',
    createNewRoom: 'Create New Room',
    enterWorkspace: 'Enter Workspace',

    // Role Badges & Labels
    teacherRole: 'Tutor / Teacher',
    studentRole: 'Student',
    ownerRole: 'Business Owner',
    staffRole: 'Staff / Employee',
    parentRole: 'Parent / Partner',
    inspectorRole: 'Teacher / Inspector',

    // Workspace Action Strip
    saveAsImage: 'Save as Image',
    checkinToday: 'Check In Today',
    checkedInToday: 'Checked In Today',
    editCheckin: 'Edit Check-in',
    roomList: 'Room List:',

    // Calendar Metrics & Summaries
    recordedSessions: (count: number) => `Recorded: ${count} sessions`,
    totalHours: (hours: number | string) => `Total Hours: ${hours} hrs`,
    netTotal: (amount: string) => `Net Total: ${amount} THB`,

    // Days of Week
    weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

    // Table Headers
    colNo: 'No.',
    colDate: 'Date',
    colTopic: 'Session Topic / Details',
    colTime: 'Time',
    colDuration: 'Duration (hrs)',
    colRate: 'Rate',
    colTotal: 'Total (THB)',

    // Additional common UI terms
    monthlySummary: (monthName: string) => `Check-in Summary Ledger - ${monthName}`,
    creator: 'Created by',
    location: 'Location',
    period: 'Period',
    rateUnit: 'THB/hr',
    rateCountUnit: 'THB/session',
    verified: 'Verified',
    pending: 'Pending',
    rejected: 'Rejected',
  },
};

const TH_MONTHS = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

const TH_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const EN_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const EN_MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function formatDateByLocale(dateStr: string, locale: Locale): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (locale === 'th') {
    const buddhistYear = year + 543;
    const monthName = TH_MONTHS[monthIdx] || `${monthIdx + 1}`;
    return `${day} ${monthName} ${buddhistYear}`;
  } else {
    const monthName = EN_MONTHS[monthIdx] || `${monthIdx + 1}`;
    return `${day} ${monthName} ${year}`;
  }
}

export function getMonthNameByLocale(monthIdx: number, locale: Locale, full = false): string {
  if (locale === 'th') {
    return full ? TH_MONTHS_FULL[monthIdx] || '' : TH_MONTHS[monthIdx] || '';
  } else {
    return full ? EN_MONTHS_FULL[monthIdx] || '' : EN_MONTHS[monthIdx] || '';
  }
}

export function translateRole(roleLabel: string | undefined, locale: Locale): string {
  if (!roleLabel) return '';
  if (locale === 'en') {
    if (roleLabel.includes('ครู') || roleLabel.includes('ติวเตอร์')) return 'Tutor / Teacher';
    if (roleLabel.includes('นักเรียน')) return 'Student';
    if (roleLabel.includes('เจ้าของกิจการ')) return 'Business Owner';
    if (roleLabel.includes('พนักงาน')) return 'Staff / Employee';
    if (roleLabel.includes('ผู้ปกครอง')) return 'Parent / Partner';
    if (roleLabel.includes('ผู้ตรวจการ')) return 'Teacher / Inspector';
  }
  return roleLabel;
}

// Session topics mapping dictionary across all 4 rooms
const SESSION_TOPIC_MAP_EN: Record<string, string> = {
  // Room 1: Physics G10 N-Nan
  'ฟิสิกส์ ม.4 บทนำและเวกเตอร์': 'Physics G10 Intro & Vectors',
  'ทบทวนการบ้านฟิสิกส์ด้วยตนเอง': 'Self Physics Homework Review',
  'การเคลื่อนที่แนวตรง 1 มิติ': '1D Linear Motion',
  'การตกแบบเสรี (Free Fall)': 'Free Fall Motion',
  'กฎการเคลื่อนที่ของนิวตัน': "Newton's Laws of Motion",
  'แรงเสียดทานและแรงดึงเชือก Free-body diagram': 'Friction & Tension Free-body diagram',
  'ตะลุยโจทย์สอบกลางภาค': 'Midterm Exam Practice',
  'การเคลื่อนที่แบบโพรเจกไทล์': 'Projectile Motion',
  'การเคลื่อนที่แบบวงกลม': 'Circular Motion',
  'ฟิสิกส์ ม.4 น้องแนน (Zoom 02)': 'Physics G10 N-Nan (Zoom 02)',

  // Room 2: Conversational Chinese HSK 4
  'ไวยากรณ์ HSK 4 บทที่ 1-2': 'HSK 4 Grammar Chapters 1-2',
  'สนทนาสถานการณ์ธุรกิจและการท่องเที่ยว': 'Business & Travel Conversation',
  'การอ่านบทความสั้นและการเขียนประโยค': 'Short Article Reading & Sentence Writing',
  'สนทนาภาษาจีน HSK 4 (สถาบันภาษาเอเชียตะวันออก)': 'Conversational Chinese HSK 4 (East Asia Language Institute)',

  // Room 3: Nail & Spa Technician
  'กะงานบ่าย - ช่างทำเล็บ': 'Afternoon Shift - Nail Technician',
  'กะงานบ่าย - ช่างทำเล็บเจล & สปา': 'Afternoon Shift - Nail Technician',
  'กะงานบ่าย - ช่างเพ้นท์เล็บ & สปา': 'Afternoon Shift - Nail Art & Lash Specialist',
  'กะงานบ่าย - ช่างเพ้นท์เล็บและต่อขนตา': 'Afternoon Shift - Nail Art & Lash Specialist',
  'งานช่างทำเล็บและสปา (ร้าน Nail & Beauty Studio สาขา 1)': 'Nail & Spa Technician (Nail & Beauty Studio Branch 1)',

  // Room 4: Clinic Assistant & Receptionist
  'เวรเคาน์เตอร์บริการผู้ป่วยและรับสายบัตรนัด': 'Front Desk & Patient Appointment Management',
  'ผู้ช่วยเคาน์เตอร์และประสานงานคลินิก (คลินิกเวชกรรมความงาม เดอะพรีเมียร์)': 'Clinic Assistant & Receptionist (The Premier Aesthetic Clinic)',
};

// Session subtext / notes mapping dictionary
const SESSION_NOTES_MAP_EN: Record<string, string> = {
  // Room 1
  'ทบทวนการแตกเวกเตอร์และการหาแรงลัพธ์': 'Review vector decomposition & resultant force',
  'สมการ 5 สูตรการเคลื่อนที่และการอ่านกราฟ s-t, v-t': '5 motion equations and reading s-t, v-t graphs',
  'ทำแบบฝึกหัด 15 ข้อ น้องแนนเข้าใจดีมาก': 'Practiced 15 problems, understood very well',
  'แรงเสียดทานและแรงดึงเชือก Free-body diagram': 'Friction & Tension Free-body diagram',
  'เก็งข้อสอบโรงเรียน 25 ข้อ': 'School exam preparation 25 questions',
  'รอการรับรองสองทางจากน้องแนน': 'Pending dual verification from N-Nan',
  'การเช็กอินวันนี้ (13 ต.ค. 2569)': 'Check-in today (13 Oct 2026)',
  'ส่งการบ้านข้อ 1-10 ทางแชตครบถ้วน': 'Submitted homework 1-10 completely via chat',

  // Room 2
  'ฝึกการใช้ 把字句 และ 被字句': 'Practice using 把 and 被 sentence patterns',
  'Roleplay การเจรจาธุรกิจและสั่งอาหาร': 'Roleplay: Business Negotiation & Dining',
  'ข้อสอบการอ่านส่วนที่ 2 HSK 4': 'HSK 4 Reading Section Part 2',

  // Room 3
  'ดูแลลูกค้าสปามือเท้าและทาสีเจล': 'Hand & Foot Spa and Gel Polish Services',
  'งานเพ้นท์ลายกราฟิกและต่อขนตาเส้นต่อเส้น': 'Graphic Nail Art & One-by-one Lash Extensions',
  'บริการลูกค้า 5 คิว ทำงานเรียบร้อย': 'Handled 5 clients, completed with quality',
  'บริการลูกค้า 4 คิว เพ้นท์ลายพิเศษ': 'Handled 4 clients, custom graphic art',
  'เช็กสต็อกสีเจลก่อนปิดกะ': 'Checked gel polish inventory before shift end',

  // Room 4
  'บันทึกประวัติคนไข้ใหม่ 18 ราย ประสานคิวแพทย์': 'Recorded 18 New Patient Profiles & Queued Physicians',
  'ดูแลระบบนัดหมายออนไลน์ ตรวจสอบความถูกต้อง': 'Online Booking Maintenance & Accuracy Verification',
};

export function translateSessionSubject(subject: string | undefined, locale: Locale): string {
  if (!subject) return '';
  if (locale === 'en') {
    return SESSION_TOPIC_MAP_EN[subject] || subject;
  }
  return subject;
}

export function translateSessionNotes(notes: string | undefined, locale: Locale): string {
  if (!notes) return '';
  if (locale === 'en') {
    return SESSION_NOTES_MAP_EN[notes] || notes;
  }
  return notes;
}

// Universal session topic resolver strictly respecting bilingual schema
export function getSessionTopic(session: any, locale: Locale): string {
  if (!session) return '';
  if (session.topic && session.topic[locale]) return session.topic[locale];
  if (session.title && typeof session.title === 'object' && session.title[locale]) return session.title[locale];
  return translateSessionSubject(session.subject || session.title || session.topic, locale);
}

// Universal session subtext resolver strictly respecting bilingual schema
export function getSessionSubtext(session: any, locale: Locale): string {
  if (!session) return '';
  if (session.subtext && session.subtext[locale]) return session.subtext[locale];
  if (session.notesBilingual && session.notesBilingual[locale]) return session.notesBilingual[locale];
  return translateSessionNotes(session.notes, locale);
}

// Room metadata translation map with 100% full bilingual schema
export function translateRoomData(room: any, locale: Locale): any {
  if (!room) return room;
  const isEn = locale === 'en';

  let title = room.titleBilingual ? room.titleBilingual[locale] : room.title || room.roomName;
  let location = room.locationBilingual ? room.locationBilingual[locale] : room.location;
  let creator = room.creatorBilingual ? room.creatorBilingual[locale] : room.creator;
  let workType = room.workTypeBilingual ? room.workTypeBilingual[locale] : room.workType;

  if (room.roomId === 'room-1') {
    title = isEn ? 'Physics G10 N-Nan (Zoom 02)' : 'ฟิสิกส์ ม.4 น้องแนน (Zoom 02)';
    location = isEn ? 'Prep-Engineering Physics Tutoring (Zoom 02)' : 'กวดวิชาฟิสิกส์เตรียมวิศวะ (Zoom 02)';
    creator = isEn ? 'Kanthida (You)' : 'Kanthida (คุณ)';
    workType = isEn ? 'Tutoring & Competitive Exam Prep' : 'กวดวิชาและเตรียมสอบแข่งขัน';
  } else if (room.roomId === 'room-2') {
    title = isEn ? 'Conversational Chinese HSK 4 (East Asia Language Institute)' : 'สนทนาภาษาจีน HSK 4 (สถาบันภาษาเอเชียตะวันออก)';
    location = isEn ? 'East Asia Language Institute' : 'สถาบันภาษาเอเชียตะวันออก';
    creator = isEn ? 'Laoshi Wang' : 'เหล่าซือหวัง';
    workType = isEn ? 'Language Course & Business Conversation' : 'หลักสูตรภาษาและการสนทนาเชิงธุรกิจ';
  } else if (room.roomId === 'room-3') {
    title = isEn ? 'Nail & Spa Technician (Nail & Beauty Studio Branch 1)' : 'งานช่างทำเล็บและสปา (ร้าน Nail & Beauty Studio สาขา 1)';
    location = isEn ? 'Nail & Beauty Studio Branch 1' : 'ร้าน Nail & Beauty Studio สาขา 1';
    creator = isEn ? 'Kanthida (You)' : 'Kanthida (คุณ)';
    workType = isEn ? 'Beauty Services, Nails, Spa & Eyelash Extensions' : 'บริการเสริมความงาม ทำเล็บ สปา และต่อขนตา';
  } else if (room.roomId === 'room-4') {
    title = isEn ? 'Clinic Assistant & Receptionist (The Premier Aesthetic Clinic)' : 'ผู้ช่วยเคาน์เตอร์และประสานงานคลินิก (คลินิกเวชกรรมความงาม เดอะพรีเมียร์)';
    location = isEn ? 'The Premier Aesthetic Clinic' : 'คลินิกเวชกรรมความงาม เดอะพรีเมียร์';
    creator = isEn ? 'Dr. Piyaporn' : 'พญ.ปิยะพร';
    workType = isEn ? 'Front Desk, Appointment Coordination & Medical Records' : 'งานต้อนรับ ประสานงานนัดหมาย และจัดการเวชระเบียน';
  } else {
    if (isEn && creator === 'Kanthida (คุณ)') creator = 'Kanthida (You)';
  }

  let clientName = room.clientName;
  if (room.clientNameBilingual && room.clientNameBilingual[locale]) {
    clientName = room.clientNameBilingual[locale];
  } else if (room.partnerName && room.partnerName[locale]) {
    clientName = room.partnerName[locale];
  } else if (isEn) {
    if (clientName === 'ช่างแพรวา') clientName = 'Technician Praewa';
    else if (clientName === 'น้องแนน (ศิริพร)') clientName = 'N-Nan (Siriporn)';
    else if (clientName === 'Kanthida (คุณ)') clientName = 'Kanthida (You)';
    else if (clientName === 'ทีมช่างประจำสาขา 1') clientName = 'Technician Praewa';
    else if (clientName === 'เหล่าซือหวัง') clientName = 'Laoshi Wang';
    else if (clientName === 'พญ.ปิยะพร') clientName = 'Dr. Piyaporn';
    else if (clientName === 'คู่เช็กอิน') clientName = 'Check-in Partner';
  } else {
    if (clientName === 'Technician Praewa') clientName = 'ช่างแพรวา';
    else if (clientName === 'N-Nan (Siriporn)') clientName = 'น้องแนน (ศิริพร)';
    else if (clientName === 'Kanthida (You)') clientName = 'Kanthida (คุณ)';
    else if (clientName === 'Laoshi Wang') clientName = 'เหล่าซือหวัง';
    else if (clientName === 'Dr. Piyaporn') clientName = 'พญ.ปิยะพร';
  }

  return {
    ...room,
    title,
    roomName: title,
    location,
    creator,
    clientName,
    workType,
    capacityText: isEn && room.capacityText ? room.capacityText.replace('สมาชิก', 'Members') : room.capacityText,
  };
}

export const PARTNER_MAP_EN: Record<string, string> = {
  'ช่างแพรวา': 'Technician Praewa',
  'น้องแนน (ศิริพร)': 'N-Nan (Siriporn)',
  'น้องแนน': 'N-Nan',
  'เหล่าซือหวัง': 'Laoshi Wang',
  'พญ.ปิยะพร': 'Dr. Piyaporn',
  'ผู้รับบริการ': 'Client / Member',
  'ผู้ร่วมเช็กอิน': 'Check-in Partner',
  'คู่เช็กอิน': 'Check-in Partner',
  'ทีมช่างประจำสาขา 1': 'Technician Praewa',
};

export const PARTNER_MAP_TH: Record<string, string> = {
  'Technician Praewa': 'ช่างแพรวา',
  'N-Nan (Siriporn)': 'น้องแนน (ศิริพร)',
  'N-Nan': 'น้องแนน',
  'Laoshi Wang': 'เหล่าซือหวัง',
  'Dr. Piyaporn': 'พญ.ปิยะพร',
  'Check-in Partner': 'คู่เช็กอิน',
};

// Universal partner name resolver strictly respecting bilingual schema partnerName[locale]
export function getPartnerName(
  sessionOrName: any,
  locale: Locale,
  fallback?: string
): string {
  if (!sessionOrName) return fallback || (locale === 'th' ? 'คู่เช็กอิน' : 'Check-in Partner');

  if (typeof sessionOrName === 'string') {
    if (locale === 'en') {
      return PARTNER_MAP_EN[sessionOrName.trim()] || sessionOrName;
    } else {
      return PARTNER_MAP_TH[sessionOrName.trim()] || sessionOrName;
    }
  }

  // It's a CheckinSession or Room object
  const item = sessionOrName;
  if (item.partnerName && item.partnerName[locale]) {
    return item.partnerName[locale];
  }
  if (item.studentNameBilingual && item.studentNameBilingual[locale]) {
    return item.studentNameBilingual[locale];
  }
  if (item.clientNameBilingual && item.clientNameBilingual[locale]) {
    return item.clientNameBilingual[locale];
  }

  const raw = item.studentName || item.clientName || '';
  if (locale === 'en') {
    return PARTNER_MAP_EN[raw.trim()] || raw || fallback || 'Check-in Partner';
  } else {
    return PARTNER_MAP_TH[raw.trim()] || raw || fallback || 'คู่เช็กอิน';
  }
}

// Translates venue mode ('On-site / หน้างาน' <-> 'On-site / Venue')
export function translateVenueMode(venue: string | undefined, locale: Locale): string {
  if (!venue) return locale === 'th' ? 'On-site / หน้างาน' : 'On-site / Venue';
  if (locale === 'en') {
    if (
      venue.trim() === 'On-site / หน้างาน' ||
      venue.trim() === 'Onsite / หน้างาน' ||
      venue.trim() === 'หน้างาน' ||
      venue.trim() === 'On-site' ||
      venue.trim() === 'Onsite'
    ) {
      return 'On-site / Venue';
    }
    return venue
      .replace(/On-site \/ หน้างาน/gi, 'On-site / Venue')
      .replace(/Onsite \/ หน้างาน/gi, 'On-site / Venue')
      .replace(/On-site\/หน้างาน/gi, 'On-site / Venue')
      .replace(/หน้างาน/gi, 'Venue')
      .replace(/Onsite/gi, 'On-site');
  } else {
    if (
      venue.trim() === 'On-site / Venue' ||
      venue.trim() === 'Onsite / Venue' ||
      venue.trim() === 'Venue'
    ) {
      return 'On-site / หน้างาน';
    }
    return venue
      .replace(/On-site \/ Venue/gi, 'On-site / หน้างาน')
      .replace(/Onsite \/ Venue/gi, 'On-site / หน้างาน')
      .replace(/On-site\/Venue/gi, 'On-site / หน้างาน')
      .replace(/Venue/gi, 'หน้างาน');
  }
}

