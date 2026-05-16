<script lang="ts">
  import { generateDynamicQR, type SignedQRPayload } from '../crypto';
  import { t } from '../store.svelte';
  import { X, ScanLine, AlertTriangle, RefreshCw } from 'lucide-svelte';

  let { lotId, amountUsd, onClose } = $props<{ lotId: string, amountUsd: number, onClose: () => void }>();

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
        generateNewQR(); // Auto-refresh when expired
      }
    }, 1000);
  }

  $effect(() => {
    generateNewQR();
    return () => clearInterval(timerInterval); // Cleanup on unmount
  });

  let minutes = $derived(Math.floor(timeLeft / 60));
  let seconds = $derived((timeLeft % 60).toString().padStart(2, '0'));
  
  // Format JSON beautifully for the mock UI to prove it works
  let qrJsonString = $derived(qrData ? JSON.stringify(qrData, null, 2) : '');

</script>

<div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
  <div class="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative">
    <button onclick={onClose} class="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white rounded-full bg-zinc-800/50">
      <X size={20} />
    </button>

    <div class="text-center space-y-4 pt-2">
      <h3 class="text-xl font-bold text-white">{t.showQR}</h3>
      <p class="text-sm text-zinc-400">{t.qrDesc}</p>

      <!-- The Dynamic QR Area -->
      <div class="bg-white p-4 rounded-2xl mx-auto border-4 border-emerald-500/30 relative shadow-[0_0_30px_rgba(16,185,129,0.15)] mt-6">
        <!-- We use ScanLine icon instead of real QR canvas for the prototype to save time -->
        <div class="w-full h-48 flex items-center justify-center relative">
          <ScanLine size={80} class="text-black/80" />
          <div class="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
        </div>
      </div>

      <!-- TTL Visual Timer -->
      <div class="flex items-center justify-center gap-2 mt-4 text-emerald-400 font-mono font-bold text-lg bg-emerald-500/10 py-2 rounded-xl border border-emerald-500/20">
        <RefreshCw size={16} class={timeLeft <= 10 ? 'animate-spin text-red-400' : ''} />
        <span class={timeLeft <= 10 ? 'text-red-400' : ''}>{minutes}:{seconds}</span>
      </div>

      <!-- RAW Payload Display (For debugging/proof of architecture) -->
      <div class="mt-6 text-left">
        <div class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
          <AlertTriangle size={12}/> Raw HMAC-SHA256 Payload (Auto-updating)
        </div>
        <pre class="text-[9px] text-emerald-300/70 bg-black p-3 rounded-xl overflow-x-auto border border-zinc-800 font-mono leading-tight">{qrJsonString}</pre>
      </div>

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
