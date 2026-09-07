<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Clock from "./Clock.vue"

const route = useRoute()
const dropDownOpen = ref(false)
const dropDownOpenUtil = ref(false)
const dropDownRef = ref(null)
const dropDownRefUtil = ref(null)
const isScrolled = ref(false)

const toggleDropdown = () => {
  dropDownOpen.value = !dropDownOpen.value
  if (dropDownOpen.value) dropDownOpenUtil.value = false
}

const toggleDropdownUtil = () => {
  dropDownOpenUtil.value = !dropDownOpenUtil.value
  if (dropDownOpenUtil.value) dropDownOpen.value = false
}

const isActive = (path) => {
  return route.path === path
}

onMounted(() => {
  // Click outside handler
  document.addEventListener("click", (e) => {
    if(e.target === dropDownRefUtil.value || e.target.parentNode === dropDownRefUtil.value) {
      dropDownOpen.value = false
      return
    }
    if(e.target === dropDownRef.value || e.target.parentNode === dropDownRef.value) {
      dropDownOpenUtil.value = false
      return
    }

    dropDownOpen.value = false
    dropDownOpenUtil.value = false
  })

  // Scroll handler for glass effect
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 20
  }
  window.addEventListener('scroll', handleScroll)
})

const navClasses = computed(() => {
  return isScrolled.value
    ? 'glass shadow-lg'
    : 'bg-white/60 backdrop-blur-md border-b border-stone-200/30'
})
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
    <div :class="`${navClasses}`">
      <div class="max-w-8xl mx-auto px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo with micro-offset (8px to the right) -->
          <RouterLink
            to="/"
            class="font-semibold text-xl text-stone-950 hover:text-amber-600 transition-colors duration-200 tracking-tight"
            style="margin-left: 8px;"
          >
            Aiman Rahim
          </RouterLink>

          <!-- Navigation Links -->
          <nav class="hidden md:flex items-center space-x-1">
            <RouterLink
              to="/"
              :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group',
                isActive('/')
                  ? 'text-amber-600'
                  : 'text-stone-700 hover:text-stone-950'
              ]"
            >
              About
              <span
                v-if="isActive('/')"
                class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-amber-600 rounded-full"
              />
              <span
                v-else
                class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-amber-600 rounded-full group-hover:w-1/2 transition-all duration-300"
              />
            </RouterLink>

            <RouterLink
              to="/blog"
              :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group',
                isActive('/blog') || route.path.startsWith('/blog/')
                  ? 'text-amber-600'
                  : 'text-stone-700 hover:text-stone-950'
              ]"
            >
              Blog
              <span
                v-if="isActive('/blog') || route.path.startsWith('/blog/')"
                class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-amber-600 rounded-full"
              />
              <span
                v-else
                class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-amber-600 rounded-full group-hover:w-1/2 transition-all duration-300"
              />
            </RouterLink>

            <RouterLink
              to="/lib-dir"
              :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group',
                isActive('/lib-dir')
                  ? 'text-amber-600'
                  : 'text-stone-700 hover:text-stone-950'
              ]"
            >
              Lib Dir
              <span
                v-if="isActive('/lib-dir')"
                class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-amber-600 rounded-full"
              />
              <span
                v-else
                class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-amber-600 rounded-full group-hover:w-1/2 transition-all duration-300"
              />
            </RouterLink>

            <!-- Gerakan Dropdown -->
            <div class="relative">
              <button
                ref="dropDownRef"
                @click="toggleDropdown"
                class="px-4 py-2 rounded-md text-sm font-medium text-stone-700 hover:text-stone-950 inline-flex items-center transition-colors duration-200"
              >
                Gerakan
                <svg
                  :class="['ml-1 h-4 w-4 transition-transform duration-200', dropDownOpen ? 'rotate-180' : '']"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M6 8l4 4 4-4"/>
                </svg>
              </button>

              <transition name="dropdown">
                <div
                  v-if="dropDownOpen"
                  class="absolute top-full mt-2 left-0 min-w-[200px] glass rounded-lg shadow-xl py-2 animate-slide-up"
                >
                  <RouterLink
                    to="/gerakan"
                    class="block px-4 py-2.5 text-sm text-stone-700 hover:text-amber-600 hover:bg-amber-50/50 transition-all duration-150 hover:translate-x-1"
                  >
                    About
                  </RouterLink>
                  <RouterLink
                    to="/activities"
                    class="block px-4 py-2.5 text-sm text-stone-700 hover:text-amber-600 hover:bg-amber-50/50 transition-all duration-150 hover:translate-x-1"
                  >
                    Activities
                  </RouterLink>
                  <RouterLink
                    to="/lambda"
                    class="block px-4 py-2.5 text-sm text-stone-700 hover:text-amber-600 hover:bg-amber-50/50 transition-all duration-150 hover:translate-x-1"
                  >
                    Lambda
                  </RouterLink>
                  <RouterLink
                    to="/projects"
                    class="block px-4 py-2.5 text-sm text-stone-700 hover:text-amber-600 hover:bg-amber-50/50 transition-all duration-150 hover:translate-x-1"
                  >
                    Projects
                  </RouterLink>
                </div>
              </transition>
            </div>

            <!-- Utilities Dropdown -->
            <div class="relative">
              <button
                ref="dropDownRefUtil"
                @click="toggleDropdownUtil"
                class="px-4 py-2 rounded-md text-sm font-medium text-stone-700 hover:text-stone-950 inline-flex items-center transition-colors duration-200"
              >
                Utilities
                <svg
                  :class="['ml-1 h-4 w-4 transition-transform duration-200', dropDownOpenUtil ? 'rotate-180' : '']"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M6 8l4 4 4-4"/>
                </svg>
              </button>

              <transition name="dropdown">
                <div
                  v-if="dropDownOpenUtil"
                  class="absolute top-full mt-2 left-0 min-w-[200px] glass rounded-lg shadow-xl py-2 animate-slide-up"
                >
                  <RouterLink
                    to="/whatsapp-tool"
                    class="block px-4 py-2.5 text-sm text-stone-700 hover:text-amber-600 hover:bg-amber-50/50 transition-all duration-150 hover:translate-x-1"
                  >
                    WhatsApp Tool
                  </RouterLink>
                  <RouterLink
                    to="/qr"
                    class="block px-4 py-2.5 text-sm text-stone-700 hover:text-amber-600 hover:bg-amber-50/50 transition-all duration-150 hover:translate-x-1"
                  >
                    QR Generator
                  </RouterLink>
                </div>
              </transition>
            </div>
          </nav>

          <!-- Clock - intentionally offset -->
          <div style="margin-right: 8px;">
            <Clock />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>