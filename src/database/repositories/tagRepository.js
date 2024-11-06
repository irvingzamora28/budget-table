// src/database/repositories/tagRepository.js

const BaseRepository = require('./baseRepository');

class TagRepository extends BaseRepository {
    constructor(db) {
        super(db, 'tags');
    }
}

module.exports = TagRepository;