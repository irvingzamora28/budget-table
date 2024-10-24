// src/database/repositories/expenseRepository.js

class ExpenseRepository {
    constructor(db) {
        this.db = db;
        this.tableName = "expenses";
    }

    async add(expense) {
        return await this.db.add(this.tableName, expense);
    }

    async getById(id) {
        return await this.db.getById(this.tableName, id);
    }

    async getAll() {
        return await this.db.getAll(this.tableName);
    }

    async update(id, expense) {
        return await this.db.update(this.tableName, id, expense);
    }

    async delete(id) {
        return await this.db.delete(this.tableName, id);
    }

    // Method to get item by any field and value
    async getAllByField(field, value) {
        const query = { [field]: value };
        return await this.db.getAll(this.tableName, query);
    }
}

module.exports = ExpenseRepository;