import { openDB } from 'idb';

const dbPromise = openDB('budget-table', 1, {
  upgrade(db) {
    db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('concepts', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('income', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
  },
});

const addUser = async (user) => {
  const db = await dbPromise;
  const tx = db.transaction('users', 'readwrite');
  await tx.objectStore('users').add(user);
  await tx.done;
};

const getUser = async (userId) => {
  const db = await dbPromise;
  return db.transaction('users').objectStore('users').get(userId);
};

const getUsers = async () => {
  const db = await dbPromise;
  return db.transaction('users').objectStore('users').getAll();
};

const addCategory = async (category) => {
  const db = await dbPromise;
  const tx = db.transaction('categories', 'readwrite');
  await tx.objectStore('categories').add(category);
  await tx.done;
};

const getCategories = async () => {
  const db = await dbPromise;
  return db.transaction('categories').objectStore('categories').getAll();
};

// Repeat similar logic for concepts, income, and expenses.
const addConcept = async (concept) => {
  const db = await dbPromise;
  const tx = db.transaction('concepts', 'readwrite');
  await tx.objectStore('concepts').add(concept);
  await tx.done;
};

const getConcepts = async () => {
  const db = await dbPromise;
  return db.transaction('concepts').objectStore('concepts').getAll();
};

const addIncome = async (income) => {
  const db = await dbPromise;
  const tx = db.transaction('income', 'readwrite');
  await tx.objectStore('income').add(income);
  await tx.done;
};

const getIncome = async () => {
  const db = await dbPromise;
  return db.transaction('income').objectStore('income').getAll();
};

const addExpense = async (expense) => {
  const db = await dbPromise;
  const tx = db.transaction('expenses', 'readwrite');
  await tx.objectStore('expenses').add(expense);
  await tx.done;
};

const getExpenses = async () => {
  const db = await dbPromise;
  return db.transaction('expenses').objectStore('expenses').getAll();
};


export {
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
  getExpenses
};
