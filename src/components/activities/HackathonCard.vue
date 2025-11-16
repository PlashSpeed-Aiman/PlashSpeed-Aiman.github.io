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
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(props.activity.schedule)
})

const formattedEndDate = computed(() => {
  return new Intl.DateTimeFormat('en-MY', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(props.activity.endDate)
})

// Countdown to registration deadline
const daysUntilDeadline = computed(() => {
  const now = new Date()
  const deadline = props.activity.registrationDeadline
  const diffTime = deadline - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
})

const isRegistrationOpen = computed(() => {
  return daysUntilDeadline.value > 0
})
</script>

<template>
  <Card :hoverable="true" :micro-break="microBreak" variant="bordered">
    <!-- Header with Theme Badge -->
    <div class="mb-4">
      <div class="flex items-start gap-3 mb-3">
        <span class="px-3 py-1 text-xs font-semibold bg-orange-100 text-orange-800 rounded-lg">
          🏆 HACKATHON
        </span>
        <span v-if="isRegistrationOpen"
              class="px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-lg">
          Registration Open
        </span>
      </div>

      <h3 class="text-2xl font-semibold text-stone-950 leading-tight mb-2">
        {{ activity.title }}
      </h3>

      <!-- Theme -->
      <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
        <span class="text-sm font-medium text-stone-700">Theme:</span>
        <span class="text-sm font-semibold text-amber-700">{{ activity.theme }}</span>
      </div>
    </div>

    <!-- Description -->
    <p class="text-stone-700 leading-relaxed mb-4">
      {{ activity.description }}
    </p>

    <!-- Timeline -->
    <div class="mb-4 p-3 bg-stone-50 rounded-lg">
      <p class="text-sm font-medium text-stone-900 mb-2">Event Timeline:</p>
      <div class="space-y-1 text-sm text-stone-700">
        <div class="flex items-center gap-2">
          <span>📅</span>
          <span>{{ formattedDate }} - {{ formattedEndDate }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span>⏱️</span>
          <span>{{ activity.duration }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span>📍</span>
          <span>{{ activity.location }}</span>
        </div>
      </div>
    </div>

    <!-- Prizes -->
    <div class="mb-4 p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
      <p class="text-sm font-semibold text-stone-900 mb-2">🎁 Prizes:</p>
      <div class="space-y-1 text-sm">
        <div class="flex items-center gap-2">
          <span class="font-medium text-amber-700">1st:</span>
          <span class="text-stone-700">{{ activity.prizes.first }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-medium text-stone-600">2nd:</span>
          <span class="text-stone-700">{{ activity.prizes.second }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-medium text-stone-500">3rd:</span>
          <span class="text-stone-700">{{ activity.prizes.third }}</span>
        </div>
      </div>
    </div>

    <!-- Tech Stack -->
    <div class="mb-4">
      <p class="text-sm font-medium text-stone-900 mb-2">Technologies:</p>
      <div class="flex flex-wrap gap-2">
        <span v-for="tech in activity.technologies"
              :key="tech"
              class="px-2.5 py-1 text-xs font-medium bg-stone-800 text-white rounded-md">
          {{ tech }}
        </span>
      </div>
    </div>

    <!-- Footer -->
    <div class="pt-4 border-t border-stone-200">
      <div class="flex items-center justify-between mb-3">
        <div class="text-sm text-stone-600">
          <span class="font-medium">Team Size:</span>
          {{ activity.teamSize.min }}-{{ activity.teamSize.max }} members
        </div>
        <div v-if="isRegistrationOpen" class="text-sm font-semibold text-amber-700">
          ⏰ {{ daysUntilDeadline }} days left to register
        </div>
      </div>

      <BaseButton :variant="isRegistrationOpen ? 'primary' : 'secondary'"
                  size="md"
                  class="w-full">
        {{ isRegistrationOpen ? 'Register Team →' : 'View Details' }}
      </BaseButton>
    </div>
  </Card>
</template>

<style scoped>
/* Additional styles if needed */
</style>
