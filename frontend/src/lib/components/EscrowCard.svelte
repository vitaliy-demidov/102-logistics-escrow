<script lang="ts">
  import { ShieldCheck, AlertCircle } from 'lucide-svelte';
  import { EscrowState } from '../store.svelte';

  let { amountUsd, state, buyer } = $props<{ amountUsd: number, state: EscrowState, buyer: string }>();

  let statusColor = $derived(
    state === EscrowState.RELEASED ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
    state === EscrowState.RELEASE_PENDING ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
    'text-blue-400 bg-blue-500/10 border-blue-500/30'
  );

  let statusText = $derived(
    state === EscrowState.RELEASED ? 'Funds Released' :
    state === EscrowState.RELEASE_PENDING ? 'Pending Release' :
    'Funds Secured & Locked'
  );

</script>

<div class="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
  <div class="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full"></div>
  
  <div class="flex items-start justify-between mb-4 relative z-10">
    <div>
      <div class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Escrow Vault</div>
      <div class="text-3xl font-display font-bold text-white">${amountUsd}</div>
    </div>
    <div class={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase flex items-center gap-1.5 ${statusColor}`}>
      <ShieldCheck size={14} /> {statusText}
    </div>
  </div>

  <div class="space-y-3 relative z-10 border-t border-zinc-800/50 pt-4">
    <div class="flex justify-between items-center text-xs">
      <span class="text-zinc-500">Beneficiary (Buyer):</span>
      <span class="font-bold text-white">{buyer}</span>
    </div>
    
    <div class="flex justify-between items-start text-xs">
      <span class="text-zinc-500 mt-0.5">Release Conditions:</span>
      <div class="text-right flex flex-col items-end gap-1">
        <span class="flex items-center gap-1 text-zinc-300"><AlertCircle size={12}/> GPS Proof</span>
        <span class="flex items-center gap-1 text-zinc-300"><AlertCircle size={12}/> Photo Proof</span>
        <span class="flex items-center gap-1 text-zinc-300"><AlertCircle size={12}/> QR Scan</span>
      </div>
    </div>

    {#if state === EscrowState.RELEASE_PENDING}
      <div class="mt-2 p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-xs text-amber-400 font-medium text-center">
        Auto-release in 24h if no dispute
      </div>
    {/if}
  </div>
</div>
