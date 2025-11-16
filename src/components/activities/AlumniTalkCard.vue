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

// Calculate registration progress
const registrationPercentage = computed(() => {
  return Math.round((props.activity.registered / props.activity.capacity) * 100)
})

// Years since graduation
const yearsSinceGraduation = computed(() => {
  const currentYear = new Date().getFullYear()
  return currentYear - props.activity.speaker.graduationYear
})
</script>

<template>
  <Card :hoverable="true" :micro-break="microBreak" variant="glass">
    <!-- Header -->
    <div class="mb-4">
      <div class="flex items-start gap-2 mb-3">
        <span class="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-slate-100 to-blue-100 text-slate-800 rounded-lg border border-slate-200">
          💡 ALUMNI TALK
        </span>
        <span v-if="activity.recordingAvailable"
              class="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-lg">
          🎥 Recording Available
        </span>
      </div>

      <h3 class="text-2xl font-semibold text-stone-950 leading-tight mb-3">
        {{ activity.title }}
      </h3>
    </div>

    <!-- Speaker Info - Prominent Section -->
    <div class="mb-4 p-4 bg-gradient-to-br from-white to-stone-50 rounded-xl border-2 border-stone-200">
      <div class="flex items-start gap-4">
        <!-- Speaker Avatar -->
        <div class="w-16 h-16 bg-gradient-to-br from-slate-600 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {{ activity.speaker.name.split(' ').map(n => n[0]).join('') }}
        </div>

        <!-- Speaker Details -->
        <div class="flex-1 min-w-0">
          <h4 class="text-lg font-bold text-stone-950 mb-1">
            {{ activity.speaker.name }}
          </h4>
          <p class="text-sm font-semibold text-stone-700 mb-1">
            {{ activity.speaker.position }}
          </p>
          <p class="text-sm text-stone-600 mb-2">
            {{ activity.speaker.company }}
          </p>

          <!-- Graduation Info -->
          <div class="flex items-center gap-2 text-xs text-stone-500">
            <span>🎓 IIUM {{ activity.speaker.graduationYear }}</span>
            <span>•</span>
            <span>{{ yearsSinceGraduation }}+ years in industry</span>
          </div>
        </div>
      </div>

      <!-- Speaker Bio -->
      <p class="text-sm text-stone-700 leading-relaxed mt-3 pt-3 border-t border-stone-200">
        {{ activity.speaker.bio }}
      </p>

      <!-- Expertise Tags -->
      <div class="mt-3 flex flex-wrap gap-2">
        <span v-for="skill in activity.speaker.expertise"
              :key="skill"
              class="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-md">
          {{ skill }}
        </span>
      </div>
    </div>

    <!-- Talk Description -->
    <p class="text-stone-700 leading-relaxed mb-4">
      {{ activity.description }}
    </p>

    <!-- Session Highlights -->
    <div class="mb-4">
      <p class="text-sm font-medium text-stone-900 mb-2">Session Highlights:</p>
      <ul class="space-y-1.5">
        <li v-for="highlight in activity.highlights"
            :key="highlight"
            class="text-sm text-stone-700 flex items-start gap-2">
          <span class="text-amber-600 flex-shrink-0">→</span>
          <span>{{ highlight }}</span>
        </li>
      </ul>
    </div>

    <!-- Event Details -->
    <div class="mb-4 p-3 bg-stone-50 rounded-lg">
      <div class="space-y-1.5 text-sm text-stone-600">
        <div class="flex items-center gap-2">
          <span class="text-stone-400">📅</span>
          <span>{{ formattedDate }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-stone-400">📍</span>
          <span>{{ activity.location }}</span>
        </div>
        <div v-if="activity.qnaSession" class="flex items-center gap-2">
          <span class="text-stone-400">💬</span>
          <span class="font-medium text-amber-700">Live Q&A Session Included</span>
        </div>
      </div>
    </div>

    <!-- Registration Progress -->
    <div class="mb-4">
      <div class="flex items-center justify-between text-sm mb-2">
        <span class="font-medium text-stone-900">Registration</span>
        <span class="text-stone-600">{{ activity.registered }}/{{ activity.capacity }} registered</span>
      </div>
      <div class="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-slate-600 to-blue-700 transition-all duration-500"
             :style="{ width: `${registrationPercentage}%` }">
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="pt-4 border-t border-stone-200 space-y-2">
      <BaseButton variant="primary"
                  size="md"
                  class="w-full">
        Register for Talk →
      </BaseButton>

      <a v-if="activity.speaker.linkedin"
         :href="activity.speaker.linkedin"
         target="_blank"
         rel="noopener noreferrer"
         class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors">
        <span>Connect on LinkedIn</span>
        <span>↗</span>
      </a>
    </div>
  </Card>
</template>

<style scoped>
/* Additional styles if needed */
</style>
