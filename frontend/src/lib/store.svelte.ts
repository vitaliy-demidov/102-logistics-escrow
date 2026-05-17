import WebApp from '@twa-dev/sdk';

// FSM Enums
export enum ShipmentState {
  PENDING = 'PENDING',
  PICKUP = 'PICKUP',
  BORDER = 'BORDER',
  IN_TRANSIT = 'IN_TRANSIT',
  ARRIVED = 'ARRIVED',
  POD_SUBMITTED = 'POD_SUBMITTED',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED'
}

export enum EscrowState {
  SECURED = 'SECURED',
  LOCKED = 'LOCKED',
  RELEASE_PENDING = 'RELEASE_PENDING',
  RELEASED = 'RELEASED',
  REFUNDED = 'REFUNDED'
}

export enum ActionOwner {
  DRIVER = 'DRIVER',
  BUYER = 'BUYER',
  DISPATCHER = 'DISPATCHER',
  NONE = 'NONE'
}

// Translations Dictionary
const translations: Record<string, Record<string, string>> = {
  en: {
    loading: "Loading...",
    noMoreLots: "No more available shipments. Check back later.",
    accept: "Accept Route",
    reject: "Pass",
    route: "Route",
    rate: "Tender Rate",
    distance: "Distance",
    weight: "Weight",
    escrow: "Escrow Protection",
    showQR: "Delivery Multi-Proof",
    timerExpired: "QR Expired. Generating new...",
    qrDesc: "Step 3/3: Show this code to the buyer to release funds.",
    scanWait: "Waiting for buyer to scan...",
    openDispute: "Open Dispute"
  },
  ru: {
    loading: "Загрузка...",
    noMoreLots: "Нет доступных грузов. Зайдите позже.",
    accept: "Взять рейс",
    reject: "Пропустить",
    route: "Маршрут",
    rate: "Ставка",
    distance: "Дистанция",
    weight: "Вес",
    escrow: "Защита Escrow",
    showQR: "Подтвердить прибытие (Multi-Proof)",
    timerExpired: "Код истек. Генерируем новый...",
    qrDesc: "Шаг 3/3: Покажите этот код покупателю для разблокировки средств.",
    scanWait: "Ожидание сканирования покупателем...",
    openDispute: "Открыть спор (Dispute)"
  },
  tr: {
    loading: "Yükleniyor...",
    noMoreLots: "Kargo bulunamadı. Daha sonra tekrar kontrol edin.",
    accept: "Kabul Et",
    reject: "Geç",
    route: "Rota",
    rate: "Teklif",
    distance: "Mesafe",
    weight: "Ağırlık",
    escrow: "Escrow Koruması",
    showQR: "Teslimat Kanıtı",
    timerExpired: "Kodun süresi doldu. Yenileniyor...",
    qrDesc: "Adım 3/3: Fonları serbest bırakmak için bu kodu alıcıya gösterin.",
    scanWait: "Alıcının taraması bekleniyor...",
    openDispute: "Anlaşmazlık Başlat"
  }
};

export type GeoPoint = { lat: number; lng: number; label?: string };

export type TimelineEvent = {
  id: string;
  timestamp: number;
  icon: 'truck' | 'shield' | 'flag' | 'alert' | 'check' | 'scan';
  title: string;
  detail: string;
  severity: 'info' | 'success' | 'warning' | 'danger';
};

export type Notification = {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  ts: number;
  read: boolean;
};

type Lot = {
  id: string;
  from: string;
  to: string;
  buyer: string;
  priceUsd: number;
  weightTons: number;
  distanceKm: number;
  type: string;
  shipmentState: ShipmentState;
  escrowState: EscrowState;
  requiredActionOwner: ActionOwner;
  slaDeadline: number;
  // Phase 2 additions
  fromCoord: GeoPoint;
  toCoord: GeoPoint;
  currentCoord: GeoPoint;
  routeProgress: number; // 0-100
  etaHours: number;
  trustScore: number; // 0-100
  commissionPct: number;
  escrowFeePct: number;
  timeline: TimelineEvent[];
};

const now = Date.now();

const mockLots: Lot[] = [
  {
    id: 'TR-1042', from: 'Стамбул', to: 'Москва', buyer: 'OTO A.Ş.', priceUsd: 5400, weightTons: 20, distanceKm: 2800, type: 'Тент',
    shipmentState: ShipmentState.PENDING, escrowState: EscrowState.SECURED, requiredActionOwner: ActionOwner.DRIVER, slaDeadline: now + 86400000,
    fromCoord: { lat: 41.0082, lng: 28.9784, label: 'Istanbul' }, toCoord: { lat: 55.7558, lng: 37.6173, label: 'Moscow' },
    currentCoord: { lat: 41.0082, lng: 28.9784 }, routeProgress: 0, etaHours: 38,
    trustScore: 92, commissionPct: 3.5, escrowFeePct: 1.2,
    timeline: [
      { id: 'e1', timestamp: now - 3600000, icon: 'shield', title: 'Escrow Secured', detail: '$5,400 locked by OTO A.Ş.', severity: 'success' },
      { id: 'e2', timestamp: now - 1800000, icon: 'check', title: 'e-Devlet Verified', detail: 'Driver identity confirmed', severity: 'success' },
      { id: 'e3', timestamp: now, icon: 'truck', title: 'Shipment Created', detail: 'Istanbul → Moscow, 20t Tent', severity: 'info' },
    ]
  },
  {
    id: 'TR-1043', from: 'Измир', to: 'Минск', buyer: 'MinskTrans Ltd', priceUsd: 4800, weightTons: 22, distanceKm: 2400, type: 'Рефрижератор',
    shipmentState: ShipmentState.PENDING, escrowState: EscrowState.SECURED, requiredActionOwner: ActionOwner.DRIVER, slaDeadline: now + 86400000,
    fromCoord: { lat: 38.4237, lng: 27.1428, label: 'Izmir' }, toCoord: { lat: 53.9006, lng: 27.5590, label: 'Minsk' },
    currentCoord: { lat: 38.4237, lng: 27.1428 }, routeProgress: 0, etaHours: 32,
    trustScore: 87, commissionPct: 3.5, escrowFeePct: 1.2,
    timeline: [
      { id: 'e4', timestamp: now - 600000, icon: 'shield', title: 'Escrow Secured', detail: '$4,800 locked by MinskTrans', severity: 'success' },
    ]
  },
];

