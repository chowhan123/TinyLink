const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set in .env file!');
  process.exit(1);
}

console.log('Connecting to Neon via HTTP (Serverless Driver)...');

// Configure with fetch options
const sql = neon(process.env.DATABASE_URL, {
  fetchOptions: {
    cache: 'no-store',
  },
  fullResults: false,
});

const initializeDatabase = async () => {
  console.log('⏳ Initializing database via HTTP...');
  
  try {
    // Test connection first
    console.log('Testing connection...');
    const testResult = await sql`SELECT 1 as test`;
    console.log('✅ Connection successful!');
    
    // Create table
    await sql`
      CREATE TABLE IF NOT EXISTS links (
        id SERIAL PRIMARY KEY,
        code VARCHAR(8) UNIQUE NOT NULL,
        target_url TEXT NOT NULL,
        total_clicks INTEGER DEFAULT 0,
        last_clicked TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('✅ Table created/verified');
    
    const count = await sql`SELECT COUNT(*) as count FROM links`;
    console.log(`📝 Current links in database: ${count[0].count}`);
    
    console.log('✅ Database initialized successfully!\n');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.error('Full error:', error);
    throw error;
  }
};

module.exports = { sql, initializeDatabase };