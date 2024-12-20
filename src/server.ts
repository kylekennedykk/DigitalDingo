import express from 'express'
import next from 'next'
import path from 'path'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000

app.prepare().then(() => {
  const server = express()

  // Serve static files from the public directory
  server.use(express.static(path.join(__dirname, '../public')))

  // Handle all other routes with Next.js
  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
}).catch((err) => {
  console.error('Error starting server:', err)
}) 