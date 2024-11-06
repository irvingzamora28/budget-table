// src/database/repositories/userRepository.js

const BaseRepository = require('./baseRepository');

class UserRepository extends BaseRepository {
    constructor(db) {
        super(db, 'users');
    }

    async getByEmail(email) {
        return await this.db.get(this.tableName, { email });
    }

    async getUserWithRelatedData(userId) {
        const user = await this.getById(userId);
        if (!user) return null;

        const [categories, concepts, income, expenses] = await Promise.all([
            this.db.getAll("categories", { user_id: userId }),
            this.db.getAll("concepts", { user_id: userId }),
            this.db.getAll("income", { user_id: userId }),
            this.db.getAll("expenses", { user_id: userId }),
            this.db.getAll("savings", { user_id: userId }),
            this.db.getAll("investments", { user_id: userId }),
            this.db.getAll("loans", { user_id: userId }),
            this.db.getAll("assets", { user_id: userId }),
            this.db.getAll("budgets", { user_id: userId }),
            this.db.getAll("goals", { user_id: userId }),
            this.db.getAll("notifications", { user_id: userId }),
            this.db.getAll("settings", { user_id: userId }),
            this.db.getAll("reports", { user_id: userId }),
        ]);

        return {
            ...user,
            categories,
            concepts,
            income,
            expenses,
        };
    }

    async getUserWithOneRelatedData(userId, dataName) {
        const user = await this.getById(userId);
        if (!user) return null;

        const [relatedData] = await Promise.all([
            this.db.getAll(dataName, { user_id: userId }),
        ]);

        return {
            ...user,
            relatedData,
        };
    }
}

module.exports = UserRepository;
