<script setup>
import {onMounted, ref} from 'vue'
import Clock from "./Clock.vue";

const dropDownOpen = ref(false)
const dropDownOpenUtil = ref(false)
const dropDownRef = ref(null)
const dropDownRefUtil = ref(null)

const toggleDropdown = () => {
  dropDownOpen.value = !dropDownOpen.value
}
const toggleDropdownUtil = () => {
  dropDownOpenUtil.value = !dropDownOpenUtil.value
}

const clickOutsideDropdown = (e) => {
  if (dropDownRef.value && !dropDownRef.value.contains(e.target)) {
    dropDownOpen.value = false
  }
}
const clickOutsideDropdownUtil = (e) => {
  if (dropDownRefUtil.value && !dropDownRefUtil.value.contains(e.target)) {
    dropDownOpenUtil.value = false
  }
}


onMounted(()=>{
  document.addEventListener("click", (e)=>{
    if(e.target === dropDownRefUtil.value|| e.target.parentNode === dropDownRefUtil.value) {
      dropDownOpen.value = false
      return;
    }
    if(e.target === dropDownRef.value || e.target.parentNode === dropDownRef.value) {
      dropDownOpenUtil.value = false
      return;
    }

    dropDownOpen.value = false
    dropDownOpenUtil.value = false


  })
})
</script>

<template>
  <header  class="">
    <div class=" flex flex-wrap p-6  flex-col md:flex-row items-center">
      <a class="title-font font-medium text-white mb-4 md:mb-0">
        <RouterLink to="/" class="text-xl text-gray-700">
          Aiman Rahim
        </RouterLink>
      </a>
      <nav class=" md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-700	flex flex-wrap items-center text-base justify-center">
        <RouterLink
            to="/"
            class="mr-5 hover:text-white text-gray-700 hover:bg-dark p-2 rounded-md focus:outline-none" >
          Blog
        </RouterLink>
        <div >
          <button ref="dropDownRef"
              class=" inline-flex items-center mr-2 hover:text-white text-gray-700 hover:bg-dark p-2 rounded-md focus:outline-none "
              @click="toggleDropdown"
          >
            Gerakan Developer Tanahair
            <svg
                class="fill-current h-4 w-4 ml-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
            >
              <path d="M6 8l4 4 4-4"></path>
            </svg>
          </button>
            <transition name="fade">
          <div  v-if="dropDownOpen" class="absolute bg-gray-100 py-2 rounded-md mx-auto md:mt-0 md:w-auto md:mx-3 lg:-translate-x-3 md:translate-x-3 translate-y-2 z-40 ">
            <RouterLink
                to="/gerakan"
                class="block px-4 py-2 text-gray-700 hover:text-gray-400"
            >
              About
            </RouterLink>
            <RouterLink
                to="/activities"
                class="block px-4 py-2 text-gray-700 hover:text-gray-400"
            >
              Activities
            </RouterLink>
            <RouterLink
                to="/lambda"
                class="block px-4 py-2 text-gray-700 hover:text-gray-400"
            >
              Lambda
            </RouterLink>
            <RouterLink
                to="/projects"
                class="block px-4 py-2 text-gray-700 hover:text-gray-400"
            >
              Projects
            </RouterLink>
          </div>
            </transition>
        </div>

        <div >
          <button ref="dropDownRefUtil"
              class=" inline-flex items-center mr-2 hover:text-white text-gray-700 hover:bg-dark p-2 rounded-md focus:outline-none "
              @click="toggleDropdownUtil"
          >
            Utilities
            <svg
                class="fill-current h-4 w-4 ml-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
            >
              <path d="M6 8l4 4 4-4"></path>
            </svg>
          </button>
          <transition name="fade">
          <div  v-if="dropDownOpenUtil" class="absolute bg-gray-100 py-2 rounded-md mx-auto md:mt-0 md:w-auto md:mx-3 lg:-translate-x-3 md:translate-x-3 translate-y-2 z-40 ">
            <RouterLink
                to="/whatsapp-tool"
                class="block px-4 py-2 text-gray-700 hover:text-gray-400"
            >
              Whatsapp Tool
            </RouterLink>

            <RouterLink
                to="/qr"
                class="block px-4 py-2 text-gray-700 hover:text-gray-400"
            >
              QR Code Generator
            </RouterLink>
          </div>
          </transition>
        </div>

      </nav>
      <Clock/>
    </div>
  </header>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.1s ease;
}
.fade-enter-from, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>