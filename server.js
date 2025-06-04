const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app-name.vercel.app'] 
    : ['http://localhost:3000', 'http://localhost:4000', 'http://127.0.0.1:5500'],
  credentials: true
}));
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || 'dfv9u6nih',
  api_key: process.env.API_KEY || '347986782195329',
  api_secret: process.env.API_SECRET || 'IPmMvrdBRMrxvYrdV3CDcOavDis'
});

// Test Cloudinary connection
console.log('Cloudinary Config:', {
  cloud_name: cloudinary.config().cloud_name,
  api_key: cloudinary.config().api_key ? 'Set' : 'Not Set',
  api_secret: cloudinary.config().api_secret ? 'Set' : 'Not Set'
});

// API Routes with /api prefix for Vercel
app.get('/api/gallery-images', async (req, res) => {
  try {
    console.log('Fetching images from Cloudinary...');
    
    const result = await cloudinary.search
      .expression('folder:gallery')
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute();

    console.log(`Found ${result.resources.length} images`);
    res.json({ success: true, images: result.resources });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/delete-image', async (req, res) => {
  try {
    const { public_id } = req.body;
    
    console.log('Attempting to delete image:', public_id);
    
    if (!public_id) {
      return res.status(400).json({ success: false, message: 'Public ID is required' });
    }

    const result = await cloudinary.uploader.destroy(public_id);
    console.log('Delete result:', result);
    
    if (result.result === 'ok') {
      res.json({ success: true, message: 'Image deleted successfully' });
    } else if (result.result === 'not found') {
      res.json({ success: false, message: 'Image not found' });
    } else {
      res.json({ success: false, message: 'Failed to delete image' });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', cloudinary: 'Connected', timestamp: new Date().toISOString() });
});

// Serve admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle 404
app.get('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server (for local development)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📸 Gallery API: http://localhost:${PORT}/api/gallery-images`);
    console.log(`🗑️  Delete API: http://localhost:${PORT}/api/delete-image`);
    console.log(`👨‍💼 Admin Panel: http://localhost:${PORT}/admin`);
  });
}

// Export for Vercel
module.exports = app;