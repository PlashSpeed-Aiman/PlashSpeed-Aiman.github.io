<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  as: {
    type: String,
    default: 'button'
  },
  href: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const componentType = computed(() => {
  if (props.href) return 'a'
  return props.as
})

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    primary: 'bg-amber-600 text-white hover:bg-amber-500 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-98 focus:ring-amber-500',
    secondary: 'border-2 border-stone-900 text-stone-950 hover:bg-stone-950 hover:text-white hover:-skew-x-1 active:skew-x-0 focus:ring-stone-500',
    ghost: 'text-stone-900 hover:bg-stone-100 hover:text-amber-600 focus:ring-stone-300'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-md',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-lg'
  }

  const disabled = props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

  return `${base} ${variants[props.variant]} ${sizes[props.size]} ${disabled}`
})
</script>

<template>
  <component
    :is="componentType"
    :class="classes"
    :href="href"
    :disabled="disabled"
  >
    <slot />
  </component>
</template>

<style scoped>
.scale-98 {
  transform: scale(0.98);
}

.hover\:scale-102:hover {
  transform: scale(1.02);
}
</style>
