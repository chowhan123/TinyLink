const { Pool } = require('pg');

// Validate environment variable
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in .env file!');
  console.error('Please add your Neon connection string to .env');
  process.exit(1);
}

console.log('🔗 Connecting to Neon PostgreSQL...');
console.log('📍 Database host:', process.env.DATABASE_URL.split('@')[1]?.split('/')[0] || 'unknown');

// Pool configuration with optimized settings for Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  // Neon-specific optimizations
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000, // Increased timeout
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000
});

// Connection event handlers
pool.on('connect', (client) => {
  console.log('✅ New database connection established');
});

pool.on('error', (err, client) => {
  console.error('❌ Unexpected database error:', err.message);
});

pool.on('remove', (client) => {
  console.log('🔌 Database connection removed from pool');
});

const initializeDatabase = async () => {
  console.log('⏳ Initializing database...');
  
  let retries = 3;
  let client;
  
  while (retries > 0) {
    try {
      console.log(`🔄 Attempt ${4 - retries}/3...`);
      client = await pool.connect();
      console.log('✅ Connection established successfully!');
      
      console.log('📊 Creating tables...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS links (
          id SERIAL PRIMARY KEY,
          code VARCHAR(8) UNIQUE NOT NULL,
          target_url TEXT NOT NULL,
          total_clicks INTEGER DEFAULT 0,
          last_clicked TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Verify table creation
      const tableCheck = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'links'
      `);
      
      if (tableCheck.rows.length > 0) {
        console.log('✅ Table "links" verified');
      }
      
      // Check existing records
      const countResult = await client.query('SELECT COUNT(*) as count FROM links');
      console.log(`📝 Current links in database: ${countResult.rows[0].count}`);
      
      console.log('✅ Database initialized successfully!\n');
      return;
      
    } catch (error) {
      retries--;
      console.error(`❌ Connection attempt failed: ${error.message}`);
      
      if (retries > 0) {
        console.log(`⏳ Retrying in 2 seconds... (${retries} attempts left)\n`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.error('\n❌ Failed to connect after 3 attempts');
        console.error('\n🔍 Troubleshooting steps:');
        console.error('1. Check your Neon dashboard - is the project active?');
        console.error('2. Verify DATABASE_URL in .env is correct');
        console.error('3. Make sure you copied the POOLED connection string');
        console.error('4. Try disabling VPN/Proxy if you\'re using one');
        console.error('5. Check Windows Firewall settings');
        console.error('6. Try from a different network (mobile hotspot)\n');
        throw error;
      }
    } finally {
      if (client) {
        client.release();
      }
    }
  }
};

// Test connection function
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as version');
    console.log('✅ Connection test successful!');
    console.log('⏰ Database time:', result.rows[0].current_time);
    console.log('📦 PostgreSQL version:', result.rows[0].version.split(',')[0]);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    return false;
  }
};

module.exports = { pool, initializeDatabase, testConnection };