<script setup>

</script>

<template>
  <div class="pt-2">
    <div class="mx-5  md:lg:mx-auto grid grid-cols-1  lg:grid-cols-1 lg:items-center">
      <div class=" mx-5 my-5  flex justify-center ">
       <a title="LinkedIn" href="https://www.linkedin.com/in/aiman-rahim-grad-eng-4267091a3/" target="_blank">
        <img src="https://img.icons8.com/color/48/000000/linkedin.png"/>
        </a>
        <a title="Github"href="https://github.com/plashspeed-aiman" target="_blank">
        <img src="https://img.icons8.com/color/48/000000/github--v1.png"/>
        </a>
        <a title="Library" href="https://1drv.ms/f/s!AqovS-q8esj8hvZQE6qMn8r4taPf6g?e=fezdRp" target="_blank">
          <img src="https://img.icons8.com/?size=48&id=ChugQlss1ohB&format=png&color=000000"/>
        </a>
      </div>

      <div class="bg-white shadow-xl px-6 lg:px-8 rounded-lg py-6 lg:py-8 lg:col-span-1 transition-all duration-300 hover:shadow-2xl">
        <!-- Profile Header -->
        <h1 class="text-5xl font-bold mb-4 text-center sm:text-left bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
          Hi! I'm Aiman Rahim
        </h1>

        <!-- Profile Description -->
        <p class="text-lg text-gray-700 leading-relaxed">
          I've been doing software development for almost 3 years with a focus on backend and I help build #GerakanDeveloperTanahAir
        </p>

        <!-- Tech Stacks Section -->
        <h2 class="text-3xl font-bold mt-8 mb-4 text-center sm:text-left text-gray-800">
          Tech Stacks
        </h2>
        <div class="flex flex-wrap gap-2 items-center">
          <img alt="C#" src="https://img.shields.io/badge/-C%23-blue?style=flat&logo=c-sharp" class="hover:scale-110 transition-transform">
          <img alt="F#" src="https://img.shields.io/badge/-F%23-000000?style=flat&logo=f-sharp" class="hover:scale-110 transition-transform">
          <img alt=".NET" src="https://img.shields.io/badge/-.NET-512BD4?style=flat&logo=.net" class="hover:scale-110 transition-transform">
          <img alt="Vue.js" src="https://img.shields.io/badge/-Vue.js-4FC08D?style=flat&logo=vue.js" class="hover:scale-110 transition-transform">
          <img alt="OCaml" src="https://img.shields.io/badge/-OCaml-EC6813?style=flat&logo=ocaml" class="hover:scale-110 transition-transform">
          <img alt="Go" src="https://img.shields.io/badge/-Go-000000?style=flat&logo=go" class="hover:scale-110 transition-transform">
          <img alt="Docker" src="https://img.shields.io/badge/-Docker-000000?style=flat&logo=docker" class="hover:scale-110 transition-transform">
        </div>

        <!-- Divider -->
        <hr class="my-8 border-gray-200"/>

        <!-- Skills Section -->
        <h2 class="text-3xl font-bold mb-6 text-center sm:text-left text-gray-800">
          Skills
        </h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- Backend Card -->
          <div class="group bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
            <h3 class="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-3">
              Backend
            </h3>
            <p class="text-gray-600 leading-relaxed">
              Mostly on C# and .NET. But I can do NodeJS with Typescript, PHP with Laravel
            </p>
          </div>

          <!-- Frontend Card -->
          <div class="group bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
            <h3 class="text-2xl font-bold text-gray-800 group-hover:text-green-600 transition-colors mb-3">
              Frontend
            </h3>
            <p class="text-gray-600 leading-relaxed">
              I have experience with Vue (in fact this website is built with Vue)
            </p>
          </div>

          <!-- Databases Card -->
          <div class="group bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
            <h3 class="text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors mb-3">
              Databases
            </h3>
            <p class="text-gray-600 leading-relaxed">
              I have experience with SQL databases like SQL Server and SQLite. Currently learning how to make highly available systems
            </p>
          </div>

          <!-- DevOps Card -->
          <div class="group bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
            <h3 class="text-2xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors mb-3">
              DevOps
            </h3>
            <p class="text-gray-600 leading-relaxed">
              Have some working knowledge on how to make Docker images and get things up and running with Docker compose.
            </p>
          </div>
        </div>
      </div>

  </div>
  </div>
</template>

<style scoped>

</style>