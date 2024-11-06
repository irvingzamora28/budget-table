// src/database/repositories/budgetRepository.js

const BaseRepository = require('./baseRepository');

class BudgetRepository extends BaseRepository {
    constructor(db) {
        super(db, 'budgets');
    }

}

module.exports = BudgetRepository;
