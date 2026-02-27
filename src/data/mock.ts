// ============================================================
// 성지DROP Mock Data
// ============================================================

export interface Device {
  id: string;
  name: string;
  brand: 'samsung' | 'apple' | 'etc';
  storage: string;
  colors: string[];
  originalPrice: number;
  imageUrl?: string;
}

export interface Store {
  id: string;
  name: string;
  region: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  openHours: string;
  phone: string;
}

export interface Deal {
  id: string;
  deviceId: string;
  storeId: string;
  price: number;
  originalPrice: number;
  discountRate: number;
  isHot: boolean;
  isLive: boolean;
  stock: number;
  createdAt: string;
  verifiedAt: string;
}

export interface Plan {
  id: string;
  carrier: 'SK' | 'KT' | 'LGU';
  name: string;
  monthlyFee: number;
  data: string;
  call: string;
  subsidy: number;       // 공시지원금
  selectDiscount: number; // 선택약정 25% 월 할인
}

export interface Review {
  id: string;
  storeId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  tags: string[];
  verified: boolean;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  deviceId: string;
  addedAt: string;
  targetPrice?: number;
  priceAtAdd: number;
}

export interface Notification {
  id: string;
  type: 'drop' | 'wishlist' | 'target' | 'review' | 'system';
  title: string;
  body: string;
  dealId?: string;
  read: boolean;
  createdAt: string;
}

// ──────────────────────────────────────────
// Devices
// ──────────────────────────────────────────
export const devices: Device[] = [
  { id: 'd1', name: 'Galaxy S25 Ultra', brand: 'samsung', storage: '256GB', colors: ['티타늄 블랙', '티타늄 그레이', '티타늄 블루'], originalPrice: 1_798_000 },
  { id: 'd2', name: 'Galaxy S25+', brand: 'samsung', storage: '256GB', colors: ['네이비', '아이시블루', '민트'], originalPrice: 1_353_000 },
  { id: 'd3', name: 'Galaxy S25', brand: 'samsung', storage: '256GB', colors: ['네이비', '아이시블루', '민트'], originalPrice: 1_155_000 },
  { id: 'd4', name: 'iPhone 16 Pro Max', brand: 'apple', storage: '256GB', colors: ['블랙 티타늄', '내추럴', '화이트'], originalPrice: 1_900_000 },
  { id: 'd5', name: 'iPhone 16 Pro', brand: 'apple', storage: '256GB', colors: ['블랙 티타늄', '내추럴', '데저트'], originalPrice: 1_550_000 },
  { id: 'd6', name: 'iPhone 16', brand: 'apple', storage: '128GB', colors: ['블랙', '화이트', '핑크', '틸'], originalPrice: 1_250_000 },
  { id: 'd7', name: 'Galaxy Z Flip6', brand: 'samsung', storage: '256GB', colors: ['블루', '민트', '실버섀도'], originalPrice: 1_399_000 },
  { id: 'd8', name: 'Galaxy Z Fold6', brand: 'samsung', storage: '256GB', colors: ['네이비', '핑크', '실버섀도'], originalPrice: 2_339_700 },
  { id: 'd9', name: 'Galaxy A35', brand: 'samsung', storage: '128GB', colors: ['라일락', '네이비', '아이스블루'], originalPrice: 494_000 },
  { id: 'd10', name: 'iPhone SE 4', brand: 'apple', storage: '128GB', colors: ['블랙', '화이트'], originalPrice: 690_000 },
];

