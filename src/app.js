const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');
const redirectRoutes = require('./routes/redirect');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// IMPORTANT: Serve static files BEFORE any routes
app.use(express.static(path.join(__dirname, '../public'), {
  setHeaders: (res, path) => {
    // Set correct MIME types
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    }
  }
}));

// Health check endpoint (before any other routes)
app.get('/healthz', (req, res) => {
  res.status(200).json({
    ok: true,
    version: '1.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Dashboard page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Stats page (must come before redirect route)
app.get('/code/:code', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/stats.html'));
});

// API routes (must come before redirect route)
app.use('/api', apiRoutes);

// Redirect routes MUST BE LAST (catches all remaining /:code routes)
app.use('/', redirectRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;