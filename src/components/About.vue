<script setup>
import { ref } from 'vue'
import Card from './base/Card.vue'
import BaseButton from './base/BaseButton.vue'

const skills = [
  {
    id: 1,
    title: 'Backend',
    description: 'Mostly on C# and .NET. But I can do NodeJS with Typescript, PHP with Laravel',
    icon: '⚙️'
  },
  {
    id: 2,
    title: 'Frontend',
    description: 'I have experience with Vue (in fact this website is built with Vue)',
    icon: '🎨'
  },
  {
    id: 3,
    title: 'Databases',
    description: 'I have experience with SQL databases like SQL Server and SQLite. Currently learning how to make highly available systems',
    icon: '💾'
  },
  {
    id: 4,
    title: 'DevOps',
    description: 'Have some working knowledge on how to make Docker images and get things up and running with Docker compose.',
    icon: '🚀'
  }
]
</script>

<template>
  <div class="max-w-8xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
    <!-- Hero Section - Asymmetric Layout (4/8 split) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16">
      <!-- Left Column - Smaller (4 cols) -->
      <div class="lg:col-span-4 space-y-6 animate-slide-in-right">
        <!-- Social Links with micro-break -->
        <div class="flex gap-4">
          <a
            href="https://www.linkedin.com/in/aiman-rahim-grad-eng-4267091a3/"
            target="_blank"
            rel="noopener"
            class="p-3 rounded-lg bg-white border-2 border-stone-200 hover:border-amber-600 hover:-translate-y-1 transition-all duration-200 hover:shadow-md"
            title="LinkedIn"
          >
            <svg class="w-6 h-6 text-stone-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          <a
            href="https://github.com/plashspeed-aiman"
            target="_blank"
            rel="noopener"
            class="p-3 rounded-lg bg-white border-2 border-stone-200 hover:border-amber-600 hover:-translate-y-1 transition-all duration-200 hover:shadow-md"
            title="GitHub"
          >
            <svg class="w-6 h-6 text-stone-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a
            href="https://1drv.ms/f/s!AqovS-q8esj8hvZQE6qMn8r4taPf6g?e=fezdRp"
            target="_blank"
            rel="noopener"
            class="p-3 rounded-lg bg-white border-2 border-stone-200 hover:border-amber-600 hover:-translate-y-1 transition-all duration-200 hover:shadow-md"
            title="Library"
          >
            <svg class="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </a>
        </div>

        <!-- Quick Stats with micro-break -->
        <Card :hoverable="false" variant="bordered" class="micro-break">
          <div class="space-y-3">
            <div>
              <p class="text-sm text-stone-600">Experience</p>
              <p class="text-2xl font-semibold text-stone-950">3+ Years</p>
            </div>
            <div class="h-px bg-stone-200"></div>
            <div>
              <p class="text-sm text-stone-600">Primary Focus</p>
              <p class="text-lg font-medium text-amber-600">Backend Development</p>
            </div>
          </div>
        </Card>
      </div>

      <!-- Right Column - Larger (8 cols) - Offset from center -->
      <div class="lg:col-span-8 space-y-8">
        <!-- Hero Title with intentional -1deg rotation -->
        <div class="space-y-6" style="transform: rotate(-0.5deg);">
          <h1 class="text-5xl lg:text-6xl font-bold text-stone-950 leading-tight tracking-tight">
            Hi! I'm <span class="text-gradient-warm">Aiman Rahim</span>
          </h1>
          <p class="text-xl text-stone-600 leading-relaxed max-w-2xl">
            I've been doing software development for almost 3 years with a focus on backend and I help build <span class="font-semibold text-amber-600 hover:underline"><a href="https://detacommunity.com">Developer Tanah Air</a></span>
          </p>
        </div>

        <!-- Dutch Tagline - High Impact Design -->
        <div class="relative max-w-2xl" style="transform: rotate(-0.3deg);">
          <div class="border-l-4 border-amber-600 pl-6 py-4 bg-gradient-to-r from-amber-50/50 to-transparent rounded-r-lg">
            <p class="text-2xl lg:text-3xl font-bold italic text-stone-950 leading-tight" style="letter-spacing: -0.03em;">
              Bijdragen via technologie.<br/>
              Voor de <span class="text-gradient-warm">Ummah en de Wereld!</span>
            </p>
            <p class="text-sm text-stone-500 mt-2 font-normal not-italic">
              Contributing through technology. For the Ummah and the World!
            </p>
          </div>
        </div>

        <!-- Tech Stack Badges -->
        <div class="space-y-4">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-stone-500">Tech Stack</h3>
          <div class="flex flex-wrap gap-3">
            <span class="px-4 py-2 bg-white border border-stone-300 rounded-md text-sm font-medium text-stone-700 hover:border-amber-600 hover:-translate-y-0.5 transition-all duration-200">
              C#
            </span>
            <span class="px-4 py-2 bg-white border border-stone-300 rounded-md text-sm font-medium text-stone-700 hover:border-amber-600 hover:-translate-y-0.5 transition-all duration-200">
              F#
            </span>
            <span class="px-4 py-2 bg-white border border-stone-300 rounded-md text-sm font-medium text-stone-700 hover:border-amber-600 hover:-translate-y-0.5 transition-all duration-200">
              .NET
            </span>
            <span class="px-4 py-2 bg-white border border-stone-300 rounded-md text-sm font-medium text-stone-700 hover:border-amber-600 hover:-translate-y-0.5 transition-all duration-200">
              Vue.js
            </span>
            <span class="px-4 py-2 bg-white border border-stone-300 rounded-md text-sm font-medium text-stone-700 hover:border-amber-600 hover:-translate-y-0.5 transition-all duration-200">
              OCaml
            </span>
            <span class="px-4 py-2 bg-white border border-stone-300 rounded-md text-sm font-medium text-stone-700 hover:border-amber-600 hover:-translate-y-0.5 transition-all duration-200">
              Go
            </span>
            <span class="px-4 py-2 bg-white border border-stone-300 rounded-md text-sm font-medium text-stone-700 hover:border-amber-600 hover:-translate-y-0.5 transition-all duration-200">
              Docker
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Asymmetric Divider (doesn't fully span) -->
    <div class="relative mb-16">
      <div class="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent" style="width: 85%; margin-left: 8%;"></div>
    </div>

    <!-- Skills Section -->
    <div class="space-y-8">
      <h2 class="text-4xl font-semibold text-stone-950 tracking-tight">
        What I Do
      </h2>

      <!-- Grid with intentional break - 4th card wider -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          v-for="(skill, index) in skills"
          :key="skill.id"
          :hoverable="true"
          :micro-break="index === 2"
          :class="index === 3 ? 'md:col-span-2' : ''"
          class="group"
        >
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <span class="text-3xl">{{ skill.icon }}</span>
              <h3 class="text-2xl font-semibold text-stone-950 group-hover:text-amber-600 transition-colors duration-200">
                {{ skill.title }}
              </h3>
            </div>
            <p class="text-stone-600 leading-relaxed">
              {{ skill.description }}
            </p>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>