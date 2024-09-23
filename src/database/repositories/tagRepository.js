// src/database/repositories/tagRepository.js

class TagRepository {
    constructor(db) {
        this.db = db;
        this.tableName = "tags";
    }

    async add(tag) {
        return await this.db.add(this.tableName, tag);
    }

    async getById(id) {
        return await this.db.getById(this.tableName, id);
    }

    async getAll() {
        return await this.db.getAll(this.tableName);
    }

    async update(id, tag) {
        return await this.db.update(this.tableName, id, tag);
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

module.exports = TagRepository;