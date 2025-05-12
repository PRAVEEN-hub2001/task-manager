import mongoose from 'mongoose';

const connectToDatabase = async () => {
  const mongodbUri = process.env.MONGODB_URI;
  const mongodbPassword = process.env.MONGODB_PASSWORD;

  if (!mongodbUri || !mongodbPassword) {
    throw new Error('MongoDB URI or password is not defined in environment variables');
  }

  const connectionString = mongodbUri.replace("<PASSWORD>", mongodbPassword);
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export default connectToDatabase;
