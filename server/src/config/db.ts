import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isMemoryServer = false;

export const connectDB = async (): Promise<string> => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vcorp_db';

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500,
    });
    console.log('Connected to MongoDB at:', MONGODB_URI);
    return MONGODB_URI;
  } catch (err: any) {
    console.warn('MongoDB at ' + MONGODB_URI + ' unavailable. Initializing In-Memory DB fallback...');
    try {
      // @ts-ignore
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({
        instance: { dbName: 'vcorp_db' }
      });
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      isMemoryServer = true;
      console.log('Connected to Embedded In-Memory MongoDB at:', memoryUri);
      return memoryUri;
    } catch (memErr: any) {
      console.error('Failed to start embedded MongoDB:', memErr.message);
      return MONGODB_URI;
    }
  }
};

export const isUsingMemoryDB = () => isMemoryServer;