// ──────────────────────────────────────────
// Stores
// ──────────────────────────────────────────
export const stores: Store[] = [
  { id: 's1', name: '신림 모바일마트', region: '서울 관악구', address: '서울시 관악구 신림로 330', lat: 37.4842, lng: 126.9293, rating: 4.5, reviewCount: 342, verified: true, openHours: '10:00-21:00', phone: '02-871-0000' },
  { id: 's2', name: '구로 테크노마트', region: '서울 구로구', address: '서울시 구로구 디지털로 300', lat: 37.5014, lng: 126.8826, rating: 4.3, reviewCount: 287, verified: true, openHours: '10:00-21:00', phone: '02-860-0000' },
  { id: 's3', name: '영등포 타임스퀘어점', region: '서울 영등포구', address: '서울시 영등포구 영중로 15', lat: 37.5176, lng: 126.9032, rating: 4.1, reviewCount: 198, verified: true, openHours: '10:30-22:00', phone: '02-2638-0000' },
  { id: 's4', name: '강남 폰마트', region: '서울 강남구', address: '서울시 강남구 테헤란로 110', lat: 37.5000, lng: 127.0366, rating: 4.4, reviewCount: 256, verified: true, openHours: '10:00-21:30', phone: '02-555-0000' },
  { id: 's5', name: '용산 전자랜드', region: '서울 용산구', address: '서울시 용산구 한강대로 23길 55', lat: 37.5329, lng: 126.9644, rating: 4.2, reviewCount: 521, verified: true, openHours: '10:00-20:00', phone: '02-707-0000' },
  { id: 's6', name: '부천 하이마트', region: '경기 부천시', address: '경기도 부천시 길주로 1', lat: 37.4845, lng: 126.7838, rating: 3.9, reviewCount: 124, verified: false, openHours: '10:00-21:00', phone: '032-320-0000' },
  { id: 's7', name: '인천 구월 폰시티', region: '인천 남동구', address: '인천시 남동구 구월로 123', lat: 37.4501, lng: 126.7059, rating: 4.0, reviewCount: 95, verified: false, openHours: '10:00-20:30', phone: '032-465-0000' },
  { id: 's8', name: '수원 폰플라자', region: '경기 수원시', address: '경기도 수원시 팔달구 매산로 100', lat: 37.2636, lng: 127.0286, rating: 4.3, reviewCount: 176, verified: true, openHours: '10:00-21:00', phone: '031-245-0000' },
];

// ──────────────────────────────────────────
// Deals
// ──────────────────────────────────────────
export const deals: Deal[] = [
  { id: 'deal1', deviceId: 'd1', storeId: 's1', price: 870_000, originalPrice: 1_798_000, discountRate: 34, isHot: true, isLive: true, stock: 3, createdAt: '2026-02-27T10:30:00', verifiedAt: '2026-02-27T10:15:00' },
  { id: 'deal2', deviceId: 'd5', storeId: 's2', price: 1_050_000, originalPrice: 1_550_000, discountRate: 32, isHot: true, isLive: true, stock: 5, createdAt: '2026-02-27T09:00:00', verifiedAt: '2026-02-27T08:50:00' },
  { id: 'deal3', deviceId: 'd7', storeId: 's3', price: 680_000, originalPrice: 1_399_000, discountRate: 38, isHot: true, isLive: true, stock: 2, createdAt: '2026-02-27T11:00:00', verifiedAt: '2026-02-27T10:50:00' },
  { id: 'deal4', deviceId: 'd4', storeId: 's4', price: 1_450_000, originalPrice: 1_900_000, discountRate: 24, isHot: false, isLive: true, stock: 7, createdAt: '2026-02-27T08:00:00', verifiedAt: '2026-02-27T07:55:00' },
  { id: 'deal5', deviceId: 'd2', storeId: 's5', price: 950_000, originalPrice: 1_353_000, discountRate: 30, isHot: false, isLive: true, stock: 4, createdAt: '2026-02-27T10:00:00', verifiedAt: '2026-02-27T09:45:00' },
  { id: 'deal6', deviceId: 'd3', storeId: 's1', price: 750_000, originalPrice: 1_155_000, discountRate: 35, isHot: true, isLive: true, stock: 2, createdAt: '2026-02-27T11:30:00', verifiedAt: '2026-02-27T11:20:00' },
  { id: 'deal7', deviceId: 'd6', storeId: 's4', price: 890_000, originalPrice: 1_250_000, discountRate: 29, isHot: false, isLive: true, stock: 6, createdAt: '2026-02-27T07:30:00', verifiedAt: '2026-02-27T07:20:00' },
  { id: 'deal8', deviceId: 'd8', storeId: 's2', price: 1_580_000, originalPrice: 2_339_700, discountRate: 32, isHot: false, isLive: true, stock: 1, createdAt: '2026-02-27T09:30:00', verifiedAt: '2026-02-27T09:25:00' },
  { id: 'deal9', deviceId: 'd10', storeId: 's6', price: 520_000, originalPrice: 690_000, discountRate: 25, isHot: false, isLive: true, stock: 10, createdAt: '2026-02-27T06:00:00', verifiedAt: '2026-02-27T05:50:00' },
  { id: 'deal10', deviceId: 'd9', storeId: 's7', price: 280_000, originalPrice: 494_000, discountRate: 43, isHot: true, isLive: true, stock: 8, createdAt: '2026-02-27T10:45:00', verifiedAt: '2026-02-27T10:40:00' },
  { id: 'deal11', deviceId: 'd1', storeId: 's4', price: 920_000, originalPrice: 1_798_000, discountRate: 31, isHot: false, isLive: true, stock: 4, createdAt: '2026-02-27T08:30:00', verifiedAt: '2026-02-27T08:20:00' },
  { id: 'deal12', deviceId: 'd5', storeId: 's8', price: 1_100_000, originalPrice: 1_550_000, discountRate: 29, isHot: false, isLive: true, stock: 3, createdAt: '2026-02-27T09:15:00', verifiedAt: '2026-02-27T09:10:00' },
  { id: 'deal13', deviceId: 'd7', storeId: 's5', price: 720_000, originalPrice: 1_399_000, discountRate: 36, isHot: false, isLive: true, stock: 5, createdAt: '2026-02-27T07:45:00', verifiedAt: '2026-02-27T07:40:00' },
  { id: 'deal14', deviceId: 'd1', storeId: 's8', price: 900_000, originalPrice: 1_798_000, discountRate: 33, isHot: false, isLive: true, stock: 2, createdAt: '2026-02-27T11:15:00', verifiedAt: '2026-02-27T11:10:00' },
  { id: 'deal15', deviceId: 'd4', storeId: 's1', price: 1_480_000, originalPrice: 1_900_000, discountRate: 22, isHot: false, isLive: true, stock: 3, createdAt: '2026-02-27T10:20:00', verifiedAt: '2026-02-27T10:15:00' },
];

