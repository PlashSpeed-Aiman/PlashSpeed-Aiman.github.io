import { ref, onMounted } from 'vue'

/**
 * Micro-break: Adds subtle random transformations to elements
 * Creates intentional imperfections in the grid system
 */
export function useMicroBreak(options = {}) {
  const {
    maxRotation = 0.5,
    maxOffset = 2,
    seed = Math.random()
  } = options

  const elementRef = ref(null)
  const transforms = ref({
    rotate: 0,
    x: 0,
    y: 0
  })

  // Seeded random number generator for consistent "randomness"
  const seededRandom = (min, max) => {
    const x = Math.sin(seed * 9999) * 10000
    const random = x - Math.floor(x)
    return min + random * (max - min)
  }

  onMounted(() => {
    // Generate consistent random transformations
    transforms.value = {
      rotate: seededRandom(-maxRotation, maxRotation),
      x: seededRandom(-maxOffset, maxOffset),
      y: seededRandom(-maxOffset, maxOffset)
    }
  })

  return {
    elementRef,
    transforms,
    style: () => ({
      transform: `rotate(${transforms.value.rotate}deg) translate(${transforms.value.x}px, ${transforms.value.y}px)`
    })
  }
}

/**
 * Magnetic hover effect: Elements push away from cursor
 */
export function useMagneticHover(options = {}) {
  const {
    strength = 20,
    radius = 100
  } = options

  const elementRef = ref(null)
  const offset = ref({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!elementRef.value) return

    const rect = elementRef.value.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = e.clientX - centerX
    const deltaY = e.clientY - centerY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    if (distance < radius) {
      const force = (radius - distance) / radius
      offset.value = {
        x: -(deltaX / distance) * strength * force,
        y: -(deltaY / distance) * strength * force
      }
    } else {
      offset.value = { x: 0, y: 0 }
    }
  }

  const handleMouseLeave = () => {
    offset.value = { x: 0, y: 0 }
  }

  onMounted(() => {
    document.addEventListener('mousemove', handleMouseMove)
    if (elementRef.value) {
      elementRef.value.addEventListener('mouseleave', handleMouseLeave)
    }
  })

  return {
    elementRef,
    offset,
    style: () => ({
      transform: `translate(${offset.value.x}px, ${offset.value.y}px)`,
      transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)'
    })
  }
}
