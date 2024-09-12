import mongoose from 'mongoose';

export const connection = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MongoDB URI is not defined');
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};
