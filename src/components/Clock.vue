<script setup>
import {onMounted, ref} from 'vue'

const clockState = ref(new Date().toLocaleTimeString())
onMounted(()=>{
  setInterval(()=>{
    clockState.value = new Date().toLocaleTimeString()
  }, 1000)
})
</script>

<template>

    <a class='cursor-pointer w-32 inline-flex justify-center items-center bg-dark p-2 focus:outline-none active:shadow hover:bg-gray-700 rounded text-base mt-4 md:mt-0 hover:text-white'>{{clockState}}</a>
</template>

<style scoped>

</style>