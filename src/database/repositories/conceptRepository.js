// src/database/repositories/conceptRepository.js

class ConceptRepository {
    constructor(db) {
        this.db = db;
        this.tableName = "concepts";
    }

    async add(concept) {
        return await this.db.add(this.tableName, concept);
    }

    async getById(id) {
        return await this.db.getById(this.tableName, id);
    }

    async getAll() {
        return await this.db.getAll(this.tableName);
    }

    async update(id, concept) {
        return await this.db.update(this.tableName, id, concept);
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