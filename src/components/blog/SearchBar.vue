<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  tags: {
    type: Array,
    default: () => []
  },
  selectedTag: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['search', 'tag-selected'])

const searchQuery = ref('')
const showTagDropdown = ref(false)
let debounceTimer = null

// Debounced search
watch(searchQuery, (newValue) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('search', newValue)
  }, 300)
})

const selectTag = (tag) => {
  emit('tag-selected', tag)
  showTagDropdown.value = false
}

const clearTag = () => {
  emit('tag-selected', null)
}
</script>

<template>
  <div class="space-y-4">
    <!-- Search Input -->
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg class="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search posts..."
        class="w-full pl-12 pr-6 py-3 rounded-lg border-2 border-stone-300 bg-white text-stone-950 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all duration-200"
      />
    </div>

    <!-- Tag Filter -->
    <div class="flex items-center gap-3 flex-wrap">
      <span class="text-sm font-medium text-stone-600">Filter by tag:</span>

      <!-- Selected tag chip -->
      <button
        v-if="selectedTag"
        @click="clearTag"
        class="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-full text-sm font-medium hover:bg-amber-500 transition-colors duration-200"
      >
        {{ selectedTag }}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <!-- Tag dropdown -->
      <div v-else class="relative">
        <button
          @click="showTagDropdown = !showTagDropdown"
          class="inline-flex items-center gap-2 px-4 py-2 border-2 border-stone-300 rounded-full text-sm font-medium text-stone-700 hover:border-amber-600 hover:text-amber-600 transition-colors duration-200"
        >
          All tags
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        <!-- Dropdown menu -->
        <transition name="dropdown">
          <div
            v-if="showTagDropdown"
            class="absolute top-full left-0 mt-2 w-64 glass rounded-lg shadow-lg py-2 z-10 max-h-64 overflow-y-auto"
          >
            <button
              v-for="tag in tags"
              :key="tag"
              @click="selectTag(tag)"
              class="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-150"
            >
              {{ tag }}
            </button>
            <div v-if="tags.length === 0" class="px-4 py-2 text-sm text-stone-400 italic">
              No tags available
            </div>
          </div>
        </transition>
      </div>

      <!-- Clear all filters -->
      <button
        v-if="searchQuery || selectedTag"
        @click="searchQuery = ''; clearTag()"
        class="text-sm text-stone-500 hover:text-amber-600 underline transition-colors duration-200"
      >
        Clear all filters
      </button>
    </div>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
