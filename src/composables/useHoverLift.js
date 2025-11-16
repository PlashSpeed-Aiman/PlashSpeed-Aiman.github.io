import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Physics-based hover lift effect
 * Creates a smooth spring animation when hovering over elements
 */
export function useHoverLift(options = {}) {
  const {
    liftAmount = 8,
    stiffness = 170,
    damping = 26,
    mass = 1
  } = options

  const elementRef = ref(null)
  const transform = ref({ y: 0, scale: 1 })
  const isHovered = ref(false)

  let animationFrame = null
  let velocity = { y: 0, scale: 0 }
  let current = { y: 0, scale: 1 }

  const spring = (target, current, velocity) => {
    const force = (target - current) * stiffness / 100
    const dampingForce = velocity * damping / 100
    const acceleration = (force - dampingForce) / mass

    velocity += acceleration
    current += velocity

    return { current, velocity }
  }

  const animate = () => {
    const target = {
      y: isHovered.value ? -liftAmount : 0,
      scale: isHovered.value ? 1.02 : 1
    }

    const resultY = spring(target.y, current.y, velocity.y)
    current.y = resultY.current
    velocity.y = resultY.velocity

    const resultScale = spring(target.scale, current.scale, velocity.scale)
    current.scale = resultScale.current
    velocity.scale = resultScale.velocity

    transform.value = { y: current.y, scale: current.scale }

    // Continue animation if not settled
    const isSettled = Math.abs(velocity.y) < 0.01 && Math.abs(velocity.scale) < 0.001
    if (!isSettled) {
      animationFrame = requestAnimationFrame(animate)
    }
  }

  const handleMouseEnter = () => {
    isHovered.value = true
    if (animationFrame) cancelAnimationFrame(animationFrame)
    animationFrame = requestAnimationFrame(animate)
  }

  const handleMouseLeave = () => {
    isHovered.value = false
    if (animationFrame) cancelAnimationFrame(animationFrame)
    animationFrame = requestAnimationFrame(animate)
  }

  onMounted(() => {
    if (elementRef.value) {
      elementRef.value.addEventListener('mouseenter', handleMouseEnter)
      elementRef.value.addEventListener('mouseleave', handleMouseLeave)
    }
  })

  onUnmounted(() => {
    if (elementRef.value) {
      elementRef.value.removeEventListener('mouseenter', handleMouseEnter)
      elementRef.value.removeEventListener('mouseleave', handleMouseLeave)
    }
    if (animationFrame) cancelAnimationFrame(animationFrame)
  })

  return {
    elementRef,
    transform,
    style: () => ({
      transform: `translateY(${transform.value.y}px) scale(${transform.value.scale})`,
      transition: 'box-shadow 150ms ease-out'
    })
  }
}
