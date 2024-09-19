const sqlite3 = require('sqlite3').verbose();
const { get } = require('http');
const path = require('path');
const dbPath = path.join(__dirname, 'budget_table.db');

// Create or open the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('SQLite Database opened successfully');
  }
});

// Users
const addUser = (user) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [user.username, user.email, user.password],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

const getUser = (userId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const getUsers = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM users', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Categories
const addCategory = (category) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO categories (name, user_id) VALUES (?, ?)',
      [category.name, category.user_id],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

const getCategories = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM categories', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Similar functions for concepts, income, expenses
const addConcept = (concept) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO concepts (name, user_id, category_id) VALUES (?, ?, ?)',
      [concept.name, concept.user_id, concept.category_id],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

const getConcepts = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM concepts', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const addIncome = (income) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO income (amount, concept_id) VALUES (?, ?)',
      [income.amount, income.concept_id],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

const getIncome = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM income', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const addExpense = (expense) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO expenses (amount, concept_id) VALUES (?, ?)',
      [expense.amount, expense.concept_id],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};


const getExpenses = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM expenses', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};


module.exports = {
    db,
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
