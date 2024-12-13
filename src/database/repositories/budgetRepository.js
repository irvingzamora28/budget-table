// src/database/repositories/budgetRepository.js

const BaseRepository = require('./baseRepository');

class BudgetRepository extends BaseRepository {
    constructor(db) {
        super(db, 'budgets');
    }

    async deleteByConceptId(conceptId) {
        try {
            await this.db.delete(this.tableName, { concept_id: conceptId });
        } catch (error) {
            console.error("Error deleting budget by concept ID:", error);
            throw error;
        }
    }

    async getByConceptAndCategoryId(conceptId, categoryId) {
        try {
            const budget = await this.db.get(this.tableName, { concept_id: conceptId, category_id: categoryId });
            return budget;
        } catch (error) {
            console.error("Error fetching budget by concept and category ID:", error);
            throw error;
        }
    }
}

module.exports = BudgetRepository;
