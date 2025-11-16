<script setup>
import { ref } from 'vue'
import Card from './base/Card.vue'

const stats = ref([
  { label: 'Active Members', value: '40+' },
  { label: 'Years Active', value: '3+' },
  { label: 'Projects Built', value: '10+' }
])

const benefits = ref([
  {
    id: 1,
    title: 'Learn from Peers',
    description: 'Work alongside talented developers, both students and alumni, who share their knowledge and experience.',
    icon: 'academic'
  },
  {
    id: 2,
    title: 'Build Real Projects',
    description: 'Gain hands-on experience by contributing to meaningful projects that serve the Muslim ummah.',
    icon: 'code'
  },
  {
    id: 3,
    title: 'Career Growth',
    description: 'Become more desirable in the IT market through continuous learning and professional development.',
    icon: 'chart'
  },
  {
    id: 4,
    title: 'Make an Impact',
    description: 'Use technology as a force for good and contribute to the betterment of the community.',
    icon: 'heart'
  }
])
</script>

<template>
  <div class="max-w-8xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
    <!-- Hero Section with Asymmetric Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16">
      <!-- Left Column - Stats Card (4 cols) -->
      <div class="lg:col-span-4 space-y-6 animate-slide-in-right">
        <Card :hoverable="false" variant="bordered" class="micro-break">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-stone-600 mb-4">Community Stats</h3>
          <div class="space-y-4">
            <div v-for="stat in stats" :key="stat.label" class="border-l-4 border-amber-600 pl-4">
              <div class="text-3xl font-bold text-stone-950">{{ stat.value }}</div>
              <div class="text-sm text-stone-600 mt-1">{{ stat.label }}</div>
            </div>
          </div>
        </Card>

        <!-- Join CTA -->
        <Card :hoverable="true" variant="default" padding="md">
          <h3 class="text-lg font-semibold text-stone-950 mb-2">Ready to Join?</h3>
          <p class="text-sm text-stone-600 mb-4">Be part of a growing community making a difference through technology.</p>
          <a
              target="_blank"
              href="https://detacommunity.com/"
            class="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-500 hover:-translate-y-0.5 transition-all duration-200 text-sm"
          >
            Get Involved
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
        </Card>
      </div>

      <!-- Right Column - Main Content (8 cols) -->
      <div class="lg:col-span-8 space-y-8">
        <!-- Hero Title with Micro-break -->
        <div class="space-y-6" style="transform: rotate(-0.5deg);">
          <h1 class="text-5xl lg:text-6xl font-bold text-stone-950 leading-tight tracking-tight">
            Gerakan Developer <span class="text-gradient-warm">Tanah Air</span>
          </h1>
          <p class="text-xl text-stone-700 leading-relaxed">
            Also known as <span class="font-semibold text-amber-600">DeTA</span> - a community of developers in IIUM fostering a developer and hacker culture.
          </p>
        </div>

        <!-- Divider with intentional offset -->
        <div class="h-px bg-gradient-to-r from-stone-200 via-amber-600/30 to-stone-200" style="width: 85%; margin-left: 8%;"></div>

        <!-- About Section -->
        <div class="space-y-6">
          <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-stone-950">Our Vision</h2>
            <p class="text-lg text-stone-700 leading-relaxed">
              We create a community of developers that contribute to the Muslim ummah through technology. We believe technology can be a force for good, and we harness that power to help the ummah.
            </p>
          </div>

          <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-stone-950">Our Mission</h2>
            <p class="text-lg text-stone-700 leading-relaxed">
              Through our initiatives, our community members become more knowledgeable in technology and desirable in the IT market. We believe IIUM alumni and students are excellent agents of change, and we help them become the best they can be.
            </p>
          </div>

          <div class="glass rounded-lg p-6">
            <div class="flex gap-3">
              <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <div>
                <p class="font-medium text-stone-950">Growing Community</p>
                <p class="text-sm text-stone-600 mt-1">Our numbers are growing and we're always looking for new members. If you're interested in technology and want to make a difference, come join us!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Why Join Us Section -->
    <div class="space-y-8">
      <div class="text-center space-y-4">
        <h2 class="text-4xl font-bold text-stone-950 tracking-tight">
          Why <span class="text-gradient-warm">Join Us</span>
        </h2>
        <p class="text-lg text-stone-600 max-w-2xl mx-auto">
          We strive to leave an impact on the world through technology
        </p>
      </div>

      <!-- Benefits Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          v-for="(benefit, index) in benefits"
          :key="benefit.id"
          :hoverable="true"
          :micro-break="index === 2"
          :class="index === 3 ? 'md:col-span-2' : ''"
          class="group"
        >
          <div class="space-y-4">
            <!-- Icon -->
            <div class="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors duration-200">
              <!-- Academic Cap Icon -->
              <svg v-if="benefit.icon === 'academic'" class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
              </svg>
              <!-- Code Icon -->
              <svg v-else-if="benefit.icon === 'code'" class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
              </svg>
              <!-- Chart Icon -->
              <svg v-else-if="benefit.icon === 'chart'" class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
              <!-- Heart Icon -->
              <svg v-else-if="benefit.icon === 'heart'" class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>

            <!-- Content -->
            <div>
              <h3 class="text-xl font-semibold text-stone-950 mb-2 group-hover:text-amber-600 transition-colors duration-200">
                {{ benefit.title }}
              </h3>
              <p class="text-stone-600 leading-relaxed">
                {{ benefit.description }}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.micro-break {
  transform: rotate(0.3deg);
}
</style>