// src/database/desktop/dbSQLite.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.join(__dirname, "budget_table.db");

class SQLiteDatabase {
    constructor() {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error("Error opening database:", err);
            } else {
                console.log("SQLite Database opened successfully");
            }
        });
    }

    async add(tableName, item) {
        const keys = Object.keys(item);
        const values = Object.values(item);
        const sql = `INSERT INTO ${tableName} (${keys.join(
            ", "
        )}) VALUES (${keys.map(() => "?").join(", ")})`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, values, function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            });
        });
    }

    async getById(tableName, id) {
        const sql = `SELECT * FROM ${tableName} WHERE id = ?`;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    async get(tableName, filter = {}) {
        let sql = `SELECT * FROM ${tableName}`;
        const values = [];
        if (Object.keys(filter).length > 0) {
            const whereClauses = Object.keys(filter).map((key) => {
                values.push(filter[key]);
                return `${key} = ?`;
            });
            sql += ` WHERE ${whereClauses.join(" AND ")}`;
        }
        sql += ` LIMIT 1`;
        return new Promise((resolve, reject) => {
            this.db.get(sql, values, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    async getAll(tableName, filter = {}) {
        let sql = `SELECT * FROM ${tableName}`;
        const values = [];
        if (Object.keys(filter).length > 0) {
            const whereClauses = Object.keys(filter).map((key) => {
                values.push(filter[key]);
                return `${key} = ?`;
            });
            sql += ` WHERE ${whereClauses.join(" AND ")}`;
        }
        return new Promise((resolve, reject) => {
            this.db.all(sql, values, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    async update(tableName, id, item) {
        const keys = Object.keys(item);
        const values = Object.values(item);
        const sql = `UPDATE ${tableName} SET ${keys
            .map((key) => `${key} = ?`)
            .join(", ")} WHERE id = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [...values, id], function (err) {
                if (err) reject(err);
                else resolve({ id: this.changes });
            });
        });
    }

    async delete(tableName, id) {
        const sql = `DELETE FROM ${tableName} WHERE id = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [id], function (err) {
                if (err) reject(err);
                else resolve({ id: this.changes });
            });
        });
    }
}

const sqliteDB = new SQLiteDatabase();
module.exports = sqliteDB;