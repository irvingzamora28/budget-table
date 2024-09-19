const db = require("./dbSQLite");

const createTables = async () => {
    try {
        await db.serialize(() => {
            db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

            db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        user_id INTEGER,
        is_predefined BOOLEAN NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
    `);

            db.run(`
      CREATE TABLE IF NOT EXISTS concepts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        user_id INTEGER,
        category_id INTEGER,
        is_predefined BOOLEAN NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(category_id) REFERENCES categories(id)
      );
    `);

            // Add other table creation statements like "budgets", "expenses", etc.
        });
    } catch (error) {
        console.error("Error creating tables:", error);
    }
};

module.exports = createTables;
