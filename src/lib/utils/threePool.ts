import * as THREE from 'three'

class ResourcePool {
  private geometries: Map<string, THREE.BufferGeometry>
  private materials: Map<string, THREE.Material>
  
  constructor() {
    this.geometries = new Map()
    this.materials = new Map()
  }
  
  getGeometry(key: string, creator: () => THREE.BufferGeometry) {
    if (!this.geometries.has(key)) {
      this.geometries.set(key, creator())
    }
    return this.geometries.get(key)!
  }
  
  getMaterial(key: string, creator: () => THREE.Material) {
    if (!this.materials.has(key)) {
      this.materials.set(key, creator())
    }
    return this.materials.get(key)!
  }
  
  dispose() {
    this.geometries.forEach(g => g.dispose())
    this.materials.forEach(m => m.dispose())
    this.geometries.clear()
    this.materials.clear()
  }
}

export const resourcePool = new ResourcePool() 