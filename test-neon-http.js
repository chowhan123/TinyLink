require('dotenv').config();

// Polyfill fetch if needed
if (typeof global.fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

console.log('Testing Neon HTTP Connection...\n');

const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

(async () => {
  try {
    console.log('Attempting connection via HTTP...\n');
    
    const result = await sql`SELECT NOW() as time, version() as version`;
    
    console.log('✅ Connected successfully via HTTP!\n');
    console.log('Database time:', result[0].time);
    console.log('PostgreSQL:', result[0].version.split(',')[0]);
    console.log('\n✅ Test completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed!');
    console.error('Error:', err.message);
    console.error('\nDetails:', err);
    process.exit(1);
  }
})();