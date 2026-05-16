<script lang="ts">
  import type { TimelineEvent } from '../store.svelte';
  import { Truck, ShieldCheck, Flag, AlertTriangle, CheckCircle2, ScanLine } from 'lucide-svelte';

  let { events } = $props<{ events: TimelineEvent[] }>();

  let sorted = $derived([...events].sort((a, b) => b.timestamp - a.timestamp));

  function fmtTime(ts: number) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const iconMap: Record<string, any> = { truck: Truck, shield: ShieldCheck, flag: Flag, alert: AlertTriangle, check: CheckCircle2, scan: ScanLine };
  const colorMap: Record<string, string> = { info: 'text-blue-400 bg-blue-500/10 border-blue-500/20', success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20', danger: 'text-red-400 bg-red-500/10 border-red-500/20' };
</script>

<div class="w-full space-y-0">
  {#each sorted as event, i (event.id)}
    <div class="flex gap-3 relative">
      {#if i < sorted.length - 1}
        <div class="absolute left-[15px] top-[32px] bottom-0 w-px bg-zinc-800"></div>
      {/if}
      
      <div class={`w-[30px] h-[30px] rounded-lg border flex-shrink-0 flex items-center justify-center ${colorMap[event.severity] ?? ''}`}>
        {#if iconMap[event.icon]}
          {@const Icon = iconMap[event.icon]}
          <Icon size={14} />
        {/if}
      </div>

      <div class="flex-1 pb-4">
        <div class="flex items-baseline justify-between">
          <span class="text-sm font-bold text-white">{event.title}</span>
          <span class="text-[10px] text-zinc-500 font-mono">{fmtTime(event.timestamp)}</span>
        </div>
        <p class="text-xs text-zinc-400 mt-0.5">{event.detail}</p>
      </div>
    </div>
  {/each}
</div>
