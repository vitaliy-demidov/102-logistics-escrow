<script lang="ts">
  import { appState } from '../store.svelte';
  import { Navigation, MapPin, Flag } from 'lucide-svelte';

  let lot = $derived(appState.activeLot);
</script>

{#if lot}
<div class="w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
  <!-- Mini Map Visualization -->
  <div class="relative h-48 bg-zinc-950 overflow-hidden">
    <!-- Grid background -->
    <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px); background-size: 20px 20px;"></div>
    
    <!-- Route line -->
    <svg class="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
      <defs>
        <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#10b981" stop-opacity="0.8" />
          <stop offset={`${lot.routeProgress}%`} stop-color="#3b82f6" stop-opacity="1" />
          <stop offset={`${lot.routeProgress}%`} stop-color="#3f3f46" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#3f3f46" stop-opacity="0.3" />
        </linearGradient>
      </defs>
      <!-- Route path -->
      <path d="M 40 160 C 120 140, 160 60, 200 80 S 300 40, 360 50" fill="none" stroke="url(#routeGrad)" stroke-width="3" stroke-linecap="round" />
      <!-- Dotted remaining -->
      <path d="M 40 160 C 120 140, 160 60, 200 80 S 300 40, 360 50" fill="none" stroke="#3f3f46" stroke-width="1" stroke-dasharray="4 4" />
    </svg>

    <!-- Origin point -->
    <div class="absolute bottom-6 left-6 flex items-center gap-1.5">
      <div class="w-3 h-3 rounded-full bg-emerald-500 border-2 border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
      <span class="text-[10px] font-bold text-emerald-400">{lot.from}</span>
    </div>

    <!-- Destination point -->
    <div class="absolute top-4 right-6 flex items-center gap-1.5">
      <span class="text-[10px] font-bold text-zinc-400">{lot.to}</span>
      <div class="w-3 h-3 rounded-full bg-zinc-600 border-2 border-zinc-500"></div>
    </div>

    <!-- Moving truck indicator -->
    <div 
      class="absolute w-8 h-8 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center shadow-[0_0_16px_rgba(59,130,246,0.4)] transition-all duration-1000"
      style="left: {8 + lot.routeProgress * 0.84}%; top: {70 - lot.routeProgress * 0.5}%;"
    >
      <Navigation size={14} class="text-blue-300" />
    </div>

    <!-- Border checkpoint -->
    {#if lot.routeProgress >= 38}
      <div class="absolute" style="left: 42%; top: 35%;">
        <div class="flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 rounded-full px-2 py-0.5">
          <Flag size={10} class="text-amber-400" />
          <span class="text-[8px] font-bold text-amber-400">BORDER ✓</span>
        </div>
      </div>
    {/if}
  </div>

  <!-- Info bar -->
  <div class="p-4 flex items-center justify-between border-t border-zinc-800">
    <div class="flex items-center gap-3">
      <div class="text-xs text-zinc-500">Progress</div>
      <div class="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div class="h-full bg-blue-500 rounded-full transition-all duration-1000" style="width: {lot.routeProgress}%"></div>
      </div>
      <span class="text-xs font-bold text-white">{Math.round(lot.routeProgress)}%</span>
    </div>
    <div class="flex items-center gap-2">
      <MapPin size={12} class="text-zinc-500" />
      <span class="text-xs font-mono text-zinc-400">{lot.currentCoord.lat.toFixed(2)}°, {lot.currentCoord.lng.toFixed(2)}°</span>
    </div>
  </div>
</div>
{/if}
