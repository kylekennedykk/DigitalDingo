// Web Worker for shader calculations
self.onmessage = (e) => {
  const { time, mousePos } = e.data
  
  // Perform heavy calculations here
  const calculatedValues = {
    wave: Math.sin(time * 1.5) * 0.3,
    influence: Math.min(1.0, 1.0 / (mousePos.length() + 0.1))
  }
  
  self.postMessage(calculatedValues)
} 