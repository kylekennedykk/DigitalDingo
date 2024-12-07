'use client'

import { useEffect, useRef, memo, useMemo, useCallback } from 'react'
import * as THREE from 'three'
import { theme } from '@/lib/theme'
import { cn } from '@/lib/utils'
import throttle from 'lodash/throttle'
import { deferredExecution, measurePerformance } from '@/lib/utils/performance'

// Move shader code outside component to prevent recreation
const vertexShader = `
  varying vec2 vUv;
  uniform float time;
  uniform vec2 mousePos;
  uniform float speed;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    float wave = sin(pos.x * 3.0 + time * 1.5 * speed) * 0.3;
    wave += cos(pos.y * 2.5 + time * 1.2) * 0.3;
    
    float dist = length(pos.xy - mousePos);
    float influence = smoothstep(3.0, 0.0, dist) * 0.5;
    pos.z += wave + influence;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform vec3 color;
  uniform float time;
  uniform vec2 resolution;
  uniform float colorShift;
  varying vec2 vUv;
  
  float circle(vec2 uv, vec2 center, float radius, float softness) {
    float dist = length(uv - center);
    return 1.0 - smoothstep(radius - softness, radius + softness, dist);
  }
  
  void main() {
    vec2 uv = vUv;
    
    float pattern = sin(uv.x * 15.0 + time * 1.2) * 0.5 + 0.5;
    pattern *= sin(uv.y * 12.0 - time * 0.8) * 0.5 + 0.5;
    
    vec2 center1 = vec2(0.5 + sin(time * 0.4) * 0.3, 0.5 + cos(time * 0.5) * 0.3);
    vec2 center2 = vec2(0.3 + cos(time * 0.6) * 0.2, 0.7 + sin(time * 0.7) * 0.2);
    vec2 center3 = vec2(0.7 + sin(time * 0.5) * 0.2, 0.3 + cos(time * 0.4) * 0.2);
    
    float circles = circle(uv, center1, 0.15, 0.08);
    circles += circle(uv, center2, 0.2, 0.08);
    circles += circle(uv, center3, 0.18, 0.08);
    
    float dots = sin(uv.x * 80.0 + time) * sin(uv.y * 80.0 + time) * 0.5 + 0.5;
    
    float alpha = pattern * 0.5 + circles * 0.6;
    alpha *= dots * 0.7 + 0.3;
    
    vec3 finalColor = mix(color, color * (1.0 + colorShift), pattern);
    gl_FragColor = vec4(finalColor, alpha * 0.8);
  }
`