export const appState = $state({
  lang: 'ru',
  user: null as any,
  lots: mockLots,
  activeLot: null as Lot | null,
  notifications: [] as Notification[],
  activeTab: 'main' as 'main' | 'map' | 'finance' | 'timeline',
});

export function getT() {
  return translations[appState.lang] || translations.ru;
}

export function initApp() {
  if (typeof WebApp !== 'undefined') {
    WebApp.ready();
    WebApp.expand();
    if (WebApp.initDataUnsafe?.user) {
      appState.user = WebApp.initDataUnsafe.user;
      const langCode = appState.user?.language_code || 'ru';
      appState.lang = ['en', 'ru', 'tr'].includes(langCode) ? langCode : 'ru';
    }
  }
}

export function swipeLot(lotId: string, accepted: boolean) {
  if (accepted) {
    const lot = appState.lots.find(l => l.id === lotId);
    if (lot) {
      // Transition FSM states when accepted
      lot.shipmentState = ShipmentState.IN_TRANSIT;
      lot.escrowState = EscrowState.LOCKED;
      lot.requiredActionOwner = ActionOwner.DRIVER; // Driver needs to confirm POD
      appState.activeLot = lot; 
    }
  }
  // Remove from stack
  appState.lots = appState.lots.filter(l => l.id !== lotId);
  
  if (typeof WebApp !== 'undefined' && WebApp.HapticFeedback) {
    WebApp.HapticFeedback.impactOccurred(accepted ? 'heavy' : 'light');
  }
}

export function submitPOD() {
  if (appState.activeLot) {
    appState.activeLot.shipmentState = ShipmentState.POD_SUBMITTED;
    appState.activeLot.escrowState = EscrowState.RELEASE_PENDING;
    appState.activeLot.requiredActionOwner = ActionOwner.BUYER; // Buyer must confirm
    appState.activeLot.slaDeadline = Date.now() + (24 * 60 * 60 * 1000); // 24h SLA for auto-release
  }
}

export function openDispute() {
  if (appState.activeLot) {
    appState.activeLot.shipmentState = ShipmentState.DISPUTED;
    appState.activeLot.requiredActionOwner = ActionOwner.DISPATCHER;
    pushNotification('Dispute opened. Escrow frozen.', 'danger');
    appState.activeLot.timeline.push({
      id: 'disp-' + Date.now(), timestamp: Date.now(), icon: 'alert',
      title: 'Dispute Opened', detail: 'Funds frozen pending arbitration', severity: 'danger'
    });
  }
}

export function pushNotification(text: string, type: Notification['type'] = 'info') {
  appState.notifications = [
    { id: 'n-' + Date.now(), text, type, ts: Date.now(), read: false },
    ...appState.notifications
  ];
}

// Simulates GPS movement along the route
let gpsInterval: any = null;
export function startLiveTracking() {
  if (gpsInterval) clearInterval(gpsInterval);
  gpsInterval = setInterval(() => {
    if (!appState.activeLot || appState.activeLot.shipmentState !== ShipmentState.IN_TRANSIT) {
      clearInterval(gpsInterval);
      return;
    }
    const lot = appState.activeLot;
    lot.routeProgress = Math.min(100, lot.routeProgress + 1.5);
    // Interpolate coordinates
    const p = lot.routeProgress / 100;
    lot.currentCoord = {
      lat: lot.fromCoord.lat + (lot.toCoord.lat - lot.fromCoord.lat) * p,
      lng: lot.fromCoord.lng + (lot.toCoord.lng - lot.fromCoord.lng) * p,
    };
    lot.etaHours = Math.max(0, Math.round(38 * (1 - p)));

    // Border crossing event at ~40%
    if (lot.routeProgress >= 40 && lot.routeProgress < 42) {
      lot.timeline.push({
        id: 'border-' + Date.now(), timestamp: Date.now(), icon: 'flag',
        title: 'Border Crossing', detail: 'Passed customs checkpoint', severity: 'info'
      });
      pushNotification('Border checkpoint passed ✓', 'success');
    }
  }, 2000);
}

export function setTab(tab: typeof appState.activeTab) {
  appState.activeTab = tab;
}
