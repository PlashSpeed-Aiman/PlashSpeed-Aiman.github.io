<script setup>
import HelloWorld from './components/HelloWorld.vue'
import Navbar from "./components/Navbar.vue";



</script>

<template>
  <div class="flex flex-col min-h-screen justify-between">

    <div class='bg-white/50 backdrop-blur-sm flex flex-col drop-shadow-md '>
      <h1 class="bg-red-500 text-white text-center">Disclaimer : This website is being converted from React to VueJS so not a lot is being done yet</h1>
      <Navbar class="mx-auto"/>
    </div>
    <router-view className="mx-auto max-w-3xl items-center" v-slot="{ Component }">
        <component :is="Component" />
    </router-view>

    <footer class="bg-amber-500/20  mt-5 text-center text-xs flex gap-1 mx-a px-2 py-1 justify-center ">
      <p>Dit is mijn nieuwe website voor de jaar 2024</p>
      <span>||</span>
      <p>Copyright 2024 - Aiman Rahim </p>
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
