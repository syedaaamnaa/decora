import mongoose from 'mongoose';

/**
 * Tracks whether the MongoDB connection is currently open.
 * Updated by the 'open' / 'disconnected' connection events.
 */
export const dbState = { isConnected: false };

mongoose.connection.on('open', () => {
  dbState.isConnected = true;
  console.log('[db] MongoDB connected');
});

mongoose.connection.on('disconnected', () => {
  dbState.isConnected = false;
  console.warn('[db] MongoDB disconnected');
});

/**
 * Connect to MongoDB using MONGO_URI from the environment.
 * Rejects on failure so the caller (server.js) can decide what to do.
 */
export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined in the environment');
  }

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(uri);
    dbState.isConnected = true;
  } catch (err) {
    dbState.isConnected = false;
    console.error('\n[db] FAILED to connect to MongoDB:');
    console.error(`[db]   ${err.message}`);
    console.error('[db] The server will still start, but database routes will not work.\n');
    throw err;
  }
}
