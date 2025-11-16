<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Card from '../base/Card.vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  microBreak: {
    type: Boolean,
    default: false
  }
})

const formattedDate = computed(() => {
  const date = new Date(props.post.date)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>

<template>
  <RouterLink :to="`/blog/${post.slug}`" class="block group">
    <Card :hoverable="true" :micro-break="microBreak" class="h-full flex flex-col">
      <!-- Cover Image -->
      <div v-if="post.coverImage" class="relative overflow-hidden rounded-t-lg -m-6 mb-4">
        <img
          :src="post.coverImage"
          :alt="post.title"
          class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      <!-- Content -->
      <div class="flex-1 flex flex-col space-y-3">
        <!-- Title -->
        <h3 class="text-2xl font-semibold text-stone-950 group-hover:text-gradient-warm transition-all duration-200">
          {{ post.title }}
        </h3>

        <!-- Meta info -->
        <div class="flex items-center gap-3 text-sm text-stone-500">
          <time :datetime="post.date">{{ formattedDate }}</time>
          <span v-if="post.author" class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            {{ post.author }}
          </span>
        </div>

        <!-- Excerpt -->
        <p class="text-stone-600 leading-relaxed flex-1">
          {{ post.excerpt }}
        </p>

        <!-- Tags -->
        <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 pt-2">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="px-3 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition-colors duration-200"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Read more link -->
        <div class="pt-2">
          <span class="inline-flex items-center gap-2 text-amber-600 font-medium text-sm group-hover:gap-3 transition-all duration-200">
            Read more
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </span>
        </div>
      </div>
    </Card>
  </RouterLink>
</template>

<style scoped>
.text-gradient-warm {
  background: linear-gradient(to right, #d97706, #9a3412);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