export const DreamtimeFlow = memo(function DreamtimeFlow({ 
  className, 
  variant = 'dark',
  scale = 1 
}: {
  className?: string
  variant?: 'dark' | 'light'
  scale?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const frameRef = useRef<number>(0)
  const isVisibleRef = useRef(true)
  const lastFrameRef = useRef<number>(0)
  const geometryRef = useRef<THREE.PlaneGeometry | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null)
  const throttledMouseMoveRef = useRef<((event: MouseEvent) => void) | null>(null)

  // Create uniforms once
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    mousePos: { value: new THREE.Vector2(0, 0) },
    color: { value: new THREE.Color(theme.colors.primary.ochre) },
    resolution: { value: new THREE.Vector2(1, 1) },
    speed: { value: 1 },
    colorShift: { value: 0 },
  }), [])

  // Move initialization to a separate function
  const initScene = () => {
    if (!containerRef.current) return null
    
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: false
    })
    
    const container = containerRef.current
    const { clientWidth, clientHeight } = container
    
    renderer.setSize(clientWidth, clientHeight)
    container.appendChild(renderer.domElement)
    
    return { scene, camera, renderer }
  }

  // Optimize animation loop
  const animate = useCallback((time: number) => {
    if (!isVisibleRef.current) return
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return
    
    // Limit to 60fps
    if (time - lastFrameRef.current < 16.67) {
      frameRef.current = requestAnimationFrame(animate)
      return
    }
    
    lastFrameRef.current = time
    
    // Update uniforms
    uniforms.time.value = time * 0.001
    
    // Render
    rendererRef.current.render(sceneRef.current, cameraRef.current)
    frameRef.current = requestAnimationFrame(animate)
  }, [uniforms])

  useEffect(() => {
    const endMeasure = measurePerformance('DreamtimeFlow init')
    deferredExecution(() => {
      const setup = initScene()
      if (!setup) return
      const { scene, camera, renderer } = setup

      // Initialize Three.js scene
      sceneRef.current = scene
      cameraRef.current = camera
      rendererRef.current = renderer

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
      })
      materialRef.current = material

      const geometry = new THREE.PlaneGeometry(15, 15, 50, 50)
      geometryRef.current = geometry
      const mesh = new THREE.Mesh(geometry, material)
      meshRef.current = mesh
      scene.add(mesh)

      camera.position.z = 5

      const handleResize = () => {
        if (!containerRef.current || !renderer || !camera) return
        
        const width = containerRef.current.clientWidth
        const height = containerRef.current.clientHeight
        
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
        uniforms.resolution.value.set(width, height)
      }

      // Create ResizeObserver
      const resizeObserver = new ResizeObserver(() => {
        if (!containerRef.current || !renderer || !camera) return
        
        const width = containerRef.current.clientWidth
        const height = containerRef.current.clientHeight
        
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
        uniforms.resolution.value.set(width, height)
      })
      
      // Store observer for cleanup
      resizeObserverRef.current = resizeObserver

      // Throttle mouse move handler
      throttledMouseMoveRef.current = throttle((event: MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return
        
        const targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1
        const targetY = -((event.clientY - rect.top) / rect.height) * 2 + 1
        
        mouseRef.current.x += (targetX - mouseRef.current.x) * 0.1
        mouseRef.current.y += (targetY - mouseRef.current.y) * 0.1
        
        uniforms.mousePos.value.set(mouseRef.current.x, mouseRef.current.y)
      }, 16)

      if (containerRef.current) {
        resizeObserverRef.current?.observe(containerRef.current)
      }
      if (throttledMouseMoveRef.current) {
        window.addEventListener('mousemove', throttledMouseMoveRef.current)
      }

      // Initial setup
      if (containerRef.current) {
        handleResize()
        const { clientWidth, clientHeight } = containerRef.current
        renderer.setSize(clientWidth, clientHeight)
      }

      frameRef.current = requestAnimationFrame(animate)

      // Intersection Observer
      const observer = new IntersectionObserver(
        ([entry]) => {
          isVisibleRef.current = entry.isIntersecting
          if (entry.isIntersecting) {
            frameRef.current = requestAnimationFrame(animate)
          }
        },
        { threshold: 0 }
      )
      if (containerRef.current) {
        observer.observe(containerRef.current)
      }

      // Store observers for cleanup
      resizeObserverRef.current = resizeObserver
      intersectionObserverRef.current = observer

      endMeasure()
    })

    return () => {
      // Cancel animation frame
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }

      // Dispose of Three.js resources
      if (rendererRef.current) {
        rendererRef.current.dispose()
        rendererRef.current.forceContextLoss()
        rendererRef.current.domElement.remove()
      }

      if (materialRef.current) {
        materialRef.current.dispose()
      }

      if (geometryRef.current) {
        geometryRef.current.dispose()
      }

      if (meshRef.current) {
        meshRef.current.geometry.dispose()
        if (meshRef.current.material instanceof THREE.Material) {
          meshRef.current.material.dispose()
        }
      }

      // Clean up observers
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }

      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect()
      }

      // Clean up event listeners
      if (throttledMouseMoveRef.current) {
        window.removeEventListener('mousemove', throttledMouseMoveRef.current)
        throttledMouseMoveRef.current = null
      }

      // Clear refs
      sceneRef.current = null
      cameraRef.current = null
      rendererRef.current = null
      materialRef.current = null
      geometryRef.current = null
      meshRef.current = null
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 w-full h-full overflow-hidden",
        "transform-gpu will-change-transform",
        className
      )}
      style={{ 
        width: '100%', 
        height: '100%',
        background: 'transparent',
        overflow: 'hidden',
        isolation: 'isolate',
        contain: 'paint layout'
      }}
    />
  )
}) 