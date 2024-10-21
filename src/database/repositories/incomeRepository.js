// src/database/repositories/incomeRepository.js

class IncomeRepository {
    constructor(db) {
        this.db = db;
        this.tableName = "income";
    }

    async add(income) {
        return await this.db.add(this.tableName, income);
    }

    async getById(id) {
        return await this.db.getById(this.tableName, id);
    }

    async getAll() {
        return await this.db.getAll(this.tableName);
    }

    async update(id, income) {
        return await this.db.update(this.tableName, id, income);
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

module.exports = IncomeRepository;