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
}
