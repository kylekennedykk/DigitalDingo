// Handle image processing in a separate thread
self.onmessage = async (e) => {
  const { imageData, operation } = e.data

  switch (operation) {
    case 'resize':
      // Image resizing logic
      break
    case 'optimize':
      // Image optimization logic
      break
    default:
      break
  }

  self.postMessage({ result: imageData })
} 