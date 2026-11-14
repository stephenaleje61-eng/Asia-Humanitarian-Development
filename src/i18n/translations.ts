import { SupportedLanguage } from '../types';

export interface TranslationDictionary {
  brand: string;
  tagline: string;
  nav: {
    home: string;
    about: string;
    programmes: string;
    impact: string;
    getInvolved: string;
    contact: string;
    admin: string;
    portal: string;
    signIn: string;
    signOut: string;
  };
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaDirectChat: string;
  };
  stats: {
    beneficiaries: string;
    beneficiariesLabel: string;
    waterStations: string;
    waterStationsLabel: string;
    clinics: string;
    clinicsLabel: string;
    countries: string;
    countriesLabel: string;
  };
  chat: {
    heading: string;
    subheading: string;
    typePlaceholder: string;
    send: string;
    emptyConversation: string;
    adminOnline: string;
    directLine: string;
    attachFile: string;
  };
  programmes: {
    title: string;
    subtitle: string;
    exploreAll: string;
  };
  footer: {
    description: string;
    transparencyNote: string;
    rightsReserved: string;
    privacyPolicy: string;
    terms: string;
  };
}

export const LANGUAGES: { code: SupportedLanguage; label: string; nativeName: string; dir?: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'zh', label: 'Chinese', nativeName: '中文' },
  { code: 'ja', label: 'Japanese', nativeName: '日本語' },
  { code: 'ko', label: 'Korean', nativeName: '한국어' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'id', label: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'th', label: 'Thai', nativeName: 'ไทย' },
  { code: 'vi', label: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'ar', label: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
];

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    brand: 'Asia Humanitarian Development',
    tagline: 'Fostering Resilient Communities Across Asia Through Direct Aid, Sustainable Infrastructure, and Dignified Empowerment.',
    nav: {
      home: 'Home',
      about: 'About Us',
      programmes: 'Programmes',
      impact: 'Our Impact',
      getInvolved: 'Get Involved',
      contact: 'Contact Us',
      admin: 'Admin Space',
      portal: 'Member Portal',
      signIn: 'Sign In',
      signOut: 'Sign Out',
    },
    hero: {
      kicker: 'INTERNATIONALLY RECOGNISED HUMANITARIAN NGO',
      title: 'Empowering Asian Communities with Dignity & Lasting Hope',
      subtitle: 'Dedicated to education, healthcare, clean water, climate resilience, and sustainable poverty eradication across 12 Asian nations.',
      ctaPrimary: 'Explore Programmes',
      ctaSecondary: 'Join as Volunteer',
      ctaDirectChat: 'Direct Message Admin',
    },
    stats: {
      beneficiaries: '142,500+',
      beneficiariesLabel: 'Direct Beneficiaries Reached',
      waterStations: '84 Units',
      waterStationsLabel: 'Clean Gravity Water Systems',
      clinics: '28 Outposts',
      clinicsLabel: 'Mobile Healthcare Stations',
      countries: '12 Nations',
      countriesLabel: 'Active Programme Regions',
    },
    chat: {
      heading: 'Private 1-on-1 Communication Line',
      subheading: 'Direct, encrypted consultation with our humanitarian leadership and project coordinators.',
      typePlaceholder: 'Write your message to administration...',
      send: 'Send Message',
      emptyConversation: 'No messages yet. Start your private consultation with our administration team.',
      adminOnline: 'Humanitarian Administration Active',
      directLine: 'Secure Member Channel',
      attachFile: 'Attach Document/Photo',
    },
    programmes: {
      title: 'Our Humanitarian Programmes',
      subtitle: 'Comprehensive community-first initiatives built alongside local leaders for generational impact.',
      exploreAll: 'View Detailed Report',
    },
    footer: {
      description: 'An international humanitarian non-governmental organisation operating under UN ECOSOC consultative principles, empowering vulnerable Asian communities.',
      transparencyNote: '88.4% of all contributions are deployed directly to frontline field programmes with audited financial transparency.',
      rightsReserved: 'All rights reserved. Registered International Humanitarian Organisation.',
      privacyPolicy: 'Privacy Policy',
      terms: 'Terms & Conditions',
    },
  },
  zh: {
    brand: '亚洲人道发展理事会',
    tagline: '通过直接援助、可持续基础设施与尊严赋权，建设亚洲韧性社区。',
    nav: {
      home: '首页',
      about: '关于我们',
      programmes: '人道项目',
      impact: '发展成果',
      getInvolved: '参与我们',
      contact: '联络中心',
      admin: '管理空间',
      portal: '成员中心',
      signIn: '登录账户',
      signOut: '退出登录',
    },
    hero: {
      kicker: '国际认可的亚洲人道主义非政府组织',
      title: '以尊严与可持续希望，赋能亚洲社区发展',
      subtitle: '深耕教育扶持、基层医疗、清洁水源、气候韧性与消除贫困，服务亚洲12个国家。',
      ctaPrimary: '浏览人道项目',
      ctaSecondary: '加入志愿者团队',
      ctaDirectChat: '与管理团队私信',
    },
    stats: {
      beneficiaries: '142,500+',
      beneficiariesLabel: '直接受益人群',
      waterStations: '84 座',
      waterStationsLabel: '乡村重力水净化站',
      clinics: '28 处',
      clinicsLabel: '流动医疗服务点',
      countries: '12 国',
      countriesLabel: '深耕人道服务区域',
    },
    chat: {
      heading: '一对一私密联络专线',
      subheading: '与人道理事会管理专员及项目协调员实时直接对话。',
      typePlaceholder: '请输入您给管理团队的信息...',
      send: '发送讯息',
      emptyConversation: '尚无历史记录。请在此发起与人道管理团队的私密交流。',
      adminOnline: '管理专员在线',
      directLine: '私密加密通道',
      attachFile: '添加文件/照片',
    },
    programmes: {
      title: '人道发展核心项目',
      subtitle: '立足本土社区需求，携手亚洲基层领袖打造代际可持续影响。',
      exploreAll: '查看项目详情',
    },
    footer: {
      description: '遵循国际人道主义公约，致力于赋能亚洲弱势群体与推动基层繁荣的非政府组织。',
      transparencyNote: '88.4%的善款直接投入一线人道项目，接受国际独立审计。',
      rightsReserved: '版权所有。注册国际人道组织。',
      privacyPolicy: '隐私政策',
      terms: '使用条款',
    },
  },
  ja: {
    brand: 'アジア人道支援開発機構',
    tagline: '直接支援と持続可能な社会基盤を通じ、アジアの地域社会の尊厳と自立を支えます。',
    nav: {
      home: 'ホーム',
      about: '理念と沿革',
      programmes: '支援事業',
      impact: '活動実績',
      getInvolved: '参加のご案内',
      contact: 'お問い合わせ',
      admin: '管理コンソール',
      portal: '会員ポータル',
      signIn: 'ログイン',
      signOut: 'ログアウト',
    },
    hero: {
      kicker: '国際人道支援非政府組織 (NGO)',
      title: '尊厳ある自立と持続可能な希望をアジアの地域社会へ',
      subtitle: '教育支援、巡回医療、安全な飲料水、女性と青少年の自立支援をアジア12か国で展開しています。',
      ctaPrimary: '事業一覧を見る',
      ctaSecondary: 'ボランティアに参加',
      ctaDirectChat: '事務局と直接対話',
    },
    stats: {
      beneficiaries: '142,500名以上',
      beneficiariesLabel: '直接支援実績人数',
      waterStations: '84箇所',
      waterStationsLabel: '持続可能給水設備',
      clinics: '28拠点',
      clinicsLabel: '移動診療・医療所',
      countries: '12か国',
      countriesLabel: '活動対象地域',
    },
    chat: {
      heading: '事務局直通 1対1プライベート対話',
      subheading: '人道支援プロジェクト担当者とのリアルタイム相談窓口。',
      typePlaceholder: '事務局へのメッセージを入力...',
      send: '送信する',
      emptyConversation: 'メッセージ履歴はありません。相談内容をお送りください。',
      adminOnline: '管理担当者対応中',
      directLine: '会員専用セキュア回線',
      attachFile: '資料・画像を添付',
    },
    programmes: {
      title: '主要人道支援プログラム',
      subtitle: '地域の声に耳を傾け、長期的な自立を支援する総合的取り組み。',
      exploreAll: '詳細レポートを見る',
    },
    footer: {
      description: '透明性の高い運営と国際協調に基づき、アジアの困難な状況にある地域社会を支えるNGOです。',
      transparencyNote: '支援資金の88.4%が現場の直接人道支援に充当されています。',
      rightsReserved: '無断転載を禁じます。登録国際人道支援組織。',
      privacyPolicy: 'プライバシーポリシー',
      terms: '利用規約',
    },
  },
  ko: {
    brand: '아시아 인도주의 개발기구',
    tagline: '직접 구호와 지속 가능한 인프라를 통해 아시아 공동체의 존엄한 성장을 지원합니다.',
    nav: {
      home: '홈',
      about: '소개',
      programmes: '지원 사업',
      impact: '활동 성과',
      getInvolved: '참여하기',
      contact: '문의하기',
      admin: '관리 센터',
      portal: '회원 공간',
      signIn: '로그인',
      signOut: '로그아웃',
    },
    hero: {
      kicker: '국제 공인 아시아 인도주의 NGO',
      title: '존엄과 지속 가능한 희망으로 아시아를 연결합니다',
      subtitle: '교육 지원, 이동 진료, 식수 인프라, 환경 복원 및 빈곤 퇴치를 위해 아시아 12개국에서 활동합니다.',
      ctaPrimary: '사업 살펴보기',
      ctaSecondary: '자원봉사 지원',
      ctaDirectChat: '관리자와 1:1 대화',
    },
    stats: {
      beneficiaries: '142,500+',
      beneficiariesLabel: '직접 수혜자 수',
      waterStations: '84 개소',
      waterStationsLabel: '친환경 식수 정수 시설',
      clinics: '28 개소',
      clinicsLabel: '이동식 보건 진료소',
      countries: '12 개국',
      countriesLabel: '현장 지원 국가',
    },
    chat: {
      heading: '관리자 1:1 비공개 상담',
      subheading: '인도주의 프로젝트 담당자와의 안전한 실시간 메시지 채널.',
      typePlaceholder: '메시지를 입력하세요...',
      send: '전송',
      emptyConversation: '대화 내역이 없습니다. 메시지를 보내 상담을 시작하세요.',
      adminOnline: '관리자 상주 중',
      directLine: '보안 회원 통신망',
      attachFile: '파일 및 사진 첨부',
    },
    programmes: {
      title: '핵심 인도주의 프로그램',
      subtitle: '지역 주민과 함께 세워나가는 자립 중심의 장기 개발 프로젝트.',
      exploreAll: '상세 정보 보기',
    },
    footer: {
      description: '투명성과 신뢰를 바탕으로 아시아 취약 지역의 번영을 도모하는 국제 NGO입니다.',
      transparencyNote: '모든 후원금의 88.4%가 현장 구호 프로그램에 직접 투입됩니다.',
      rightsReserved: 'All rights reserved. 공식 국제 인도주의 기구.',
      privacyPolicy: '개인정보처리방침',
      terms: '이용약관',
    },
  },
  hi: {
    brand: 'एशिया मानवीय विकास संगठन',
    tagline: 'प्रत्यक्ष सहायता, जल सुरक्षा और गरिमापूर्ण सशक्तिकरण के माध्यम से एशिया में आत्मनिर्भर समुदायों का निर्माण।',
    nav: {
      home: 'मुखपृष्ठ',
      about: 'हमारे बारे में',
      programmes: 'कार्यक्रम',
      impact: 'हमारा प्रभाव',
      getInvolved: 'जुड़ें',
      contact: 'संपर्क करें',
      admin: 'प्रशासन स्पेस',
      portal: 'सदस्य पोर्टल',
      signIn: 'साइन इन',
      signOut: 'साइन आउट',
    },
    hero: {
      kicker: 'अंतरराष्ट्रीय स्तर पर मान्यता प्राप्त मानवीय एनजीओ',
      title: 'गरिमा और अटूट आशा के साथ एशियाई समुदायों का सशक्तिकरण',
      subtitle: 'शिक्षा, ग्रामीण स्वास्थ्य सेवा, स्वच्छ जल और पर्यावरण संरक्षण के लिए 12 देशों में निरंतर कार्यरत।',
      ctaPrimary: 'कार्यक्रम देखें',
      ctaSecondary: 'स्वयंसेवक बनें',
      ctaDirectChat: 'प्रशासन से सीधा संवाद',
    },
    stats: {
      beneficiaries: '142,500+',
      beneficiariesLabel: 'प्रत्यक्ष लाभार्थी',
      waterStations: '84 इकाइयां',
      waterStationsLabel: 'स्वच्छ जल परियोजनाएं',
      clinics: '28 केंद्र',
      clinicsLabel: 'सचल चिकित्सा क्लीनिक',
      countries: '12 देश',
      countriesLabel: 'सक्रिय सेवा क्षेत्र',
    },
    chat: {
      heading: 'व्यक्तिगत 1-ऑन-1 संवाद प्रणाली',
      subheading: 'मानवीय परियोजना समन्वयकों और अधिकारियों से सुरक्षित सीधा संवाद।',
      typePlaceholder: 'अपना संदेश यहां लिखें...',
      send: 'संदेश भेजें',
      emptyConversation: 'अभी कोई संदेश नहीं है। अपनी बातचीत शुरू करें।',
      adminOnline: 'प्रशासन ऑनलाइन',
      directLine: 'सुरक्षित निजी चैनल',
      attachFile: 'फ़ाइल या तस्वीर जोड़ें',
    },
    programmes: {
      title: 'मानवीय सहायता कार्यक्रम',
      subtitle: 'स्थानीय नेतृत्व के साथ मिलकर बनाई गई दीर्घकालिक विकास योजनाएं।',
      exploreAll: 'विस्तृत रिपोर्ट देखें',
    },
    footer: {
      description: 'अंतरराष्ट्रीय मानवीय सिद्धांतों पर आधारित एक स्वतंत्र संगठन जो एशिया में वंचित समुदायों का उत्थान करता है।',
      transparencyNote: 'दान का 88.4% हिस्सा सीधे जमीनी सहायता कार्यक्रमों में लगाया जाता है।',
      rightsReserved: 'सर्वाधिकार सुरक्षित। पंजीकृत अंतरराष्ट्रीय मानवीय संगठन।',
      privacyPolicy: 'गोपनीयता नीति',
      terms: 'नियम एवं शर्तें',
    },
  },
  id: {
    brand: 'Lembaga Pengembangan Kemanusiaan Asia',
    tagline: 'Membangun ketahanan komunitas di seluruh Asia melalui bantuan langsung, air bersih, dan pemberdayaan bermartabat.',
    nav: {
      home: 'Beranda',
      about: 'Tentang Kami',
      programmes: 'Program',
      impact: 'Dampak Kami',
      getInvolved: 'Bergabung',
      contact: 'Hubungi Kami',
      admin: 'Area Admin',
      portal: 'Portal Anggota',
      signIn: 'Masuk',
      signOut: 'Keluar',
    },
    hero: {
      kicker: 'ORGANISASI KEMANUSIAAN INTERNASIONAL ASIA',
      title: 'Memberdayakan Komunitas Asia dengan Martabat dan Harapan',
      subtitle: 'Mendedikasikan sumber daya untuk pendidikan, layanan kesehatan keliling, air bersih, dan ketahanan iklim di 12 negara Asia.',
      ctaPrimary: 'Jelajahi Program',
      ctaSecondary: 'Daftar Relawan',
      ctaDirectChat: 'Pesan Langsung Admin',
    },
    stats: {
      beneficiaries: '142.500+',
      beneficiariesLabel: 'Penerima Manfaat Langsung',
      waterStations: '84 Unit',
      waterStationsLabel: 'Sistem Air Bersih Gravitasi',
      clinics: '28 Posko',
      clinicsLabel: 'Klinik Medis Keliling',
      countries: '12 Negara',
      countriesLabel: 'Wilayah Wilayah Kerja',
    },
    chat: {
      heading: 'Layanan Komunikasi Pribadi 1-on-1',
      subheading: 'Konsultasi langsung dan terenkripsi dengan koordinator program dan pimpinan kemanusiaan kami.',
      typePlaceholder: 'Tulis pesan Anda untuk tim administrasi...',
      send: 'Kirim Pesan',
      emptyConversation: 'Belum ada riwayat pesan. Mulai konsultasi Anda sekarang.',
      adminOnline: 'Staf Administrasi Siaga',
      directLine: 'Saluran Khusus Anggota',
      attachFile: 'Lampirkan Dokumen/Foto',
    },
    programmes: {
      title: 'Program Kemanusiaan Unggulan',
      subtitle: 'Inisiatif berbasis masyarakat yang dirancang bersama pemimpin lokal demi dampak jangka panjang.',
      exploreAll: 'Lihat Laporan Lengkap',
    },
    footer: {
      description: 'Lembaga swadaya masyarakat internasional yang beroperasi dengan prinsip transparansi penuh dan keadilan sosial.',
      transparencyNote: '88,4% dari seluruh kontribusi disalurkan langsung ke lapangan dengan audit independen.',
      rightsReserved: 'Hak cipta dilindungi. Organisasi Kemanusiaan Terdaftar.',
      privacyPolicy: 'Kebijakan Privasi',
      terms: 'Syarat & Ketentuan',
    },
  },
  th: {
    brand: 'องค์กรพัฒนาเพื่อมนุษยธรรมแห่งเอเชีย',
    tagline: 'เสริมสร้างความเข้มแข็งให้แก่ชุมชนในเอเชียผ่านการช่วยเหลือโดยตรงและโครงสร้างพื้นฐานที่ยั่งยืน',
    nav: {
      home: 'หน้าแรก',
      about: 'เกี่ยวกับเรา',
      programmes: 'โครงการ',
      impact: 'ผลการดำเนินงาน',
      getInvolved: 'มีส่วนร่วม',
      contact: 'ติดต่อเรา',
      admin: 'ระบบผู้ดูแล',
      portal: 'พื้นที่สมาชิก',
      signIn: 'เข้าสู่ระบบ',
      signOut: 'ออกจากระบบ',
    },
    hero: {
      kicker: 'องค์กรพัฒนาเอกชนด้านมนุษยธรรมระดับสากล',
      title: 'เสริมพลังชุมชนเอเชียด้วยศักดิ์ศรีและความหวังที่ยั่งยืน',
      subtitle: 'มุ่งมั่นสนับสนุนการศึกษา บริการสาธารณสุขเคลื่อนที่ น้ำสะอาด และความยั่งยืนใน 12 ประเทศทั่วเอเชีย',
      ctaPrimary: 'ดูโครงการทั้งหมด',
      ctaSecondary: 'ร่วมเป็นอาสาสมัคร',
      ctaDirectChat: 'ส่งข้อความตรงถึงผู้ดูแล',
    },
    stats: {
      beneficiaries: '142,500+',
      beneficiariesLabel: 'ผู้ได้รับประโยชน์โดยตรง',
      waterStations: '84 แห่ง',
      waterStationsLabel: 'ระบบน้ำสะอาดพลังงานโน้มถ่วง',
      clinics: '28 จุด',
      clinicsLabel: 'หน่วยแพทย์เคลื่อนที่',
      countries: '12 ประเทศ',
      countriesLabel: 'พื้นที่ปฏิบัติงาน',
    },
    chat: {
      heading: 'ระบบข้อความส่วนตัวแบบตัวต่อตัว (1-on-1)',
      subheading: 'ปรึกษาโดยตรงกับผู้บริหารและผู้ประสานงานโครงการเพื่อมนุษยธรรม',
      typePlaceholder: 'พิมพ์ข้อความของคุณถึงฝ่ายบริหาร...',
      send: 'ส่งข้อความ',
      emptyConversation: 'ยังไม่มีข้อความ เริ่มต้นการสนทนาส่วนตัวของคุณได้ที่นี่',
      adminOnline: 'ผู้ดูแลระบบพร้อมให้บริการ',
      directLine: 'ช่องทางปลอดภัยสำหรับสมาชิก',
      attachFile: 'แนบเอกสารหรือรูปภาพ',
    },
    programmes: {
      title: 'โครงการเพื่อมนุษยธรรมหลัก',
      subtitle: 'ริเริ่มเพื่อชุมชนและร่วมมือกับผู้นำท้องถิ่นเพื่อสร้างผลลัพธ์ที่ยั่งยืน',
      exploreAll: 'ดูรายงานฉบับเต็ม',
    },
    footer: {
      description: 'องค์กรไม่แสวงหาผลกำไรระดับสากลที่ทำงานเพื่อเสริมสร้างโอกาสและคุณภาพชีวิตให้แก่ชุมชนเปราะบางในเอเชีย',
      transparencyNote: '88.4% ของเงินทุนทั้งหมดถูกนำไปใช้ในโครงการภาคสนามโดยตรงพร้อมการตรวจสอบบัญชีที่โปร่งใส',
      rightsReserved: 'สงวนลิขสิทธิ์ องค์กรเพื่อมนุษยธรรมระหว่างประเทศ',
      privacyPolicy: 'นโยบายความเป็นส่วนตัว',
      terms: 'ข้อกำหนดและเงื่อนไข',
    },
  },
  vi: {
    brand: 'Tổ Chức Phát Triển Nhân Đạo Châu Á',
    tagline: 'Xây dựng cộng đồng tự lực và kiên cường khắp Châu Á thông qua cứu trợ trực tiếp và hạ tầng bền vững.',
    nav: {
      home: 'Trang Chủ',
      about: 'Giới Thiệu',
      programmes: 'Chương Trình',
      impact: 'Tác Động',
      getInvolved: 'Tham Gia',
      contact: 'Liên Hệ',
      admin: 'Quản Trị Viên',
      portal: 'Cổng Thành Viên',
      signIn: 'Đăng Nhập',
      signOut: 'Đăng Xuất',
    },
    hero: {
      kicker: 'TỔ CHỨC PHI CHÍNH PHỦ NHÂN ĐẠO QUỐC TẾ',
      title: 'Trao Quyền Cho Cộng Đồng Châu Á Bằng Phẩm Giá & Hy Vọng',
      subtitle: 'Tận tâm hỗ trợ giáo dục, trạm y tế lưu động, nguồn nước sạch và giảm nghèo bền vững tại 12 quốc gia Châu Á.',
      ctaPrimary: 'Khám Phá Chương Trình',
      ctaSecondary: 'Đăng Ký Tình Nguyện',
      ctaDirectChat: 'Nhắn Tin Trực Tiếp Admin',
    },
    stats: {
      beneficiaries: '142.500+',
      beneficiariesLabel: 'Người Thụ Hưởng Trực Tiếp',
      waterStations: '84 Công Trình',
      waterStationsLabel: 'Hệ Thống Nước Sạch Nông Thôn',
      clinics: '28 Điểm',
      clinicsLabel: 'Trạm Y Tế Khám Lưu Động',
      countries: '12 Quốc Gia',
      countriesLabel: 'Khu Vực Triển Khai',
    },
    chat: {
      heading: 'Kênh Trao Đổi Riêng Tư 1-1',
      subheading: 'Trao đổi trực tiếp, bảo mật với ban điều hành và điều phối viên dự án nhân đạo.',
      typePlaceholder: 'Nhập tin nhắn gửi đến ban quản trị...',
      send: 'Gửi Tin Nhắn',
      emptyConversation: 'Chưa có tin nhắn nào. Bắt đầu cuộc trao đổi riêng tư của bạn ngay.',
      adminOnline: 'Ban Quản Trị Đang Trực',
      directLine: 'Đường Truyền Bảo Mật',
      attachFile: 'Đính Kèm Tài Liệu/Ảnh',
    },
    programmes: {
      title: 'Các Chương Trình Trọng Điểm',
      subtitle: 'Các sáng kiến lấy cộng đồng làm trung tâm nhằm tạo ra thay đổi lâu dài cho nhiều thế hệ.',
      exploreAll: 'Xem Chi Tiết Chương Trình',
    },
    footer: {
      description: 'Tổ chức nhân đạo phi lợi nhuận quốc tế cam kết hỗ trợ các cộng đồng khó khăn tại Châu Á với tính minh bạch tuyệt đối.',
      transparencyNote: '88,4% ngân sách được phân bổ trực tiếp cho các dự án thực địa với báo cáo kiểm toán độc lập.',
      rightsReserved: 'Đã đăng ký bản quyền. Tổ chức nhân đạo quốc tế.',
      privacyPolicy: 'Chính Sách Bảo Mật',
      terms: 'Điều Khoản Dịch Vụ',
    },
  },
  ar: {
    brand: 'منظمة التنمية الإنسانية لآسيا',
    tagline: 'تعزيز صمود المجتمعات في جميع أنحاء آسيا من خلال المساعدات المباشرة والبنية التحتية المستدامة.',
    nav: {
      home: 'الرئيسية',
      about: 'من نحن',
      programmes: 'برامجنا',
      impact: 'أثرنا الميداني',
      getInvolved: 'شارك معنا',
      contact: 'اتصل بنا',
      admin: 'لوحة الإدارة',
      portal: 'بوابة الأعضاء',
      signIn: 'تسجيل الدخول',
      signOut: 'تسجيل الخروج',
    },
    hero: {
      kicker: 'منظمة إنسانية غير حكومية معترف بها دولياً',
      title: 'تمكين المجتمعات الآسيوية بكرامة وأمل مستدام',
      subtitle: 'مكرسون لدعم التعليم، الرعاية الصحية المتنقلة، المياه النقية، والحد من الفقر في 12 دولة آسيوية.',
      ctaPrimary: 'استكشف البرامج',
      ctaSecondary: 'انضم كمتطوع',
      ctaDirectChat: 'محادثة خاصة مع الإدارة',
    },
    stats: {
      beneficiaries: '+142,500',
      beneficiariesLabel: 'مستفيد مباشر',
      waterStations: '84 محطة',
      waterStationsLabel: 'محطات مياه نظيفة',
      clinics: '28 عيادة',
      clinicsLabel: 'عيادات طبية متنقلة',
      countries: '12 دولة',
      countriesLabel: 'دول العمليات الميدانية',
    },
    chat: {
      heading: 'نظام التواصل الخاص الفردي 1-on-1',
      subheading: 'استشارة مباشرة وآمنة مع منسقي البرامج الإنسانية وفريق الإدارة.',
      typePlaceholder: 'اكتب رسالتك للإدارة هنا...',
      send: 'إرسال الرسالة',
      emptyConversation: 'لا توجد رسائل سابقة. ابدأ محادثتك الخاصة مع إدارة المنظمة الآن.',
      adminOnline: 'فريق الإدارة متصل',
      directLine: 'قناة الأعضاء الآمنة',
      attachFile: 'إرفاق ملف أو صورة',
    },
    programmes: {
      title: 'برامج التنمية الإنسانية',
      subtitle: 'مبادرات مجتمعية شاملة صممت بالتعاون مع القادة المحليين لإحداث أثر دائم عبر الأجيال.',
      exploreAll: 'عرض التقرير التفصيلي',
    },
    footer: {
      description: 'منظمة إنسانية دولية غير ربحية تعمل وفق أعلى معايير الشفافية لتمكين المجتمعات الأكثر هشاشة في آسيا.',
      transparencyNote: '88.4% من كافة التبرعات تخصص مباشرة للمشاريع الميدانية مع تدقيق مالي معتمد.',
      rightsReserved: 'جميع الحقوق محفوظة. منظمة إنسانية دولية مسجلة.',
      privacyPolicy: 'سياسة الخصوصية',
      terms: 'الشروط والأحكام',
    },
  },
};
