<script lang="ts">
  let { amountUsd, commissionPct, escrowFeePct, etaHours } = $props<{
    amountUsd: number; commissionPct: number; escrowFeePct: number; etaHours: number;
  }>();

  let commission = $derived(amountUsd * commissionPct / 100);
  let escrowFee = $derived(amountUsd * escrowFeePct / 100);
  let netPayout = $derived(amountUsd - commission - escrowFee);
</script>

<div class="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
  <div class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-4">Financial Breakdown</div>
  
  <div class="space-y-3">
    <div class="flex justify-between items-center">
      <span class="text-xs text-zinc-400">Gross Amount</span>
      <span class="text-sm font-bold text-white">${amountUsd.toLocaleString()}</span>
    </div>
    <div class="flex justify-between items-center">
      <span class="text-xs text-zinc-400">Platform Commission ({commissionPct}%)</span>
      <span class="text-sm font-bold text-red-400">-${commission.toFixed(0)}</span>
    </div>
    <div class="flex justify-between items-center">
      <span class="text-xs text-zinc-400">Escrow Fee ({escrowFeePct}%)</span>
      <span class="text-sm font-bold text-red-400">-${escrowFee.toFixed(0)}</span>
    </div>
    <div class="border-t border-zinc-800 pt-3 flex justify-between items-center">
      <span class="text-xs font-bold text-zinc-300">Net Payout</span>
      <span class="text-lg font-black text-emerald-400">${netPayout.toFixed(0)}</span>
    </div>
    <div class="flex justify-between items-center">
      <span class="text-xs text-zinc-400">Payout ETA</span>
      <span class="text-xs font-bold text-amber-400">{etaHours > 0 ? `~${etaHours}h after delivery` : 'Upon confirmation'}</span>
    </div>
  </div>
</div>
