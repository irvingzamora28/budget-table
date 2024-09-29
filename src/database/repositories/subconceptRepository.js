// src/database/repositories/subconceptRepository.js

class SubconceptRepository {
    constructor(db) {
        this.db = db;
        this.tableName = "subconcepts";
    }

    async add(subconcept) {
        return await this.db.add(this.tableName, subconcept);
    }

    async getById(id) {
        return await this.db.getById(this.tableName, id);
    }

    async getByConceptId(conceptId) {
        // Fetch subconcepts directly by concept_id
        const query = { concept_id: conceptId };
        return await this.db.getAll(this.tableName, query);
    }

    async getAll() {
        return await this.db.getAll(this.tableName);
    }

    async update(id, subconcept) {
        return await this.db.update(this.tableName, id, subconcept);
    }

    async delete(id) {
        return await this.db.delete(this.tableName, id);
    }

    // Method to get items by any field and value
    async getAllByField(field, value) {
        const query = { [field]: value };
        return await this.db.getAll(this.tableName, query);
    }
}

module.exports = SubconceptRepository;
