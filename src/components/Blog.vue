<script setup>
import { ref, computed, onMounted } from 'vue'
import contentProvider from '../services/contentProvider'
import blogConfig from '../services/blogConfig'
import PostCard from './blog/PostCard.vue'
import SearchBar from './blog/SearchBar.vue'
import Pagination from './blog/Pagination.vue'

// State
const allPosts = ref([])
const tags = ref([])
const isLoading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const selectedTag = ref(null)
const currentPage = ref(1)

// Computed
const filteredPosts = computed(() => {
  let posts = allPosts.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    posts = posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query)
    )
  }

  // Filter by tag
  if (selectedTag.value) {
    posts = posts.filter(post => post.tags.includes(selectedTag.value))
  }

  return posts
})

const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / blogConfig.postsPerPage)
})

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * blogConfig.postsPerPage
  const end = start + blogConfig.postsPerPage
  return filteredPosts.value.slice(start, end)
})

// Methods
const handleSearch = (query) => {
  searchQuery.value = query
  currentPage.value = 1 // Reset to first page on search
}

const handleTagSelected = (tag) => {
  selectedTag.value = tag
  currentPage.value = 1 // Reset to first page on tag filter
}

const handlePageChange = (page) => {
  currentPage.value = page
}

// Lifecycle
onMounted(async () => {
  try {
    isLoading.value = true
    error.value = null

    // Fetch posts and tags in parallel
    const [postsData, tagsData] = await Promise.all([
      contentProvider.getPosts(),
      contentProvider.getTags()
    ])

    allPosts.value = postsData
    tags.value = tagsData
  } catch (err) {
    console.error('Error loading blog posts:', err)
    error.value = 'Failed to load blog posts. Please try again later.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="max-w-8xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
    <!-- Hero Section -->
    <div class="text-center space-y-6 mb-16">
      <div style="transform: rotate(-0.3deg);">
        <h1 class="text-5xl lg:text-6xl font-bold text-stone-950 leading-tight tracking-tight">
          Thoughts & <span class="text-gradient-warm">Writings</span>
        </h1>
      </div>
      <p class="text-xl text-stone-600 max-w-2xl mx-auto">
        Insights on software development, technology, and building meaningful solutions
      </p>

      <!-- Divider with intentional offset -->
      <div class="flex justify-center pt-8">
        <div class="h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" style="width: 60%;"></div>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="mb-12">
      <SearchBar
        :tags="tags"
        :selected-tag="selectedTag"
        @search="handleSearch"
        @tag-selected="handleTagSelected"
      />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="i in 6"
        :key="i"
        class="bg-white rounded-lg border border-stone-200 p-6 animate-pulse"
      >
        <div class="h-48 bg-stone-200 rounded mb-4"></div>
        <div class="h-6 bg-stone-200 rounded w-3/4 mb-3"></div>
        <div class="h-4 bg-stone-200 rounded w-1/2 mb-4"></div>
        <div class="space-y-2">
          <div class="h-3 bg-stone-200 rounded"></div>
          <div class="h-3 bg-stone-200 rounded"></div>
          <div class="h-3 bg-stone-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-16">
      <div class="glass rounded-lg p-8 max-w-md mx-auto">
        <svg class="w-16 h-16 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-lg font-medium text-stone-950 mb-2">Oops! Something went wrong</p>
        <p class="text-stone-600">{{ error }}</p>
      </div>
    </div>

    <!-- Posts Grid -->
    <div v-else-if="paginatedPosts.length > 0" class="space-y-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PostCard
          v-for="(post, index) in paginatedPosts"
          :key="post.slug"
          :post="post"
          :micro-break="index === 2"
          :class="index === 3 ? 'md:col-span-2' : ''"
        />
      </div>

      <!-- Pagination -->
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="handlePageChange"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <svg class="w-24 h-24 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <h3 class="text-2xl font-semibold text-stone-950 mb-2">No posts found</h3>
      <p class="text-stone-600 mb-6">
        {{ searchQuery || selectedTag ? 'Try adjusting your filters' : 'Check back later for new content' }}
      </p>
      <button
        v-if="searchQuery || selectedTag"
        @click="searchQuery = ''; selectedTag = null"
        class="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-500 hover:-translate-y-0.5 transition-all duration-200"
      >
        Clear filters
      </button>
    </div>
  </div>
</template>

<style scoped>
.text-gradient-warm {
  background: linear-gradient(to right, #d97706, #9a3412);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
