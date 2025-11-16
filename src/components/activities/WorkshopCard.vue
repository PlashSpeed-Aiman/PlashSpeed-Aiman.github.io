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

// Calculate enrollment percentage
const enrollmentPercentage = computed(() => {
  return Math.round((props.activity.enrolled / props.activity.capacity) * 100)
})

// Spots remaining
const spotsRemaining = computed(() => {
  return props.activity.capacity - props.activity.enrolled
})

// Skill level badge color
const skillLevelColor = computed(() => {
  const colors = {
    'Beginner': 'bg-green-100 text-green-800',
    'Intermediate': 'bg-amber-100 text-amber-800',
    'Advanced': 'bg-red-100 text-red-800'
  }
  return colors[props.activity.skillLevel] || 'bg-stone-100 text-stone-800'
})
</script>

<template>
  <Card :hoverable="true" :micro-break="microBreak" variant="default">
    <!-- Header -->
    <div class="mb-4">
      <div class="flex items-start justify-between gap-3 mb-2">
        <div class="flex-1">
          <h3 class="text-2xl font-semibold text-stone-950 leading-tight mb-2">
            {{ activity.title }}
          </h3>
        </div>
        <span :class="skillLevelColor"
              class="px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap">
          {{ activity.skillLevel }}
        </span>
      </div>

      <!-- Instructor -->
      <div class="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
        <div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
          {{ activity.instructor.name.charAt(0) }}
        </div>
        <div>
          <p class="text-sm font-semibold text-stone-900">{{ activity.instructor.name }}</p>
          <p class="text-xs text-stone-600">{{ activity.instructor.title }} at {{ activity.instructor.company }}</p>
        </div>
      </div>
    </div>

    <!-- Description -->
    <p class="text-stone-700 leading-relaxed mb-4">
      {{ activity.description }}
    </p>

    <!-- Workshop Details -->
    <div class="space-y-3 mb-4">
      <!-- Date & Duration -->
      <div class="text-sm text-stone-600 space-y-1">
        <div class="flex items-center gap-2">
          <span class="text-stone-400">📅</span>
          <span>{{ formattedDate }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-stone-400">⏱️</span>
          <span>{{ activity.duration }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-stone-400">📍</span>
          <span>{{ activity.location }}</span>
        </div>
      </div>

      <!-- Prerequisites -->
      <div>
        <p class="text-sm font-medium text-stone-900 mb-1.5">Prerequisites:</p>
        <ul class="space-y-1">
          <li v-for="prereq in activity.prerequisites"
              :key="prereq"
              class="text-sm text-stone-700 flex items-start gap-2">
            <span class="text-amber-600">•</span>
            <span>{{ prereq }}</span>
          </li>
        </ul>
      </div>

      <!-- Learning Outcomes -->
      <div>
        <p class="text-sm font-medium text-stone-900 mb-1.5">What you'll learn:</p>
        <ul class="space-y-1">
          <li v-for="outcome in activity.learningOutcomes.slice(0, 3)"
              :key="outcome"
              class="text-sm text-stone-700 flex items-start gap-2">
            <span class="text-green-600">✓</span>
            <span>{{ outcome }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Features -->
    <div class="flex flex-wrap gap-2 mb-4">
      <span v-if="activity.interactive"
            class="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md">
        🖱️ Interactive
      </span>
      <span v-if="activity.certificate"
            class="px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-md">
        🎓 Certificate
      </span>
      <span class="px-2.5 py-1 text-xs font-medium bg-stone-100 text-stone-700 rounded-md">
        📦 Materials Included
      </span>
    </div>

    <!-- Capacity Progress Bar -->
    <div class="mb-4">
      <div class="flex items-center justify-between text-sm mb-2">
        <span class="font-medium text-stone-900">Enrollment</span>
        <span class="text-stone-600">{{ activity.enrolled }}/{{ activity.capacity }} enrolled</span>
      </div>
      <div class="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-500"
             :style="{ width: `${enrollmentPercentage}%` }">
        </div>
      </div>
      <p v-if="spotsRemaining > 0 && spotsRemaining <= 10"
         class="text-xs text-amber-700 font-medium mt-1">
        ⚠️ Only {{ spotsRemaining }} spots remaining!
      </p>
    </div>

    <!-- Footer -->
    <div class="pt-4 border-t border-stone-200">
      <BaseButton variant="primary"
                  size="md"
                  class="w-full"
                  :disabled="spotsRemaining === 0">
        {{ spotsRemaining > 0 ? 'Register Now →' : 'Fully Booked' }}
      </BaseButton>
    </div>
  </Card>
</template>

<style scoped>
/* Additional styles if needed */
</style>
