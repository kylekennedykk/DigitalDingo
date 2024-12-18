'use client'

import { useEffect, useRef, memo, useMemo, useCallback } from 'react'
import * as THREE from 'three'
import { theme } from '../lib/theme'
import { cn } from '../lib/utils'
import throttle from 'lodash/throttle'

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

class DreamtimeFlowError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DreamtimeFlowError'
  }
}

export default memo(function DreamtimeFlow({ 
  className, 
  scale = 1 
}: {
  className?: string
  scale?: number
}) {
  const mountCount = useRef(0)
  
  useEffect(() => {
    mountCount.current++
    console.log(`DreamtimeFlow mount #${mountCount.current}`, { className })
    
    return () => {
      console.log(`DreamtimeFlow unmount #${mountCount.current}`)
    }
  }, [className])

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

  // Scene initialization function
  const initScene = useCallback(() => {
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
  }, [])

  // Initialize scene
  useEffect(() => {
    try {
      console.log('Initializing scene')
      const setup = initScene()
      if (!setup) throw new DreamtimeFlowError('Failed to initialize scene')
      
      const { scene, camera, renderer } = setup
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

      // Handle resize
      const handleResize = throttle(() => {
        if (!containerRef.current || !renderer || !camera) return
        const { clientWidth, clientHeight } = containerRef.current
        camera.aspect = clientWidth / clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(clientWidth, clientHeight)
        uniforms.resolution.value.set(clientWidth, clientHeight)
      }, 100)

      const resizeObserver = new ResizeObserver(handleResize)

      if (containerRef.current) {
        resizeObserver.observe(containerRef.current)
      }

      // Handle mouse movement
      const handleMouseMove = throttle((event: MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
        uniforms.mousePos.value.set(x, y)
      }, 16)

      window.addEventListener('mousemove', handleMouseMove)

      // Animation loop
      let lastTime = 0
      const animate = (time: number) => {
        if (!isVisibleRef.current) return
        if (!renderer || !scene || !camera) return

        // Limit to 60fps
        if (time - lastTime < 16.67) {
          frameRef.current = requestAnimationFrame(animate)
          return
        }

        lastTime = time
        uniforms.time.value = time * 0.001
        renderer.render(scene, camera)
        frameRef.current = requestAnimationFrame(animate)
      }

      frameRef.current = requestAnimationFrame(animate)

      // Cleanup
      return () => {
        console.log('Cleaning up scene')
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current)
        }
        resizeObserver.disconnect()
        window.removeEventListener('mousemove', handleMouseMove)
        
        if (renderer) {
          renderer.dispose()
          renderer.forceContextLoss()
          renderer.domElement.remove()
        }
        if (material) material.dispose()
        if (geometry) geometry.dispose()
        if (mesh) {
          mesh.geometry.dispose()
          if (mesh.material instanceof THREE.Material) {
            mesh.material.dispose()
          }
        }
      }
    } catch (error) {
      console.error('DreamtimeFlow initialization failed:', error)
    }
  }, [uniforms, initScene])

  useEffect(() => {
    const currentMountCount = mountCount.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (currentMountCount === mountCount.current) {
        observer.disconnect();
      }
    };
  }, []);

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