import mongoose from 'mongoose';
import MONGO_URI from '../env.js'
export default function connectDB () {
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    })
    .catch((err) => {
      console.log(MONGO_URI);
      console.error(`Error in connecting to MongoDB: ${err.message}`);
      process.exit(1);
    });
}