<script setup>
import { ref, computed } from 'vue'
import { useHoverLift } from '../../composables/useHoverLift'
import { useMicroBreak } from '../../composables/useMicroBreak'

const props = defineProps({
  hoverable: {
    type: Boolean,
    default: true
  },
  microBreak: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'bordered', 'glass'].includes(value)
  },
  padding: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'none'].includes(value)
  }
})

const cardRef = ref(null)
const { transform: liftTransform } = props.hoverable ? useHoverLift() : { transform: ref({ y: 0, scale: 1 }) }
const { transforms: breakTransforms } = props.microBreak ? useMicroBreak() : { transforms: ref({ rotate: 0, x: 0, y: 0 }) }

const cardClasses = computed(() => {
  const base = 'rounded-lg transition-all duration-300'

  const variants = {
    default: 'bg-white shadow-md hover:shadow-xl border border-stone-200',
    bordered: 'bg-white border-2 border-stone-300 hover:border-amber-600',
    glass: 'glass shadow-lg'
  }

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return `${base} ${variants[props.variant]} ${paddings[props.padding]}`
})

const cardStyle = computed(() => {
  const style = {}

  if (props.hoverable) {
    style.transform = `translateY(${liftTransform.value.y}px) scale(${liftTransform.value.scale})`
  }

  if (props.microBreak) {
    const existingTransform = style.transform || ''
    style.transform = `${existingTransform} rotate(${breakTransforms.value.rotate}deg)`.trim()
  }

  return style
})
</script>

<template>
  <div
    ref="cardRef"
    :class="cardClasses"
    :style="cardStyle"
  >
    <slot />
  </div>
</template>
