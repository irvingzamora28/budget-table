// src/database/repositories/expenseRepository.js

const BaseRepository = require('./baseRepository');

class ExpenseRepository extends BaseRepository {
    constructor(db) {
        super(db, 'expenses');
    }
}

module.exports = ExpenseRepository;