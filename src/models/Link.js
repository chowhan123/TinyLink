const { sql } = require('../config/database-neon-http');

class Link {
  static async create(code, targetUrl) {
    const result = await sql`
      INSERT INTO links (code, target_url)
      VALUES (${code}, ${targetUrl})
      RETURNING *
    `;
    return result[0];
  }

  static async findAll() {
    const result = await sql`
      SELECT * FROM links
      ORDER BY created_at DESC
    `;
    return result;
  }

  static async findByCode(code) {
    const result = await sql`
      SELECT * FROM links 
      WHERE code = ${code}
    `;
    return result[0];
  }

  static async incrementClicks(code) {
    const result = await sql`
      UPDATE links
      SET total_clicks = total_clicks + 1,
          last_clicked = CURRENT_TIMESTAMP
      WHERE code = ${code}
      RETURNING *
    `;
    return result[0];
  }

  static async delete(code) {
    const result = await sql`
      DELETE FROM links 
      WHERE code = ${code} 
      RETURNING *
    `;
    return result[0];
  }

  static async codeExists(code) {
    const result = await sql`
      SELECT EXISTS(SELECT 1 FROM links WHERE code = ${code})
    `;
    return result[0].exists;
  }
}

module.exports = Link;