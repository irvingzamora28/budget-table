// src/database/repositories/baseRepository.js

class BaseRepository {
    constructor(db, tableName) {
        this.db = db;
        this.tableName = tableName;
    }

    async add(item) {
        return await this.db.add(this.tableName, item);
    }

    async getById(id) {
        return await this.db.getById(this.tableName, id);
    }

    async getAll(query = {}) {
        return await this.db.getAll(this.tableName, query);
    }

    async update(id, item) {
        return await this.db.update(this.tableName, id, item);
    }

    async delete(id) {
        return await this.db.delete(this.tableName, id);
    }

    async getAllByField(field, value) {
        const query = { [field]: value };
        return await this.db.getAll(this.tableName, query);
    }
}

module.exports = BaseRepository;
