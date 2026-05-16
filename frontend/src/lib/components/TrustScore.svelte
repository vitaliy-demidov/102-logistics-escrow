<script lang="ts">
  import { ShieldCheck, Star } from 'lucide-svelte';

  let { score, completedTrips = 14, verifiedId = true } = $props<{ score: number; completedTrips?: number; verifiedId?: boolean }>();

  let color = $derived(score >= 80 ? 'emerald' : score >= 50 ? 'amber' : 'red');
  let label = $derived(score >= 90 ? 'Excellent' : score >= 80 ? 'Trusted' : score >= 50 ? 'Standard' : 'Risky');
</script>

<div class="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-lg">
  <div class="flex items-center justify-between mb-3">
    <div class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Carrier Trust Score</div>
    <div class="flex items-center gap-1 text-{color}-400">
      <Star size={12} fill="currentColor" />
      <span class="text-sm font-black">{score}/100</span>
    </div>
  </div>

  <!-- Score bar -->
  <div class="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-3">
    <div 
      class="h-full rounded-full transition-all duration-700"
      class:bg-emerald-500={score >= 80}
      class:bg-amber-500={score >= 50 && score < 80}
      class:bg-red-500={score < 50}
      style="width: {score}%"
    ></div>
  </div>

  <div class="grid grid-cols-3 gap-2 text-center">
    <div class="bg-zinc-950 rounded-lg p-2">
      <div class="text-lg font-bold text-white">{completedTrips}</div>
      <div class="text-[9px] text-zinc-500 uppercase">Trips</div>
    </div>
    <div class="bg-zinc-950 rounded-lg p-2">
      <div class="text-lg font-bold" class:text-emerald-400={verifiedId} class:text-red-400={!verifiedId}>
        {verifiedId ? '✓' : '✗'}
      </div>
      <div class="text-[9px] text-zinc-500 uppercase">e-Devlet</div>
    </div>
    <div class="bg-zinc-950 rounded-lg p-2">
      <div class="text-lg font-bold text-emerald-400">{label}</div>
      <div class="text-[9px] text-zinc-500 uppercase">Rank</div>
    </div>
  </div>
</div>
