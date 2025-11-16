<script setup>
import { computed } from 'vue'
import Card from '../base/Card.vue'
import BaseButton from '../base/BaseButton.vue'

const props = defineProps({
  activity: {
    type: Object,
    required: true
  },
  microBreak: {
    type: Boolean,
    default: false
  }
})

// Format date
const formattedDate = computed(() => {
  return new Intl.DateTimeFormat('en-MY', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(props.activity.schedule)
})

// Calculate spots remaining
const spotsRemaining = computed(() => {
  return props.activity.capacity - props.activity.attendeeCount
})
</script>

<template>
  <Card :hoverable="true" :micro-break="microBreak" variant="bordered">
    <!-- Header -->
    <div class="mb-4">
      <div class="flex items-start justify-between gap-3 mb-2">
        <h3 class="text-2xl font-semibold text-stone-950 leading-tight">
          {{ activity.title }}
        </h3>
        <span v-if="activity.recurring"
              class="px-3 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full whitespace-nowrap">
          {{ activity.frequency }}
        </span>
      </div>

      <!-- Date & Location -->
      <div class="space-y-1 text-sm text-stone-600">
        <div class="flex items-center gap-2">
          <span class="text-stone-400">📅</span>
          <span>{{ formattedDate }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-stone-400">📍</span>
          <span>{{ activity.location }}</span>
        </div>
      </div>
    </div>

    <!-- Description -->
    <p class="text-stone-700 leading-relaxed mb-4">
      {{ activity.description }}
    </p>

    <!-- Topics -->
    <div class="mb-4">
      <p class="text-sm font-medium text-stone-900 mb-2">Topics:</p>
      <div class="flex flex-wrap gap-2">
        <span v-for="topic in activity.topics"
              :key="topic"
              class="px-3 py-1 text-sm bg-stone-100 text-stone-700 rounded-md">
          {{ topic }}
        </span>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between pt-4 border-t border-stone-200">
      <div class="flex items-center gap-4 text-sm text-stone-600">
        <div class="flex items-center gap-1">
          <span>👥</span>
          <span class="font-medium">{{ activity.attendeeCount }}/{{ activity.capacity }}</span>
        </div>
        <div v-if="spotsRemaining > 0" class="text-amber-700 font-medium">
          {{ spotsRemaining }} spots left
        </div>
      </div>

      <BaseButton variant="ghost" size="sm">
        Learn More →
      </BaseButton>
    </div>
  </Card>
</template>

<style scoped>
/* Additional styles if needed */
</style>
