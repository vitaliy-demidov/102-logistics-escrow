<script lang="ts">
  import { onMount } from 'svelte';
  import { appState, initApp, swipeLot, getT, ShipmentState, ActionOwner, openDispute, startLiveTracking, setTab } from '../lib/store.svelte';
  import DeliveryProofModal from '../lib/components/DeliveryProofModal.svelte';
  import EscrowCard from '../lib/components/EscrowCard.svelte';
  import LiveMap from '../lib/components/LiveMap.svelte';
  import TrustScore from '../lib/components/TrustScore.svelte';
  import ShipmentTimeline from '../lib/components/ShipmentTimeline.svelte';
  import FinanceCard from '../lib/components/FinanceCard.svelte';
  import { MapPin, ArrowRight, ShieldCheck, Truck, CheckCircle2, AlertTriangle, AlertCircle, Map, DollarSign, Clock, Bell, Navigation } from 'lucide-svelte';

  let showDeliveryProof = $state(false);
  let t = $derived(getT());

  onMount(() => {
    initApp();
  });

  let masterStatusColor = $derived(
    appState.activeLot?.shipmentState === ShipmentState.COMPLETED ? 'bg-emerald-500' :
    appState.activeLot?.shipmentState === ShipmentState.DISPUTED ? 'bg-red-500' :
    appState.activeLot?.shipmentState === ShipmentState.POD_SUBMITTED ? 'bg-amber-500' :
    'bg-blue-500'
  );

  let masterStatusText = $derived(
    appState.activeLot?.shipmentState === ShipmentState.COMPLETED ? 'DELIVERED' :
    appState.activeLot?.shipmentState === ShipmentState.DISPUTED ? 'DISPUTED' :
    appState.activeLot?.shipmentState === ShipmentState.POD_SUBMITTED ? 'AWAITING BUYER' :
    appState.activeLot?.shipmentState === ShipmentState.IN_TRANSIT ? 'IN TRANSIT' :
    'PENDING'
  );

  let unreadCount = $derived(appState.notifications.filter(n => !n.read).length);
</script>

