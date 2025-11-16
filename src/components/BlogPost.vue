<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import contentProvider from '../services/contentProvider'
import Card from './base/Card.vue'

const route = useRoute()
const post = ref(null)
const isLoading = ref(true)
const error = ref(null)

const formattedDate = computed(() => {
  if (!post.value) return ''
  const date = new Date(post.value.date)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

onMounted(async () => {
  try {
    isLoading.value = true
    error.value = null

    const slug = route.params.slug
    const postData = await contentProvider.getPost(slug)

    if (!postData) {
      error.value = 'Post not found'
    } else {
      post.value = postData
    }
  } catch (err) {
    console.error('Error loading blog post:', err)
    error.value = 'Failed to load blog post. Please try again later.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Loading State -->
    <div v-if="isLoading" class="max-w-4xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
      <div class="animate-pulse space-y-8">
        <div class="h-12 bg-stone-200 rounded w-3/4"></div>
        <div class="h-6 bg-stone-200 rounded w-1/2"></div>
        <div class="h-64 bg-stone-200 rounded"></div>
        <div class="space-y-3">
          <div class="h-4 bg-stone-200 rounded"></div>
          <div class="h-4 bg-stone-200 rounded"></div>
          <div class="h-4 bg-stone-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
      <div class="text-center py-16">
        <div class="glass rounded-lg p-8 max-w-md mx-auto">
          <svg class="w-16 h-16 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-lg font-medium text-stone-950 mb-2">{{ error }}</p>
          <RouterLink
            to="/blog"
            class="inline-flex items-center gap-2 px-6 py-3 mt-6 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-500 hover:-translate-y-0.5 transition-all duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Blog
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Post Content -->
    <article v-else-if="post" class="pb-16">
      <!-- Cover Image (if exists) -->
      <div v-if="post.coverImage" class="relative h-96 mb-12 overflow-hidden">
        <img
          :src="post.coverImage"
          :alt="post.title"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent"></div>
      </div>

      <!-- Content Container -->
      <div class="max-w-4xl mx-auto px-6 lg:px-8">
        <!-- Back Navigation -->
        <RouterLink
          to="/blog"
          class="inline-flex items-center gap-2 text-stone-600 hover:text-amber-600 transition-colors duration-200 mb-8"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back to all posts
        </RouterLink>

        <!-- Asymmetric Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <!-- Sidebar - 4 cols -->
          <div class="lg:col-span-4 space-y-6">
            <!-- Metadata Card -->
            <Card :hoverable="false" variant="bordered" class="sticky top-24">
              <div class="space-y-4">
                <div>
                  <h3 class="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Published</h3>
                  <time :datetime="post.date" class="text-stone-950 font-medium">{{ formattedDate }}</time>
                </div>

                <div v-if="post.author" class="h-px bg-stone-200"></div>

                <div v-if="post.author">
                  <h3 class="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Author</h3>
                  <p class="text-stone-950 font-medium">{{ post.author }}</p>
                </div>

                <div v-if="post.tags && post.tags.length > 0" class="h-px bg-stone-200"></div>

                <div v-if="post.tags && post.tags.length > 0">
                  <h3 class="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">Tags</h3>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tag in post.tags"
                      :key="tag"
                      class="px-3 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <!-- Main Content - 8 cols -->
          <div class="lg:col-span-8">
            <!-- Title with micro-break -->
            <div class="mb-8" style="transform: rotate(-0.3deg);">
              <h1 class="text-4xl lg:text-5xl font-bold text-stone-950 leading-tight tracking-tight mb-4">
                {{ post.title }}
              </h1>
              <p v-if="post.excerpt" class="text-xl text-stone-600 leading-relaxed">
                {{ post.excerpt }}
              </p>
            </div>

            <!-- Divider -->
            <div class="h-px bg-gradient-to-r from-stone-200 via-amber-600/30 to-stone-200 mb-8" style="width: 90%; margin-left: 5%;"></div>

            <!-- Post Content -->
            <div
              class="prose prose-lg prose-stone max-w-none
                     prose-headings:font-semibold prose-headings:tracking-tight
                     prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                     prose-p:text-stone-700 prose-p:leading-relaxed
                     prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline
                     prose-strong:text-stone-950 prose-strong:font-semibold
                     prose-code:text-amber-600 prose-code:bg-amber-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                     prose-pre:bg-stone-950 prose-pre:text-stone-50
                     prose-img:rounded-lg prose-img:shadow-lg
                     prose-blockquote:border-l-4 prose-blockquote:border-amber-600 prose-blockquote:bg-amber-50/50 prose-blockquote:pl-6 prose-blockquote:py-1"
              v-html="post.content"
            ></div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
/* Custom prose styles are already handled via Tailwind prose plugin */
</style>
