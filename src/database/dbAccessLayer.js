// src/database/dbAccessLayer.js
const UserRepository = require('./repositories/userRepository');
const TagRepository = require('./repositories/tagRepository');
const ConceptRepository = require('./repositories/conceptRepository');
const CategoryRepository = require('./repositories/categoryRepository');
const SubconceptRepository = require('./repositories/subconceptRepository');
const IncomeRepository = require('./repositories/incomeRepository');
const ExpenseRepository = require('./repositories/expenseRepository');
const BudgetRepository = require('./repositories/budgetRepository');

let db;
if (typeof window !== 'undefined' && window.indexedDB) {
  // Web: Use IndexedDB
  db = require('./web/dbIndexedDB').default;
} else if (typeof process !== 'undefined' && process.versions && process.versions.electron) {
  // Desktop (Electron): Use SQLite
  db = require('./desktop/dbSQLite');
}

const userRepo = new UserRepository(db);
const tagRepo = new TagRepository(db);
const subconceptRepo = new SubconceptRepository(db);
const conceptRepo = new ConceptRepository(db);
const categoryRepo = new CategoryRepository(db);
const incomeRepo = new IncomeRepository(db);
const expenseRepo = new ExpenseRepository(db);
const budgetRepo = new BudgetRepository(db);
module.exports = {
    userRepo: userRepo,
    tagRepo: tagRepo,
    conceptRepo: conceptRepo,
    subconceptRepo: subconceptRepo,
    categoryRepo: categoryRepo,
    incomeRepo: incomeRepo,
    expenseRepo: expenseRepo,
    budgetRepo: budgetRepo,
};