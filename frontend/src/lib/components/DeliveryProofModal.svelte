<script lang="ts">
  import { generateDynamicQR, type SignedQRPayload } from '../crypto';
  import { t, submitPOD } from '../store.svelte';
  import { X, ScanLine, AlertTriangle, RefreshCw, MapPin, Camera, CheckCircle2 } from 'lucide-svelte';
  import WebApp from '@twa-dev/sdk';

  let { lotId, amountUsd, onClose } = $props<{ lotId: string, amountUsd: number, onClose: () => void }>();

  let step = $state<'gps' | 'photo' | 'qr'>('gps');

  // GPS State
  let gpsFixed = $state(false);
  let isFixingGps = $state(false);

  // Photo State
  let photoCaptured = $state(false);

  // QR State
  let qrData = $state<SignedQRPayload | null>(null);
  let timeLeft = $state(180);
  let timerInterval: any;

  function generateNewQR() {
    qrData = generateDynamicQR(lotId, amountUsd, 180);
    timeLeft = 180;
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        generateNewQR();
      }
    }, 1000);
  }

  function handleFixGps() {
    isFixingGps = true;
    setTimeout(() => {
      gpsFixed = true;
      isFixingGps = false;
      if (typeof WebApp !== 'undefined' && WebApp.HapticFeedback) {
        WebApp.HapticFeedback.notificationOccurred('success');
      }
      setTimeout(() => step = 'photo', 1000);
    }, 1500);
  }

  function handleCapturePhoto() {
    // In real app, open camera API
    photoCaptured = true;
    if (typeof WebApp !== 'undefined' && WebApp.HapticFeedback) {
      WebApp.HapticFeedback.notificationOccurred('success');
    }
    setTimeout(() => {
      step = 'qr';
      generateNewQR();
      submitPOD(); // Trigger state change in FSM
    }, 1000);
  }

  $effect(() => {
    return () => clearInterval(timerInterval);
  });

  let minutes = $derived(Math.floor(timeLeft / 60));
  let seconds = $derived((timeLeft % 60).toString().padStart(2, '0'));
  let qrJsonString = $derived(qrData ? JSON.stringify(qrData, null, 2) : '');

</script>

<div class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-md p-4 transition-all">
  <div class="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-10">
    <button onclick={onClose} class="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
      <X size={24} />
    </button>

    <div class="text-center space-y-6 pt-2 pb-4">
      
      <!-- Progress Bar -->
      <div class="flex items-center justify-center gap-2 mb-6">
        <div class={`h-1.5 flex-1 rounded-full ${step === 'gps' || step === 'photo' || step === 'qr' ? 'bg-emerald-500' : 'bg-zinc-800'}`}></div>
        <div class={`h-1.5 flex-1 rounded-full ${step === 'photo' || step === 'qr' ? 'bg-emerald-500' : 'bg-zinc-800'}`}></div>
        <div class={`h-1.5 flex-1 rounded-full ${step === 'qr' ? 'bg-emerald-500' : 'bg-zinc-800'}`}></div>
      </div>

      {#if step === 'gps'}
        <div class="space-y-4">
          <div class="w-20 h-20 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20 relative">
            {#if isFixingGps}
              <div class="absolute inset-0 border-2 border-blue-400 rounded-full border-t-transparent animate-spin"></div>
            {:else if gpsFixed}
              <CheckCircle2 size={40} class="text-emerald-400"/>
            {:else}
              <MapPin size={40} />
            {/if}
          </div>
          
          <div>
            <h3 class="text-2xl font-bold font-display text-white">Шаг 1: Геопозиция</h3>
            <p class="text-sm text-zinc-400 mt-2">Необходимо зафиксировать координаты выгрузки для смарт-контракта.</p>
          </div>

          <button 
            onclick={handleFixGps}
            disabled={isFixingGps || gpsFixed}
            class="w-full h-14 mt-4 rounded-2xl bg-blue-500 text-white font-bold text-lg disabled:opacity-50"
          >
            {isFixingGps ? 'Получение координат...' : gpsFixed ? 'Зафиксировано ✓' : 'Фиксировать GPS'}
          </button>
        </div>

      {:else if step === 'photo'}
        <div class="space-y-4">
          <div class="w-20 h-20 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20 relative">
            {#if photoCaptured}
              <CheckCircle2 size={40} class="text-emerald-400"/>
            {:else}
              <Camera size={40} />
            {/if}
          </div>
          
          <div>
            <h3 class="text-2xl font-bold font-display text-white">Шаг 2: Фото-отчет</h3>
            <p class="text-sm text-zinc-400 mt-2">Сделайте фото открытого кузова или подписанной CMR.</p>
          </div>

          <button 
            onclick={handleCapturePhoto}
            disabled={photoCaptured}
            class="w-full h-14 mt-4 rounded-2xl bg-amber-500 text-black font-bold text-lg disabled:opacity-50"
          >
            {photoCaptured ? 'Фото загружено ✓' : 'Сделать фото'}
          </button>
        </div>

      {:else if step === 'qr'}
        <div class="space-y-4">
          <div>
            <h3 class="text-2xl font-bold font-display text-white">Шаг 3: QR-код</h3>
            <p class="text-sm text-zinc-400 mt-1">{t.qrDesc}</p>
          </div>

          <!-- Dynamic QR -->
          <div class="bg-white p-4 rounded-2xl mx-auto w-48 h-48 border-4 border-emerald-500/30 relative shadow-[0_0_30px_rgba(16,185,129,0.15)] mt-4">
            <div class="w-full h-full flex items-center justify-center relative">
              <ScanLine size={80} class="text-black/80" />
              <div class="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
          </div>

          <!-- Timer -->
          <div class="flex items-center justify-center gap-2 mt-4 text-emerald-400 font-mono font-bold text-lg bg-emerald-500/10 py-2 rounded-xl border border-emerald-500/20">
            <RefreshCw size={16} class={timeLeft <= 10 ? 'animate-spin text-red-400' : ''} />
            <span class={timeLeft <= 10 ? 'text-red-400' : ''}>{minutes}:{seconds}</span>
          </div>

          <div class="mt-4 text-left">
            <div class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
              <AlertTriangle size={12}/> FSM Payload (Auto-updating)
            </div>
            <pre class="text-[9px] text-emerald-300/70 bg-black p-3 rounded-xl overflow-x-auto border border-zinc-800 font-mono leading-tight">{qrJsonString}</pre>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  @keyframes scan {
    0% { transform: translateY(-100%); }
    50% { transform: translateY(100%); }
    100% { transform: translateY(-100%); }
  }
</style>
