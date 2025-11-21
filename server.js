require('dotenv').config();
const app = require('./src/app');
const { initializeDatabase } = require('./src/config/database-neon-http');

const PORT = process.env.PORT || 3000;

console.log('🚀 Starting TinyLink Server');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', PORT);
console.log('Database: Neon PostgreSQL (HTTP/Serverless)');

// Initialize database and start server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log('✅ Server is running successfully!');
      console.log(`📊 Dashboard: http://localhost:${PORT}`);
      console.log(`❤️  Health Check: http://localhost:${PORT}/healthz`);
      console.log(`📖 API Docs: http://localhost:${PORT}/api/links`);
      console.log('👉 Press Ctrl+C to stop the server\n');
    });
  })
  .catch((error) => {
    console.error('❌ Failed to start server');
    console.error('Error:', error.message);
    process.exit(1);
  });