# 🔗 TinyLink - URL Shortening Service

A modern, full-stack URL shortening application similar to bit.ly, built with Node.js, Express, and PostgreSQL. Create short, memorable links and track their performance with detailed analytics.

![TinyLink Demo](https://img.shields.io/badge/Status-Live-success)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)


## 🌐 Live Demo

**Live Application:** [Live](https://tinylink-p8xa.onrender.com/)

**Health Check:** [Healthz](https://tinylink-p8xa.onrender.com/healthz)

---

## ✨ Features

### Core Functionality
- ✅ **Create Short Links** - Convert long URLs into short, shareable links
- ✅ **Custom Codes** - Choose your own memorable short codes (6-8 characters)
- ✅ **Auto-Generated Codes** - Get random codes if you don't specify one
- ✅ **Click Tracking** - Monitor how many times each link is clicked
- ✅ **Redirect Service** - Fast 302 redirects to original URLs
- ✅ **Link Management** - View, search, sort, and delete links

### User Interface
- 📊 **Dashboard** - Overview of all your short links
- 📈 **Statistics Page** - Detailed analytics for each link
- 🔍 **Search & Filter** - Find links by code or target URL
- 📋 **Copy to Clipboard** - One-click copying of short URLs
- 🎨 **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- ⚡ **Real-time Validation** - Instant feedback on form inputs

### Technical Features
- 🔄 **RESTful API** - Well-structured API endpoints
- 🗄️ **PostgreSQL Database** - Reliable data storage with Neon
- 🚀 **Production Ready** - Deployed on Render with automatic HTTPS
- 🛡️ **Error Handling** - Comprehensive error states and validation
- 📝 **Health Monitoring** - System health check endpoint

---

## 🎯 Demo Credentials

No authentication required - just visit the live URL and start creating short links!

**Try it out:**
1. Visit the dashboard
2. Enter a long URL (e.g., `https://github.com/your-profile`)
3. Optionally choose a custom code (e.g., `github1`)
4. Click "Create Short Link"
5. Share your short link!

---

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Node.js (v18+)
- Express.js - Web framework
- PostgreSQL - Database (hosted on Neon)
- @neondatabase/serverless - Database driver

**Frontend:**
- Vanilla JavaScript (ES6+)
- HTML5
- CSS3 (Custom styling, no frameworks)

**Deployment:**
- Render - Application hosting
- Neon - PostgreSQL database hosting
- GitHub - Version control

### Project Structure
```
tinylink/
├── src/
│   ├── config/
│   │   └── database-neon-http.js    # Database configuration
│   ├── models/
│   │   └── Link.js                  # Link data model
│   ├── routes/
│   │   ├── api.js                   # API endpoints
│   │   └── redirect.js              # Redirect handler
│   ├── controllers/
│   │   └── linkController.js        # Business logic
│   ├── middleware/
│   │   └── errorHandler.js          # Error handling
│   ├── utils/
│   │   └── validation.js            # Input validation
│   └── app.js                       # Express app setup
├── public/
│   ├── css/
│   │   └── styles.css               # Application styles
│   ├── js/
│   │   ├── dashboard.js             # Dashboard functionality
│   │   └── stats.js                 # Statistics page logic
│   └── index.html                   # Dashboard HTML
├── views/
│   └── stats.html                   # Statistics page HTML
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── package.json                     # Dependencies
├── server.js                        # Application entry point
└── README.md                        # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (or Neon account)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/chowhan123/TinyLink.git
cd TinyLink
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://username:password@host:5432/database
PORT=3000
BASE_URL=http://localhost:3000
NODE_ENV=development
```

4. **Set up the database**

The application will automatically create the required table on first run. The schema:
```sql
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  code VARCHAR(8) UNIQUE NOT NULL,
  target_url TEXT NOT NULL,
  total_clicks INTEGER DEFAULT 0,
  last_clicked TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

5. **Start the development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

---

## 📡 API Documentation

### Base URL
```
Production: https://tinylink.onrender.com
Local: http://localhost:3000
```

### Endpoints

#### 1. Health Check
```http
GET /healthz
```

**Response:** `200 OK`
```json
{
  "ok": true,
  "version": "1.0",
  "uptime": 123.45,
  "timestamp": "2024-11-22T10:30:00.000Z"
}
```

---

#### 2. Create Short Link
```http
POST /api/links
Content-Type: application/json
```

**Request Body:**
```json
{
  "targetUrl": "https://example.com/very-long-url",
  "customCode": "mycode"  // Optional, 6-8 alphanumeric
}
```

**Success Response:** `201 Created`
```json
{
  "code": "mycode",
  "targetUrl": "https://example.com/very-long-url",
  "shortUrl": "https://tinylink.onrender.com/mycode",
  "createdAt": "2024-11-22T10:30:00.000Z"
}
```

**Error Response:** `409 Conflict`
```json
{
  "error": "Code already exists"
}
```

**Validation Errors:** `400 Bad Request`
```json
{
  "error": "Invalid URL provided"
}
```

---

#### 3. Get All Links
```http
GET /api/links
```

**Response:** `200 OK`
```json
[
  {
    "code": "mycode",
    "targetUrl": "https://example.com/very-long-url",
    "totalClicks": 42,
    "lastClicked": "2024-11-22T15:45:00.000Z",
    "createdAt": "2024-11-22T10:30:00.000Z",
    "shortUrl": "https://tinylink.onrender.com/mycode"
  }
]
```

---

#### 4. Get Link Statistics
```http
GET /api/links/:code
```

**Response:** `200 OK`
```json
{
  "code": "mycode",
  "targetUrl": "https://example.com/very-long-url",
  "totalClicks": 42,
  "lastClicked": "2024-11-22T15:45:00.000Z",
  "createdAt": "2024-11-22T10:30:00.000Z",
  "shortUrl": "https://tinylink.onrender.com/mycode"
}
```

**Error Response:** `404 Not Found`
```json
{
  "error": "Link not found"
}
```

---

#### 5. Delete Link
```http
DELETE /api/links/:code
```

**Response:** `200 OK`
```json
{
  "message": "Link deleted successfully",
  "code": "mycode"
}
```

**Error Response:** `404 Not Found`
```json
{
  "error": "Link not found"
}
```

---

#### 6. Redirect to Target URL
```http
GET /:code
```

**Response:** `302 Found`
```
Location: https://example.com/very-long-url
```

**Error Response:** `404 Not Found`
- Shows a user-friendly error page when link doesn't exist

**Side Effects:**
- Increments `total_clicks` by 1
- Updates `last_clicked` timestamp

---

## 🎨 User Interface

### Pages

#### 1. Dashboard (`/`)
- Create new short links
- View all existing links in a table
- Search and filter links
- Sort by code, URL, clicks, or date
- Delete links
- Copy short URLs to clipboard

#### 2. Statistics Page (`/code/:code`)
- View detailed stats for a specific link
- See total clicks
- Check when link was created
- See when it was last clicked
- Copy URLs
- Delete link

#### 3. 404 Error Page
- Friendly error message when link doesn't exist
- Automatic display after link deletion

---

## 🔒 Security Features

- ✅ **URL Validation** - Validates all URLs before saving
- ✅ **Code Validation** - Ensures codes match `[A-Za-z0-9]{6,8}` pattern
- ✅ **SQL Injection Protection** - Uses parameterized queries
- ✅ **XSS Prevention** - Escapes all user input in HTML
- ✅ **Error Handling** - No sensitive information leaked in errors
- ✅ **HTTPS** - All production traffic encrypted

---

## 🚀 Deployment

### Deploy to Render

1. **Push code to GitHub**
```bash
git push origin main
```

2. **Create Web Service on Render**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Configure:
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Environment: Add environment variables

3. **Set Environment Variables**
```
DATABASE_URL = your-neon-postgresql-url
BASE_URL = https://your-app.onrender.com
NODE_ENV = production
```

4. **Deploy!**

---

## 📊 Database Schema
```sql
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  code VARCHAR(8) UNIQUE NOT NULL,
  target_url TEXT NOT NULL,
  total_clicks INTEGER DEFAULT 0,
  last_clicked TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_code ON links(code);
CREATE INDEX idx_created_at ON links(created_at);
```

---

## 📝 Code Validation Rules

### Short Codes
- Must be 6-8 characters long
- Only alphanumeric characters (A-Z, a-z, 0-9)
- Must be unique across all users
- Case-sensitive

### Target URLs
- Must be valid HTTP/HTTPS URLs
- Validated using `valid-url` package
- No length limit (stored as TEXT in database)

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@chowhan123](https://github.com/chowhan123)
- Email: Santhoshnaik6929@gmail.com
- LinkedIn: [Profile](https://www.linkedin.com/in/santhoshc1/)

---

## 🙏 Acknowledgments

- Built as part of a take-home assignment
- Inspired by bit.ly and TinyURL
- Database hosted on [Neon](https://neon.tech)
- Deployed on [Render](https://render.com)

---

**Made with ❤️ by Santhosh Naik**

Last Updated: November 2025
