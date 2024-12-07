'use client'

import { useEffect, useRef, memo, useMemo } from 'react'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  ShaderMaterial,
  PlaneGeometry,
  Mesh,
  Vector2,
  Color,
  AdditiveBlending
} from 'three'
import { theme } from '@/lib/theme'
import { cn } from '@/lib/utils'

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
  const rendererRef = useRef<WebGLRenderer | null>(null)
  const sceneRef = useRef<Scene | null>(null)
  const cameraRef = useRef<PerspectiveCamera | null>(null)
  const materialRef = useRef<ShaderMaterial | null>(null)
  const frameRef = useRef<number>(0)
  const isVisibleRef = useRef(true)

  // Create uniforms once
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    mousePos: { value: new Vector2(0, 0) },
    color: { value: new Color(theme.colors.primary.ochre) },
    resolution: { value: new Vector2(1, 1) },
    speed: { value: 1 },
    colorShift: { value: 0 },
  }), [])

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize Three.js scene
    const scene = new Scene()
    sceneRef.current = scene

    const camera = new PerspectiveCamera(75, 1, 0.1, 1000)
    cameraRef.current = camera

    const renderer = new WebGLRenderer({ 
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: false
    })
    rendererRef.current = renderer

    const material = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: AdditiveBlending,
    })
    materialRef.current = material

    const geometry = new PlaneGeometry(15, 15, 50, 50)
    const mesh = new Mesh(geometry, material)
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

    const handleMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      
      const targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const targetY = -((event.clientY - rect.top) / rect.height) * 2 + 1
      
      mouseRef.current.x += (targetX - mouseRef.current.x) * 0.1
      mouseRef.current.y += (targetY - mouseRef.current.y) * 0.1
      
      uniforms.mousePos.value.set(mouseRef.current.x, mouseRef.current.y)
    }

    const animate = (time: number) => {
      if (!isVisibleRef.current) return
      if (!renderer || !scene || !camera) return
      
      frameRef.current = requestAnimationFrame(animate)
      uniforms.time.value = time * 0.001
      renderer.render(scene, camera)
    }

    // Initial setup
    handleResize()
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)
    frameRef.current = requestAnimationFrame(animate)

    // Event listeners
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    // Intersection Observer to pause animation when not visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
        if (entry.isIntersecting) {
          frameRef.current = requestAnimationFrame(animate)
        }
      },
      { threshold: 0 }
    )
    observer.observe(containerRef.current)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
      if (materialRef.current) {
        materialRef.current.dispose()
      }
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
        contain: 'paint layout size'
      }}
    />
  )
}) 