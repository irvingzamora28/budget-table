// src/database/desktop/dbSQLiteSetup.js
const db = require("./dbSQLite");

const createTables = async () => {
    try {
        if (db && typeof db.serialize === "function") {
            await db.serialize(() => {
                // Users Table
                db.run(`
                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT NOT NULL,
                        email TEXT UNIQUE NOT NULL,
                        password TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                `);

                // Categories Table
                db.run(`
                    CREATE TABLE IF NOT EXISTS categories (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        user_id INTEGER,
                        is_predefined BOOLEAN NOT NULL,
                        FOREIGN KEY(user_id) REFERENCES users(id)
                    );
                `);

                // Concepts Table
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

                // Subconcepts Table
                db.run(`
                    CREATE TABLE IF NOT EXISTS subconcepts (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        user_id INTEGER,
                        concept_id INTEGER,
                        FOREIGN KEY(user_id) REFERENCES users(id),
                        FOREIGN KEY(concept_id) REFERENCES concepts(id)
                    );
                `);

                // Budgets Table
                db.run(`
                    CREATE TABLE IF NOT EXISTS budgets (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        start_date TEXT,
                        end_date TEXT,
                        month_year TEXT,
                        year INTEGER,
                        total_income REAL,
                        total_expenses REAL,
                        total_savings REAL,
                        FOREIGN KEY(user_id) REFERENCES users(id)
                    );
                `);

                // Income Table
                db.run(`
                    CREATE TABLE IF NOT EXISTS income (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        budget_id INTEGER NOT NULL,
                        concept_id INTEGER NOT NULL,
                        amount REAL NOT NULL,
                        date TEXT NOT NULL,
                        FOREIGN KEY(user_id) REFERENCES users(id),
                        FOREIGN KEY(budget_id) REFERENCES budgets(id),
                        FOREIGN KEY(concept_id) REFERENCES concepts(id)
                    );
                `);

                // Expenses Table
                db.run(`
                    CREATE TABLE IF NOT EXISTS expenses (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        budget_id INTEGER NOT NULL,
                        concept_id INTEGER NOT NULL,
                        amount REAL NOT NULL,
                        date TEXT NOT NULL,
                        is_constant BOOLEAN NOT NULL DEFAULT 0,
                        FOREIGN KEY(user_id) REFERENCES users(id),
                        FOREIGN KEY(budget_id) REFERENCES budgets(id),
                        FOREIGN KEY(concept_id) REFERENCES concepts(id)
                    );
                `);

                // Savings Table
                db.run(`
                    CREATE TABLE IF NOT EXISTS savings (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        budget_id INTEGER NOT NULL,
                        account_name TEXT NOT NULL,
                        amount REAL NOT NULL,
                        date TEXT NOT NULL,
                        FOREIGN KEY(user_id) REFERENCES users(id),
                        FOREIGN KEY(budget_id) REFERENCES budgets(id)
                    );
                `);

                // Investments Table
                db.run(`
                    CREATE TABLE IF NOT EXISTS investments (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        budget_id INTEGER NOT NULL,
                        investment_name TEXT NOT NULL,
                        amount REAL NOT NULL,
                        date TEXT NOT NULL,
                        FOREIGN KEY(user_id) REFERENCES users(id),
                        FOREIGN KEY(budget_id) REFERENCES budgets(id)
                    );
                `);

                // Loans Table
                db.run(`
                  CREATE TABLE IF NOT EXISTS loans (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        budget_id INTEGER NOT NULL,
                        loan_name TEXT NOT NULL,
                        amount REAL NOT NULL,
                        interest_rate REAL NOT NULL,
                        start_date TEXT NOT NULL,
                        end_date TEXT NOT NULL,
                        FOREIGN KEY(user_id) REFERENCES users(id),
                        FOREIGN KEY(budget_id) REFERENCES budgets(id)
                    );
                `);

                // Goals Table
                db.run(`
                  CREATE TABLE IF NOT EXISTS goals (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        budget_id INTEGER NOT NULL,
                        goal_name TEXT NOT NULL,
                        target_amount REAL NOT NULL,
                        current_amount REAL NOT NULL,
                        start_date TEXT NOT NULL,
                        end_date TEXT NOT NULL,
                        FOREIGN KEY(user_id) REFERENCES users(id),
                        FOREIGN KEY(budget_id) REFERENCES budgets(id)
                    );
                `);

                // Assets Table
                db.run(`
                  CREATE TABLE IF NOT EXISTS assets (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        budget_id INTEGER NOT NULL,
                        asset_name TEXT NOT NULL,
                        amount REAL NOT NULL,
                        date TEXT NOT NULL,
                        FOREIGN KEY(user_id) REFERENCES users(id),
                        FOREIGN KEY(budget_id) REFERENCES budgets(id)
                    );
                `);

                // Liabilities Table
                db.run(`
                  CREATE TABLE IF NOT EXISTS liabilities (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        budget_id INTEGER NOT NULL,
                        liability_name TEXT NOT NULL,
                        amount REAL NOT NULL,
                        date TEXT NOT NULL,
                        FOREIGN KEY(user_id) REFERENCES users(id),
                        FOREIGN KEY(budget_id) REFERENCES budgets(id)
                    );
                `);

                // Reports Table
                db.run(`
                  CREATE TABLE IF NOT EXISTS reports (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        budget_id INTEGER NOT NULL,
                        report_name TEXT NOT NULL,
                        report_type TEXT NOT NULL,
                        report_date TEXT NOT NULL,
                        FOREIGN KEY(user_id) REFERENCES users(id),
                        FOREIGN KEY(budget_id) REFERENCES budgets(id)
                    );
                `);

                // Tags Table
                db.run(`
                    CREATE TABLE IF NOT EXISTS tags (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        name TEXT NOT NULL,
                        description TEXT NOT NULL,
                        color TEXT NOT NULL,
                        FOREIGN KEY(user_id) REFERENCES users(id)
                    );
                `);

                // Settings Table
                db.run(`
                  CREATE TABLE IF NOT EXISTS settings (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        budget_id INTEGER NOT NULL,
                        setting_name TEXT NOT NULL,
                        setting_value TEXT NOT NULL,
                        FOREIGN KEY(user_id) REFERENCES users(id),
                        FOREIGN KEY(budget_id) REFERENCES budgets(id)
                    );
                `);

                console.log("All tables created successfully!");
            });
        } else {
            console.error(
                "SQLite database not initialized or db.serialize is not a function. (Web is being used)"
            );
        }
    } catch (error) {
        console.error("Error creating tables:", error);
    }
};

module.exports = createTables;
