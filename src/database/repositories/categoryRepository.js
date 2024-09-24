// src/database/repositories/categoryRepository.js

class ConceptRepository {
    constructor(db) {
        this.db = db;
        this.tableName = "categories";
    }

    async add(category) {
        return await this.db.add(this.tableName, category);
    }

    async getById(id) {
        return await this.db.getById(this.tableName, id);
    }

    async getAll() {
        return await this.db.getAll(this.tableName);
    }

    async update(id, category) {
        return await this.db.update(this.tableName, id, category);
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

module.exports = ConceptRepository;