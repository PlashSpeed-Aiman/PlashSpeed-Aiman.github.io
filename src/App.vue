<script setup>
import HelloWorld from './components/HelloWorld.vue'
import Navbar from "./components/Navbar.vue";



</script>

<template>
  <div class="bg-gradient-to-l to-indigo-500 from-orange-400  flex flex-col min-h-screen justify-between">
    <div class='max-w-3xl mx-auto'>
      <Navbar/>
    </div>
    <router-view className="mx-auto max-w-3xl items-center" v-slot="{ Component }">
      <transition name="slide">
        <component :is="Component" />
      </transition>
    </router-view>

    <footer class="bg-orange-800 opacity-75 mt-10 text-center md:lg:text-start text-lg text-white p-2 ">
      <p>Dit is mijn nieuwe website voor de jaar 2024</p>
        <p>Aiman Rahim </p>
    </footer>
  </div>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: transform 0.6s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(150vh);
}
</style>
