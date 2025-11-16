<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['page-change'])

const pageNumbers = computed(() => {
  const pages = []
  const delta = 2 // Number of pages to show on each side of current page

  for (let i = 1; i <= props.totalPages; i++) {
    if (
      i === 1 ||
      i === props.totalPages ||
      (i >= props.currentPage - delta && i <= props.currentPage + delta)
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return pages
})

const goToPage = (page) => {
  if (page !== '...' && page !== props.currentPage) {
    emit('page-change', page)
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const previousPage = () => {
  if (props.currentPage > 1) {
    goToPage(props.currentPage - 1)
  }
}

const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    goToPage(props.currentPage + 1)
  }
}
</script>

<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-12">
    <!-- Previous button -->
    <button
      @click="previousPage"
      :disabled="currentPage === 1"
      :class="[
        'px-4 py-2 rounded-lg font-medium transition-all duration-200',
        currentPage === 1
          ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
          : 'bg-white border-2 border-stone-300 text-stone-700 hover:border-amber-600 hover:text-amber-600 hover:-translate-y-0.5'
      ]"
    >
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Previous
      </div>
    </button>

    <!-- Page numbers -->
    <div class="flex items-center gap-2">
      <button
        v-for="(page, index) in pageNumbers"
        :key="index"
        @click="goToPage(page)"
        :class="[
          'min-w-[40px] h-10 rounded-lg font-medium transition-all duration-200',
          page === currentPage
            ? 'bg-amber-600 text-white shadow-md hover:bg-amber-500'
            : page === '...'
            ? 'text-stone-400 cursor-default'
            : 'bg-white border-2 border-stone-300 text-stone-700 hover:border-amber-600 hover:text-amber-600 hover:-translate-y-0.5'
        ]"
        :disabled="page === '...'"
      >
        {{ page }}
      </button>
    </div>

    <!-- Next button -->
    <button
      @click="nextPage"
      :disabled="currentPage === totalPages"
      :class="[
        'px-4 py-2 rounded-lg font-medium transition-all duration-200',
        currentPage === totalPages
          ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
          : 'bg-white border-2 border-stone-300 text-stone-700 hover:border-amber-600 hover:text-amber-600 hover:-translate-y-0.5'
      ]"
    >
      <div class="flex items-center gap-2">
        Next
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </div>
    </button>
  </div>
</template>

<style scoped>
button:disabled {
  pointer-events: none;
}
</style>
