// src/database/repositories/userRepository.js

class UserRepository {
    constructor(db) {
      this.db = db;
      this.tableName = 'users';
    }
  
    async add(user) {
      return await this.db.add(this.tableName, user);
    }
  
    async getById(id) {
      return await this.db.getById(this.tableName, id);
    }

    async getByEmail(email) {
      return await this.db.get(this.tableName, { email });
    }
  
    async getAll() {
      return await this.db.getAll(this.tableName);
    }
  
    async update(id, user) {
      return await this.db.update(this.tableName, id, user);
    }
  
    async delete(id) {
      return await this.db.delete(this.tableName, id);
    }
  
    async getUserWithRelatedData(userId) {
      const user = await this.getById(userId);
      if (!user) return null;
  
      const [categories, concepts, income, expenses] = await Promise.all([
        this.db.getAll('categories', { user_id: userId }),
        this.db.getAll('concepts', { user_id: userId }),
        this.db.getAll('income', { user_id: userId }),
        this.db.getAll('expenses', { user_id: userId }),
        this.db.getAll('savings', { user_id: userId }),
        this.db.getAll('investments', { user_id: userId }),
        this.db.getAll('loans', { user_id: userId }),
        this.db.getAll('assets', { user_id: userId }),
        this.db.getAll('budgets', { user_id: userId }),
        this.db.getAll('goals', { user_id: userId }),
        this.db.getAll('notifications', { user_id: userId }),
        this.db.getAll('settings', { user_id: userId }),
        this.db.getAll('reports', { user_id: userId }),
      ]);
  
      return {
        ...user,
        categories,
        concepts,
        income,
        expenses
      };
    }
  }
  
  module.exports = UserRepository;