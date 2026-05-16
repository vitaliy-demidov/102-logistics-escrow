import WebApp from '@twa-dev/sdk';

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
    showQR: "Show Release QR",
    timerExpired: "QR Expired. Generating new...",
    qrDesc: "Show this code to the buyer to release funds.",
    scanWait: "Waiting for buyer to scan..."
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
    showQR: "Код выгрузки",
    timerExpired: "Код истек. Генерируем новый...",
    qrDesc: "Покажите этот код покупателю для разблокировки средств.",
    scanWait: "Ожидание сканирования покупателем..."
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
    showQR: "Teslimat Kodunu Göster",
    timerExpired: "Kodun süresi doldu. Yenileniyor...",
    qrDesc: "Fonları serbest bırakmak için bu kodu alıcıya gösterin.",
    scanWait: "Alıcının taraması bekleniyor..."
  }
};

type Lot = {
  id: string;
  from: string;
  to: string;
  priceUsd: number;
  weightTons: number;
  distanceKm: number;
  type: string;
};

// Mock Data for "Tinder" Cards
const mockLots: Lot[] = [
  { id: 'TR-1042', from: 'Стамбул', to: 'Москва', priceUsd: 5400, weightTons: 20, distanceKm: 2800, type: 'Тент' },
  { id: 'TR-1043', from: 'Измир', to: 'Минск', priceUsd: 4800, weightTons: 22, distanceKm: 2400, type: 'Рефрижератор' },
  { id: 'RU-9921', from: 'Ростов', to: 'Тбилиси', priceUsd: 1200, weightTons: 10, distanceKm: 800, type: 'Тент (ADR)' },
  { id: 'TR-1044', from: 'Анталья', to: 'Алматы', priceUsd: 8200, weightTons: 20, distanceKm: 5100, type: 'Рефрижератор' },
];

export const appState = $state({
  lang: 'ru', // default fallback
  user: null as any,
  lots: mockLots,
  activeLot: null as Lot | null, // If accepted, this becomes the active state
});

export const t = $derived(translations[appState.lang] || translations.ru);

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
    if (lot) appState.activeLot = lot; // "Tinder Match!" - becomes active route
  }
  // Remove from stack
  appState.lots = appState.lots.filter(l => l.id !== lotId);
  
  if (typeof WebApp !== 'undefined' && WebApp.HapticFeedback) {
    WebApp.HapticFeedback.impactOccurred(accepted ? 'heavy' : 'light');
  }
}
