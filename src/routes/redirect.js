const express = require('express');
const router = express.Router();
const Link = require('../models/Link');

router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;

    // Exclude static file paths and reserved routes
    const excludedPaths = ['css', 'js', 'assets', 'images', 'api', 'healthz', 'code'];
    if (excludedPaths.includes(code.toLowerCase())) {
      return res.status(404).json({ error: 'Not found' });
    }

    // Validate code format (6-8 alphanumeric)
    const codeRegex = /^[A-Za-z0-9]{6,8}$/;
    if (!codeRegex.test(code)) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>404 - Invalid Link</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 1rem;
            }
            .container {
              text-align: center;
              background: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(20px);
              padding: 3rem 2rem;
              border-radius: 24px;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
              max-width: 500px;
              animation: scaleIn 0.5s ease-out;
            }
            @keyframes scaleIn {
              from {
                opacity: 0;
                transform: scale(0.9);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            .error-icon {
              font-size: 5rem;
              margin-bottom: 1rem;
            }
            h1 {
              font-size: 2.5rem;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              margin-bottom: 1rem;
              font-weight: 800;
            }
            p {
              color: #4b5563;
              font-size: 1.125rem;
              margin-bottom: 2rem;
              line-height: 1.6;
            }
            .code-display {
              background: #f3f4f6;
              padding: 0.75rem 1.5rem;
              border-radius: 12px;
              font-family: 'Courier New', monospace;
              font-weight: 600;
              color: #ef4444;
              margin-bottom: 2rem;
              display: inline-block;
            }
            a {
              display: inline-block;
              padding: 1rem 2rem;
              background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
              color: white;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 600;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
            }
            a:hover {
              transform: translateY(-3px);
              box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error-icon">🔍</div>
            <h1>404 - Invalid Link</h1>
            <p>The link code format is invalid. Codes must be 6-8 alphanumeric characters.</p>
            <div class="code-display">/${code}</div>
            <a href="/">Go to Dashboard</a>
          </div>
        </body>
        </html>
      `);
    }

    const link = await Link.findByCode(code);

    // If link doesn't exist, return 404
    if (!link) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>404 - Link Not Found</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 1rem;
            }
            .container {
              text-align: center;
              background: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(20px);
              padding: 3rem 2rem;
              border-radius: 24px;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
              max-width: 500px;
            }
            .error-icon {
              font-size: 5rem;
              margin-bottom: 1rem;
            }
            h1 {
              font-size: 2.5rem;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              margin-bottom: 1rem;
              font-weight: 800;
            }
            p {
              color: #4b5563;
              font-size: 1.125rem;
              margin-bottom: 2rem;
            }
            .code-display {
              background: #f3f4f6;
              padding: 0.75rem 1.5rem;
              border-radius: 12px;
              font-family: 'Courier New', monospace;
              font-weight: 600;
              color: #ef4444;
              margin-bottom: 2rem;
              display: inline-block;
            }
            a {
              display: inline-block;
              padding: 1rem 2rem;
              background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
              color: white;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 600;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
            }
            a:hover {
              transform: translateY(-3px);
              box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error-icon">❌</div>
            <h1>404 - Link Not Found</h1>
            <p>This link has been deleted or never existed.</p>
            <div class="code-display">/${code}</div>
            <a href="/">Create Your Own Link</a>
          </div>
        </body>
        </html>
      `);
    }

    // Increment clicks and redirect
    await Link.incrementClicks(code);
    return res.redirect(302, link.target_url);
    
  } catch (error) {
    console.error('Redirect error:', error);
    return res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>500 - Server Error</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            text-align: center;
            background: white;
            padding: 3rem;
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
          h1 { color: #ef4444; font-size: 2.5rem; margin-bottom: 1rem; }
          p { color: #4b5563; margin-bottom: 2rem; }
          a {
            display: inline-block;
            padding: 1rem 2rem;
            background: #6366f1;
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>⚠️ Server Error</h1>
          <p>Something went wrong. Please try again.</p>
          <a href="/">Go Home</a>
        </div>
      </body>
      </html>
    `);
  }
});

module.exports = router;