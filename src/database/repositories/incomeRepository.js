// src/database/repositories/incomeRepository.js

const BaseRepository = require('./baseRepository');

class IncomeRepository extends BaseRepository {
    constructor(db) {
        super(db, 'income');
    }
}

module.exports = IncomeRepository;