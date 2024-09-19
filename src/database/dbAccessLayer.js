let db;
if (typeof window !== 'undefined' && window.indexedDB) {
    // Web: Use IndexedDB
    db = require('./web/dbIndexedDB'); // Web-specific db file
  } else if (typeof process !== 'undefined' && process.versions && process.versions.electron) {
    // Desktop (Electron): Use SQLite
    const { db: sqliteDB } = require('./desktop/dbSQLite');
    db = sqliteDB;
  }

// Unified interface for Users
const addUser = async (user) => {
  return db.addUser(user);
};

const getUser = async (userId) => {
  return db.getUser(userId);
};

const getUsers = async () => {
  return db.getUsers();
};

// Unified interface for Categories
const addCategory = async (category) => {
  return db.addCategory(category);
};

const getCategories = async () => {
  return db.getCategories();
};

// Unified interface for Concepts
const addConcept = async (concept) => {
  return db.addConcept(concept);
};

const getConcepts = async () => {
  return db.getConcepts();
};

// Unified interface for Income
const addIncome = async (income) => {
  return db.addIncome(income);
};

const getIncome = async () => {
  return db.getIncome();
};

// Unified interface for Expenses
const addExpense = async (expense) => {
  return db.addExpense(expense);
};

const getExpenses = async () => {
  return db.getExpenses();
};

module.exports = {
  addUser,
  getUser,
  getUsers,
  addCategory,
  getCategories,
  addConcept,
  getConcepts,
  addIncome,
  getIncome,
  addExpense,
  getExpenses,
};