// ──────────────────────────────────────────
// Plans (요금제)
// ──────────────────────────────────────────
export const plans: Plan[] = [
  // SK
  { id: 'p1', carrier: 'SK', name: '5G 프리미어 플러스', monthlyFee: 105_000, data: '무제한', call: '무제한', subsidy: 350_000, selectDiscount: 26_250 },
  { id: 'p2', carrier: 'SK', name: '5G 프리미어 에센셜', monthlyFee: 85_000, data: '무제한(일 2GB 후 1Mbps)', call: '무제한', subsidy: 300_000, selectDiscount: 21_250 },
  { id: 'p3', carrier: 'SK', name: '5G 슬림', monthlyFee: 55_000, data: '12GB', call: '무제한', subsidy: 200_000, selectDiscount: 13_750 },
  { id: 'p4', carrier: 'SK', name: 'LTE 세이브', monthlyFee: 39_000, data: '6GB', call: '무제한', subsidy: 150_000, selectDiscount: 9_750 },
  { id: 'p5', carrier: 'SK', name: '알뜰 다이렉트', monthlyFee: 25_000, data: '3GB', call: '무제한', subsidy: 0, selectDiscount: 6_250 },
  // KT
  { id: 'p6', carrier: 'KT', name: '5G 슈퍼플랜 프리미엄', monthlyFee: 100_000, data: '무제한', call: '무제한', subsidy: 340_000, selectDiscount: 25_000 },
  { id: 'p7', carrier: 'KT', name: '5G 슈퍼플랜 스페셜', monthlyFee: 80_000, data: '무제한(일 2GB 후 3Mbps)', call: '무제한', subsidy: 280_000, selectDiscount: 20_000 },
  { id: 'p8', carrier: 'KT', name: '5G 심플', monthlyFee: 55_000, data: '12GB', call: '무제한', subsidy: 190_000, selectDiscount: 13_750 },
  { id: 'p9', carrier: 'KT', name: 'LTE 베이직', monthlyFee: 35_000, data: '5GB', call: '무제한', subsidy: 130_000, selectDiscount: 8_750 },
  { id: 'p10', carrier: 'KT', name: '알뜰 세이브', monthlyFee: 22_000, data: '2GB', call: '무제한', subsidy: 0, selectDiscount: 5_500 },
  // LGU+
  { id: 'p11', carrier: 'LGU', name: '5G 프리미엄+', monthlyFee: 100_000, data: '무제한', call: '무제한', subsidy: 330_000, selectDiscount: 25_000 },
  { id: 'p12', carrier: 'LGU', name: '5G 스탠다드', monthlyFee: 75_000, data: '무제한(일 2GB 후 5Mbps)', call: '무제한', subsidy: 270_000, selectDiscount: 18_750 },
  { id: 'p13', carrier: 'LGU', name: '5G 라이트', monthlyFee: 55_000, data: '10GB', call: '무제한', subsidy: 180_000, selectDiscount: 13_750 },
  { id: 'p14', carrier: 'LGU', name: 'LTE 심플', monthlyFee: 34_000, data: '4GB', call: '무제한', subsidy: 120_000, selectDiscount: 8_500 },
  { id: 'p15', carrier: 'LGU', name: '알뜰 에센셜', monthlyFee: 20_000, data: '2GB', call: '무제한', subsidy: 0, selectDiscount: 5_000 },
];

