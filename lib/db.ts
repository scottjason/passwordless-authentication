import mongoose from 'mongoose';

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error(
    'Please define the DATABASE_URL environment variable inside .env.local'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { connection: null, promise: null };
}

async function dbConnect(): Promise<mongoose.Connection> {
  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(DATABASE_URL as string, opts)
      .then((mongoose) => {
        return mongoose.connection;
      });
  }
  cached.connection = await cached.promise;
  return cached.connection;
}

export { dbConnect };
