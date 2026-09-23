import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.model.js';
import path from 'path';
import authRoutes from './routes/auth.routes.js';
import blogRoutes from './routes/blog.routes.js';
import podcastRoutes from './routes/podcast.routes.js';
import serviceRoutes from './routes/service.routes.js';
import contactRoutes from './routes/contact.routes.js';
import uploadRoutes from './routes/upload.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || process.env.BACKEND_PORT || 5001;

const seedAdmin = async () => {
  try {
    const existing = await User.findOne({ username: 'admin' });
    if (!existing) {
      const hashedPassword = await bcrypt.hash('admin@1234', 10);
      await User.create({ username: 'admin', password: hashedPassword });
      console.log('✓ Admin user initialized in database (username: "admin")');
    } else {
      console.log('✓ Admin user verified in database');
    }
  } catch (err) {
    console.error('Error seeding admin:', err.message);
  }
};

const initDB = async () => {
  const conn = await connectDB();
  if (conn) {
    await seedAdmin();
  } else {
    const retryInterval = setInterval(async () => {
      const retryConn = await connectDB(true);
      if (retryConn) {
        clearInterval(retryInterval);
        await seedAdmin();
      }
    }, 30000);
  }
};

initDB();

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://lucidmind.co.in',
    'https://www.lucidmind.co.in',
    'https://api.lucidmind.co.in',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'LucidMind API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/podcasts', podcastRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log('LucidMind backend running on port ' + PORT);
});