// ──────────────────────────────────────────
// Reviews
// ──────────────────────────────────────────
export const reviews: Review[] = [
  { id: 'r1', storeId: 's1', userId: 'u1', userName: '성지헌터01', rating: 5, text: '진짜 여기가 제일 싸요. S25 Ultra 87만원에 샀습니다. 직원분도 친절하시고 재고도 많아요!', tags: ['친절함', '가격 정확', '재고 많음'], verified: true, createdAt: '2026-02-27T10:30:00' },
  { id: 'r2', storeId: 's1', userId: 'u2', userName: '폰마스터', rating: 4, text: '가격은 확실히 좋은데 줄이 좀 길어요. 평일에 가시는 게 낫습니다.', tags: ['가격 정확'], verified: true, createdAt: '2026-02-26T15:20:00' },
  { id: 'r3', storeId: 's2', userId: 'u3', userName: '알뜰소비러', rating: 4, text: '아이폰 16 Pro 105만원에 겟! 타 매장 대비 확실히 저렴합니다.', tags: ['가격 정확', '친절함'], verified: true, createdAt: '2026-02-27T09:10:00' },
  { id: 'r4', storeId: 's4', userId: 'u4', userName: '강남폰덕후', rating: 5, text: '여기 사장님이 업계에서 유명하신 분이라 믿고 살 수 있어요. 보증도 확실!', tags: ['친절함', '가격 정확'], verified: false, createdAt: '2026-02-25T11:00:00' },
  { id: 'r5', storeId: 's5', userId: 'u5', userName: '용산마니아', rating: 3, text: '용산은 요즘 예전만큼은 아닌 것 같아요. 그래도 Z Flip6 가격은 괜찮았습니다.', tags: ['주차 편함'], verified: true, createdAt: '2026-02-26T14:30:00' },
];

// ──────────────────────────────────────────
// Notifications
// ──────────────────────────────────────────
export const notifications: Notification[] = [
  { id: 'n1', type: 'drop', title: '🔥 Galaxy S25 Ultra 드롭!', body: '신림 성지에서 870,000원에 드롭! 잔여 3대', dealId: 'deal1', read: false, createdAt: '2026-02-27T10:30:00' },
  { id: 'n2', type: 'wishlist', title: '⭐ 찜한 iPhone 16 Pro 가격 하락', body: '50,000원 내렸어요! 현재 1,050,000원', read: false, createdAt: '2026-02-27T09:05:00' },
  { id: 'n3', type: 'target', title: '🎯 목표가 도달!', body: 'Z Flip6이 680,000원! 목표가(700,000원) 달성', dealId: 'deal3', read: false, createdAt: '2026-02-27T11:00:00' },
  { id: 'n4', type: 'review', title: '💬 내 리뷰에 좋아요 5개', body: '신림 모바일마트 리뷰에 좋아요가 달렸어요', read: true, createdAt: '2026-02-26T18:00:00' },
  { id: 'n5', type: 'drop', title: '🔥 Galaxy A35 초특가!', body: '인천 구월 폰시티에서 280,000원 드롭! 43% 할인', dealId: 'deal10', read: true, createdAt: '2026-02-27T10:45:00' },
  { id: 'n6', type: 'system', title: '📢 일일 미션 갱신', body: '오늘의 미션 3개가 준비되었어요!', read: true, createdAt: '2026-02-27T06:00:00' },
];

