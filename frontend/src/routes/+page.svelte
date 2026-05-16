<script lang="ts">
  import { onMount } from 'svelte';
  import { appState, initApp, swipeLot, t } from '../lib/store.svelte';
  import QRModal from '../lib/components/QRModal.svelte';
  import { MapPin, ArrowRight, ShieldCheck, Truck, Navigation, CheckCircle2 } from 'lucide-svelte';

  let showQR = $state(false);

  onMount(() => {
    initApp();
  });

</script>

<div class="h-full w-full flex flex-col pt-8 pb-10 px-4 bg-zinc-950">
  <!-- Header -->
  <header class="flex items-center justify-between mb-8 flex-shrink-0">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
        <Truck class="text-emerald-400" size={18} />
      </div>
      <div>
        <h1 class="text-lg font-bold font-display leading-tight">SPRUT Logistics</h1>
        <p class="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Microservice 102</p>
      </div>
    </div>
    <div class="px-2 py-1 bg-zinc-900 rounded border border-zinc-800 text-xs font-bold text-zinc-400 uppercase">
      {appState.lang}
    </div>
  </header>

  <!-- Main Content Area -->
  <div class="flex-1 relative flex flex-col items-center justify-center">
    
    {#if appState.activeLot}
      <!-- Active Route View -->
      <div class="w-full h-full flex flex-col items-center justify-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
        <div class="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 relative">
          <div class="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
          <Navigation size={40} class="text-emerald-400" />
        </div>
        
        <div class="text-center space-y-2">
          <h2 class="text-2xl font-bold font-display text-white">{appState.activeLot.from} → {appState.activeLot.to}</h2>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/30">
            <ShieldCheck size={14} /> {t.escrow}: ${appState.activeLot.priceUsd}
          </div>
        </div>

        <button 
          onclick={() => showQR = true}
          class="w-full max-w-sm mt-8 h-16 rounded-2xl bg-emerald-500 text-black font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all active:scale-95"
        >
          <CheckCircle2 size={24} />
          {t.showQR}
        </button>
      </div>

    {:else if appState.lots.length > 0}
      <!-- Tinder Cards Stack (Simplified top card approach) -->
      {#let lot = appState.lots[0]}
        <div class="w-full max-w-sm aspect-[3/4] bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col">
          <!-- Mock Map BG -->
          <div class="absolute inset-0 opacity-20 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/37.6173,55.7558,4,0/600x800?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJleGFtcGxlIn0')] bg-cover bg-center"></div>
          
          <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>

          <div class="relative z-10 p-6 flex-1 flex flex-col justify-end">
            <div class="inline-flex items-center gap-1 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-2 bg-emerald-500/10 px-2 py-1 rounded-full w-max border border-emerald-500/20">
              <ShieldCheck size={12} /> {t.escrow}
            </div>
            
            <h2 class="text-3xl font-bold font-display leading-tight mb-4 flex items-center gap-2">
              {lot.from} <ArrowRight class="text-zinc-500" size={24} /> {lot.to}
            </h2>

            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{t.rate}</div>
                <div class="text-2xl font-bold text-emerald-400">${lot.priceUsd}</div>
              </div>
              <div>
                <div class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{t.distance}</div>
                <div class="text-lg font-bold text-white">{lot.distanceKm} km</div>
              </div>
              <div>
                <div class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{t.weight}</div>
                <div class="text-lg font-bold text-white">{lot.weightTons} t</div>
              </div>
              <div>
                <div class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Type</div>
                <div class="text-sm font-bold text-white truncate">{lot.type}</div>
              </div>
            </div>

            <div class="flex items-center gap-3 w-full">
              <button 
                onclick={() => swipeLot(lot.id, false)}
                class="flex-1 h-14 rounded-2xl bg-zinc-800 text-zinc-400 font-bold border border-zinc-700 hover:bg-zinc-700 transition-colors"
              >
                {t.reject}
              </button>
              <button 
                onclick={() => swipeLot(lot.id, true)}
                class="flex-[2] h-14 rounded-2xl bg-emerald-500 text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:bg-emerald-400 transition-all active:scale-95"
              >
                {t.accept}
              </button>
            </div>
          </div>
        </div>
      {/let}
    {:else}
      <!-- No lots -->
      <div class="text-center space-y-4">
        <div class="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mx-auto border border-zinc-800">
          <MapPin size={24} class="text-zinc-600" />
        </div>
        <p class="text-zinc-500 max-w-[200px] text-sm">{t.noMoreLots}</p>
      </div>
    {/if}
  </div>
</div>

{#if showQR && appState.activeLot}
  <QRModal 
    lotId={appState.activeLot.id} 
    amountUsd={appState.activeLot.priceUsd} 
    onClose={() => showQR = false} 
  />
{/if}
