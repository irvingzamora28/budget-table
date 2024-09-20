// src/database/dbAccessLayer.js
const UserRepository = require('./repositories/userRepository');
// Import other repositories as needed

let db;
if (typeof window !== 'undefined' && window.indexedDB) {
  // Web: Use IndexedDB
  db = require('./web/dbIndexedDB').default;
} else if (typeof process !== 'undefined' && process.versions && process.versions.electron) {
  // Desktop (Electron): Use SQLite
  db = require('./desktop/dbSQLite');
}

const userRepo = new UserRepository(db);
// Initialize other repositories

module.exports = {
    userRepo: userRepo,
  // Export other repositories
};