// ──────────────────────────────────────────
// Price History (for charts)
// ──────────────────────────────────────────
export const priceHistory: Record<string, { date: string; price: number }[]> = {
  d1: [
    { date: '01/28', price: 1_350_000 }, { date: '02/01', price: 1_300_000 },
    { date: '02/04', price: 1_250_000 }, { date: '02/07', price: 1_200_000 },
    { date: '02/10', price: 1_150_000 }, { date: '02/13', price: 1_050_000 },
    { date: '02/16', price: 1_000_000 }, { date: '02/19', price: 950_000 },
    { date: '02/22', price: 920_000 },  { date: '02/25', price: 900_000 },
    { date: '02/27', price: 870_000 },
  ],
  d5: [
    { date: '01/28', price: 1_500_000 }, { date: '02/04', price: 1_400_000 },
    { date: '02/10', price: 1_300_000 }, { date: '02/16', price: 1_200_000 },
    { date: '02/22', price: 1_100_000 }, { date: '02/27', price: 1_050_000 },
  ],
  d7: [
    { date: '01/28', price: 1_100_000 }, { date: '02/04', price: 1_000_000 },
    { date: '02/10', price: 900_000 },  { date: '02/16', price: 800_000 },
    { date: '02/22', price: 750_000 },  { date: '02/27', price: 680_000 },
  ],
};

// ──────────────────────────────────────────
// Gamification
// ──────────────────────────────────────────
export const hunterRanks = [
  { level: 1, name: '뉴비', minPoints: 0, icon: '🌱' },
  { level: 2, name: '탐색자', minPoints: 100, icon: '🔍' },
  { level: 3, name: '성지순례자', minPoints: 500, icon: '⛩️' },
  { level: 4, name: '마스터헌터', minPoints: 2000, icon: '🎯' },
  { level: 5, name: '전설', minPoints: 10000, icon: '👑' },
] as const;

export const achievements = [
  { id: 'a1', name: '첫 드롭', desc: '첫 번째 딜 확인', icon: '🎯', unlocked: true },
  { id: 'a2', name: '성지순례자', desc: '5개 이상 매장 방문 인증', icon: '⛩️', unlocked: true },
  { id: 'a3', name: '가격 해커', desc: '요금제 해체 10회', icon: '🔓', unlocked: false },
  { id: 'a4', name: '절약의 신', desc: '누적 절약 100만원 돌파', icon: '💰', unlocked: false },
  { id: 'a5', name: '인증샷 마스터', desc: '가격 인증 20회', icon: '📸', unlocked: false },
] as const;

export const dailyMissions = [
  { id: 'm1', text: '오늘의 드롭 3개 확인하기', points: 5, completed: true },
  { id: 'm2', text: '매장 리뷰 1개 작성하기', points: 10, completed: false },
  { id: 'm3', text: '요금제 해체 1회 사용하기', points: 5, completed: false },
] as const;

export const userProfile = {
  nickname: '성지헌터01',
  rank: hunterRanks[2],
  points: 780,
  nextRankPoints: 2000,
  reviewCount: 12,
  verifyCount: 8,
  totalSaved: 2_450_000,
};

// ──────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────
export function getDevice(id: string) { return devices.find(d => d.id === id); }
export function getStore(id: string) { return stores.find(s => s.id === id); }
export function getDealWithDetails(deal: Deal) {
  return { ...deal, device: getDevice(deal.deviceId)!, store: getStore(deal.storeId)! };
}
export function formatPrice(price: number) {
  return price.toLocaleString('ko-KR');
}
export function getFilteredDeals(brand?: string, carrier?: string) {
  return deals.filter(d => {
    if (brand) {
      const device = getDevice(d.deviceId);
      if (!device || device.brand !== brand) return false;
    }
    return true;
  });
}
