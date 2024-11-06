// src/database/repositories/subconceptRepository.js

const BaseRepository = require('./baseRepository');

class SubconceptRepository extends BaseRepository {
    constructor(db) {
        super(db, 'subconcepts');
    }

    async getByConceptId(conceptId) {
        // Fetch subconcepts directly by concept_id
        const query = { concept_id: conceptId };
        return await this.db.getAll(this.tableName, query);
    }

}

module.exports = SubconceptRepository;