<div class="h-full w-full flex flex-col bg-zinc-950 overflow-hidden">
  <!-- Header -->
  <header class="flex items-center justify-between px-4 pt-6 pb-3 flex-shrink-0">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
        <Truck class="text-emerald-400" size={18} />
      </div>
      <h1 class="text-lg font-bold font-display leading-tight">SPRUT Logistics</h1>
    </div>
    <div class="flex items-center gap-2">
      <!-- Notification bell -->
      {#if unreadCount > 0}
        <div class="relative">
          <Bell size={18} class="text-zinc-400" />
          <div class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[8px] font-bold text-white flex items-center justify-center">{unreadCount}</div>
        </div>
      {/if}
      <div class="px-2 py-1 bg-zinc-900 rounded border border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase">{appState.lang}</div>
    </div>
  </header>

  <!-- Tab Navigation (only when activeLot exists) -->
  {#if appState.activeLot}
    <nav class="flex gap-1 px-4 mb-4 flex-shrink-0">
      {#each [
        { id: 'main', icon: Navigation, label: 'Route' },
        { id: 'map', icon: Map, label: 'Map' },
        { id: 'finance', icon: DollarSign, label: 'Finance' },
        { id: 'timeline', icon: Clock, label: 'Events' },
      ] as tab}
        {@const TabIcon = tab.icon}
        <button 
          onclick={() => setTab(tab.id as 'main' | 'map' | 'finance' | 'timeline')}
          class="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all"
          class:bg-emerald-500={appState.activeTab === tab.id}
          class:text-black={appState.activeTab === tab.id}
          class:bg-zinc-900={appState.activeTab !== tab.id}
          class:text-zinc-500={appState.activeTab !== tab.id}
        >
          <TabIcon size={14} />
          {tab.label}
        </button>
      {/each}
    </nav>
  {/if}

  <!-- Main Content -->
  <div class="flex-1 overflow-y-auto no-scrollbar px-4 pb-8">
    {#if appState.activeLot}

      {#if appState.activeTab === 'main'}
        <!-- Master Status -->
        <div class="w-full flex items-center gap-4 mb-6">
          <div class={`w-3 h-14 rounded-full ${masterStatusColor}`}></div>
          <div class="flex-1">
            <h2 class="text-2xl font-display font-black text-white uppercase tracking-wider">{masterStatusText}</h2>
            <div class="flex items-center gap-1 mt-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <span class={appState.activeLot.shipmentState === ShipmentState.IN_TRANSIT || appState.activeLot.shipmentState === ShipmentState.POD_SUBMITTED ? 'text-blue-400' : ''}>Pickup</span>
              <span class="text-zinc-700">→</span>
              <span class={appState.activeLot.shipmentState === ShipmentState.IN_TRANSIT || appState.activeLot.shipmentState === ShipmentState.POD_SUBMITTED ? 'text-blue-400' : ''}>Transit</span>
              <span class="text-zinc-700">→</span>
              <span class={appState.activeLot.shipmentState === ShipmentState.POD_SUBMITTED ? 'text-blue-400' : ''}>Arrival</span>
              <span class="text-zinc-700">→</span>
              <span class={appState.activeLot.shipmentState === ShipmentState.COMPLETED ? 'text-emerald-400' : ''}>POD</span>
            </div>
          </div>
          <!-- ETA badge -->
          <div class="text-right">
            <div class="text-[10px] text-zinc-500 uppercase font-bold">ETA</div>
            <div class="text-lg font-black text-white">{appState.activeLot.etaHours}h</div>
          </div>
        </div>

        <!-- Mini Map Preview -->
        <div class="mb-4">
          <LiveMap />
        </div>

        <!-- Escrow Card -->
        <div class="mb-4">
          <EscrowCard amountUsd={appState.activeLot.priceUsd} state={appState.activeLot.escrowState} buyer={appState.activeLot.buyer} />
        </div>

        <!-- Trust Score -->
        <div class="mb-4">
          <TrustScore score={appState.activeLot.trustScore} />
        </div>

        <!-- Action Ownership -->
        <div class="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mb-4 relative overflow-hidden">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
          <div class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2">Required Action</div>
          
          {#if appState.activeLot.requiredActionOwner === ActionOwner.DRIVER}
            <div class="flex justify-between items-center mb-3">
              <div class="font-bold text-white flex items-center gap-2 text-sm"><AlertCircle size={16} class="text-amber-500"/> Your turn (Driver)</div>
              <div class="text-[10px] text-amber-500 font-bold">23h left</div>
            </div>
            <p class="text-xs text-zinc-400 mb-4">Submit Delivery Proof (GPS, Photo, QR) upon arrival.</p>
            <button 
              onclick={() => showDeliveryProof = true}
              class="w-full h-14 rounded-xl bg-emerald-500 text-black font-bold text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95 transition-transform"
            >
              <CheckCircle2 size={20} /> Submit Delivery Proof
            </button>
          {:else if appState.activeLot.requiredActionOwner === ActionOwner.BUYER}
            <div class="flex justify-between items-center mb-2">
              <div class="font-bold text-white flex items-center gap-2 text-sm"><AlertCircle size={16} class="text-amber-500"/> Buyer's turn ({appState.activeLot.buyer})</div>
              <div class="text-[10px] text-amber-500 font-bold">24h SLA</div>
            </div>
            <p class="text-xs text-zinc-400">Waiting for buyer confirmation. Auto-release after SLA.</p>
          {:else if appState.activeLot.requiredActionOwner === ActionOwner.DISPATCHER}
            <div class="font-bold text-red-400 flex items-center gap-2 mb-2"><AlertTriangle size={16}/> Dispute Under Review</div>
            <p class="text-xs text-zinc-400">Escrow frozen. Arbitration team will contact you.</p>
          {/if}
        </div>

        <!-- Dispute button -->
        {#if appState.activeLot.shipmentState !== ShipmentState.DISPUTED && appState.activeLot.shipmentState !== ShipmentState.COMPLETED}
          <button onclick={openDispute} class="w-full mt-2 text-xs font-bold text-red-500/70 hover:text-red-400 transition-colors py-3">
            {t.openDispute}
          </button>
        {/if}

      {:else if appState.activeTab === 'map'}
        <h3 class="text-lg font-bold font-display mb-4 text-white">Live Tracking</h3>
        <LiveMap />
        <div class="mt-4 grid grid-cols-2 gap-3">
          <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
            <div class="text-[10px] text-zinc-500 font-bold uppercase">Speed</div>
            <div class="text-xl font-black text-white">82 <span class="text-xs text-zinc-500">km/h</span></div>
          </div>
          <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
            <div class="text-[10px] text-zinc-500 font-bold uppercase">Distance Left</div>
            <div class="text-xl font-black text-white">{Math.round(appState.activeLot.distanceKm * (1 - appState.activeLot.routeProgress / 100))} <span class="text-xs text-zinc-500">km</span></div>
          </div>
        </div>
        <div class="mt-4">
          <TrustScore score={appState.activeLot.trustScore} />
        </div>

      {:else if appState.activeTab === 'finance'}
        <h3 class="text-lg font-bold font-display mb-4 text-white">Financial Overview</h3>
        <FinanceCard 
          amountUsd={appState.activeLot.priceUsd}
          commissionPct={appState.activeLot.commissionPct}
          escrowFeePct={appState.activeLot.escrowFeePct}
          etaHours={appState.activeLot.etaHours}
        />
        <div class="mt-4">
          <EscrowCard amountUsd={appState.activeLot.priceUsd} state={appState.activeLot.escrowState} buyer={appState.activeLot.buyer} />
        </div>

      {:else if appState.activeTab === 'timeline'}
        <h3 class="text-lg font-bold font-display mb-4 text-white">Shipment Events</h3>
        <ShipmentTimeline events={appState.activeLot.timeline} />
      {/if}

    {:else if appState.lots.length > 0}
      <!-- Tinder Cards -->
      {@const lot = appState.lots[0]}
        <div class="w-full max-w-sm mx-auto aspect-[3/4] bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col mt-4">
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
            </div>
            <div class="flex items-center gap-3 w-full">
              <button onclick={() => swipeLot(lot.id, false)} class="flex-1 h-14 rounded-2xl bg-zinc-800 text-zinc-400 font-bold border border-zinc-700">{t.reject}</button>
              <button onclick={() => { swipeLot(lot.id, true); startLiveTracking(); }} class="flex-[2] h-14 rounded-2xl bg-emerald-500 text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)]">{t.accept}</button>
            </div>
          </div>
        </div>
    {:else}
      <div class="text-center space-y-4 m-auto pt-20">
        <div class="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mx-auto border border-zinc-800">
          <MapPin size={24} class="text-zinc-600" />
        </div>
        <p class="text-zinc-500 max-w-[200px] mx-auto text-sm">{t.noMoreLots}</p>
      </div>
    {/if}
  </div>
</div>

{#if showDeliveryProof && appState.activeLot}
  <DeliveryProofModal 
    lotId={appState.activeLot.id} 
    amountUsd={appState.activeLot.priceUsd} 
    onClose={() => showDeliveryProof = false} 
  />
{/if}
