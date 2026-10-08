/**
 * Zero-setup demo mode: boots an in-memory MongoDB, seeds it with the
 * DECORA starter content + admin user, then starts the API.
 *
 *   npm run demo   →  http://localhost:5000  (no MongoDB install needed)
 *
 * For production use `npm start` with a real MONGO_URI (Atlas / VPS).
 */
import 'dotenv/config'
import { MongoMemoryServer } from 'mongodb-memory-server'

const mongod = await MongoMemoryServer.create()
process.env.MONGO_URI = mongod.getUri('decora')
console.log('[demo] In-memory MongoDB ready at', process.env.MONGO_URI)

// Seed sample content + admin user into the fresh database.
await import('./seed.js')

// Boot the API (server.js reads the MONGO_URI we just injected).
await import('./server.js')
