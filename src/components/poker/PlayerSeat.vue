<script setup>
defineProps({
  p: { type: Object, required: true },
  large: Boolean,
  handNumber: { type: Number, default: 0 },
  isTurn: Boolean,
  isWinner: Boolean,
  isDealer: Boolean,
  blind: { type: String, default: '' },
  status: { type: String, default: '' },
  showBet: Boolean,
  cardSrc: { type: Function, required: true },
  cardAlt: { type: Function, required: true },
  faceUp: Boolean,
})
</script>

<template>
  <div
    :class="[
      'seat flex flex-col items-center gap-1 rounded-xl px-2 py-2 transition-all duration-300',
      isTurn ? 'seat-active' : '',
      isWinner ? 'seat-winner' : '',
      p.out ? 'opacity-40' : '',
    ]"
  >
    <div class="flex -space-x-3 sm:-space-x-2">
      <template v-if="p.hand.length">
        <img
          v-for="(c, i) in p.hand"
          :key="`${handNumber}-${i}`"
          :src="cardSrc(faceUp ? c : null)"
          :alt="faceUp ? cardAlt(c) : 'Face-down card'"
          :class="['card-img deal-in', large ? 'card-lg' : '', p.folded ? 'opacity-40 grayscale' : '']"
        />
      </template>
      <template v-else>
        <div :class="['card-slot', large ? 'card-lg' : '']" />
        <div :class="['card-slot', large ? 'card-lg' : '']" />
      </template>
    </div>

    <div class="flex items-center gap-1.5 text-white text-sm font-semibold">
      <span v-if="isDealer" class="dealer-btn" title="Dealer">D</span>
      <span>{{ p.name }}</span>
      <span v-if="blind" class="text-[10px] px-1 rounded bg-white/20 text-amber-100">{{ blind }}</span>
    </div>
    <div class="text-amber-200 text-xs font-mono">{{ p.chips }}</div>
    <div class="h-4 text-[11px] text-amber-50/90 whitespace-nowrap">{{ status }}</div>
    <div v-if="showBet" class="bet-chip">{{ p.bet }}</div>
    <div v-else class="h-5" />
  </div>
</template>
