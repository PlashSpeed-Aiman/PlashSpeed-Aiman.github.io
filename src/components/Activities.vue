<script setup>
import { ref, computed, onMounted } from 'vue'
import { activities, activityTypes } from '../data/activities.js'
import MeetupCard from './activities/MeetupCard.vue'
import HackathonCard from './activities/HackathonCard.vue'
import WorkshopCard from './activities/WorkshopCard.vue'
import AlumniTalkCard from './activities/AlumniTalkCard.vue'
import BaseButton from './base/BaseButton.vue'

// State
const allActivities = ref([])
const isLoading = ref(true)

// Load activities
onMounted(() => {
  // Simulate loading state for consistent UX
  setTimeout(() => {
    allActivities.value = activities
    isLoading.value = false
  }, 300)
})

// Computed: Upcoming activities count
const upcomingCount = computed(() => {
  return allActivities.value.filter(a => a.status === 'upcoming').length
})

// Computed: Total participants (sum of registered/attendees)
const totalParticipants = computed(() => {
  return allActivities.value.reduce((sum, activity) => {
    return sum + (activity.attendeeCount || activity.registered || activity.enrolled || 0)
  }, 0)
})

// Get component for activity type
function getActivityComponent(type) {
  const components = {
    'meetup': MeetupCard,
    'hackathon': HackathonCard,
    'workshop': WorkshopCard,
    'alumni-talk': AlumniTalkCard
  }
  return components[type] || MeetupCard
}
</script>

<template>
  <div class="max-w-8xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
    <!-- Hero Section - Asymmetric 4/8 Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16">
      <!-- Left: Stats Card (4 cols) -->
      <div class="lg:col-span-4">
        <div class="glass p-6 rounded-2xl border border-stone-200/50 sticky top-24">
          <h2 class="text-xl font-semibold text-stone-950 mb-4">
            TEST PAGE. FAKE<< DATA
          </h2>

          <div class="space-y-4">
            <!-- Total Activities -->
            <div class="p-4 bg-white/60 rounded-xl">
              <div class="text-4xl font-bold text-stone-950 mb-1">
                {{ allActivities.length }}
              </div>
              <div class="text-sm text-stone-600">Active Programs</div>
            </div>

            <!-- Upcoming -->
            <div class="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <div class="text-4xl font-bold text-amber-700 mb-1">
                {{ upcomingCount }}
              </div>
              <div class="text-sm text-stone-700">Upcoming Events</div>
            </div>

            <!-- Participants -->
            <div class="p-4 bg-white/60 rounded-xl">
              <div class="text-4xl font-bold text-stone-950 mb-1">
                {{ totalParticipants }}+
              </div>
              <div class="text-sm text-stone-600">Active Participants</div>
            </div>
          </div>

          <!-- CTA -->
          <div class="mt-6 pt-6 border-t border-stone-200">
            <BaseButton variant="primary" class="w-full" size="md">
              Join Our Community
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Right: Hero Title (8 cols) -->
      <div class="lg:col-span-8">
        <!-- Main title with micro-break -->
        <div style="transform: rotate(-0.5deg);">
          <h1 class="text-5xl lg:text-6xl font-bold text-stone-950 leading-tight mb-6">
            Grow Together Through
            <span class="text-gradient-warm block mt-2">DeTA Activities</span>
          </h1>
        </div>

        <p class="text-xl text-stone-700 leading-relaxed mb-8 max-w-3xl">
          Join our community of learners, builders, and innovators. From monthly meetups
          to intensive hackathons, we create opportunities for you to grow your skills,
          expand your network, and make an impact.
        </p>

        <!-- Quick Stats Pills -->
        <div class="flex flex-wrap gap-3">
          <div class="px-4 py-2 bg-stone-100 rounded-lg text-sm font-medium text-stone-700">
            🎯 Hands-on Learning
          </div>
          <div class="px-4 py-2 bg-stone-100 rounded-lg text-sm font-medium text-stone-700">
            🤝 Networking Opportunities
          </div>
          <div class="px-4 py-2 bg-stone-100 rounded-lg text-sm font-medium text-stone-700">
            🏆 Competitions & Prizes
          </div>
          <div class="px-4 py-2 bg-stone-100 rounded-lg text-sm font-medium text-stone-700">
            💼 Career Insights
          </div>
        </div>
      </div>
    </div>

    <!-- Asymmetric Divider -->
    <div class="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent mb-16"
         style="width: 85%; margin-left: 8%;"></div>

    <!-- Loading State -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 4" :key="i"
           class="h-96 bg-stone-200 rounded-2xl animate-pulse"></div>
    </div>

    <!-- Activities Grid -->
    <div v-else>
      <!-- Section Title -->
      <div class="mb-8">
        <h2 class="text-4xl font-semibold text-stone-950 mb-3">
          Current Activities
        </h2>
        <p class="text-lg text-stone-600">
          Explore our diverse range of community-driven learning experiences
        </p>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <component
          v-for="(activity, index) in allActivities"
          :key="activity.id"
          :is="getActivityComponent(activity.type)"
          :activity="activity"
          :micro-break="index === 2"
          :class="index === 3 ? 'md:col-span-2' : ''"
          class="animate-slide-up"
          :style="{ animationDelay: `${index * 100}ms` }">
        </component>
      </div>

      <!-- Activity Types Section -->
      <div class="mt-24">
        <!-- Asymmetric Divider -->
        <div class="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent mb-16"
             style="width: 85%; margin-left: 8%;"></div>

        <h2 class="text-4xl font-semibold text-stone-950 mb-12 text-center">
          What We Offer
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="(meta, key) in activityTypes"
               :key="key"
               class="p-6 bg-white rounded-2xl border-2 border-stone-200 hover:border-amber-600 hover:shadow-lg transition-all duration-300"
               style="animation: fadeIn 0.6s ease-out;">
            <div class="text-4xl mb-4">{{ meta.icon }}</div>
            <h3 class="text-2xl font-semibold text-stone-950 mb-3">
              {{ meta.name }}
            </h3>
            <p class="text-stone-700 leading-relaxed">
              {{ meta.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="mt-24 text-center">
        <div class="max-w-3xl mx-auto p-12 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 rounded-3xl border-2 border-amber-200"
             style="transform: rotate(-0.3deg);">
          <h2 class="text-4xl font-bold text-stone-950 mb-4">
            Ready to Get Involved?
          </h2>
          <p class="text-lg text-stone-700 mb-8">
            Join DeTA today and be part of a thriving community of developers committed to learning and growing together.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <BaseButton variant="primary" size="lg">
              Join Community
            </BaseButton>
            <BaseButton variant="secondary" size="lg">
              Suggest Activity
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Text gradient utility */
.text-gradient-warm {
  background: linear-gradient(135deg, #d97706 0%, #9a3412 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Glass morphism utility */
.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

/* Slide up animation */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out;
}

/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>