<script setup>
import Navbar from "./components/Navbar.vue"
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar (fixed) -->
    <Navbar />

    <!-- Main content area with top padding for fixed navbar -->
    <main class="flex-1 pt-16">
      <router-view v-slot="{ Component, route }">
        <transition
          name="page"
          mode="out-in"
        >
          <div :key="route.path" class="animate-fade-in">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </main>

    <!-- Footer with asymmetric left alignment (breaks convention) -->
    <footer class="border-t border-stone-200 mt-16">
      <div class="max-w-8xl mx-auto px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <!-- Left-aligned content (breaking traditional center alignment) -->
          <div class="text-sm text-stone-600 space-y-1">
            <p class="font-medium text-stone-900">Aiman Rahim</p>
            <p>Bouw met intentie, breek de ketens.</p>
          </div>

          <!-- Right side - Links and copyright -->
          <div class="flex flex-col md:items-end gap-2">
            <div class="flex gap-4 text-sm">
              <a href="https://github.com/PlashSpeed-Aiman" target="_blank" rel="noopener" class="text-stone-600 hover:text-amber-600 transition-colors duration-200">
                GitHub
              </a>
              <a href="https://linkedin.com/in/aiman-rahim-grad-eng-4267091a3" target="_blank" rel="noopener" class="text-stone-600 hover:text-amber-600 transition-colors duration-200">
                LinkedIn
              </a>
            </div>
            <p class="text-xs text-stone-500">
              © 2025 Aiman Rahim. Met opzet vormgegeven.
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Page transition animations */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
