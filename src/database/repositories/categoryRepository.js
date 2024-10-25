// src/database/repositories/categoryRepository.js

class CategorytRepository {
    constructor(db) {
        this.db = db;
        this.tableName = "categories";
        this.budgetsTable = "budgets";
        this.conceptsTable = "concepts";
        this.subconceptsTable = "subconcepts";
        this.incomeTable = "income";
        this.expensesTable = "expenses";
        this.savingsTable = "savings";
        this.investmentsTable = "investments";
    }

    async add(category) {
        return await this.db.add(this.tableName, category);
    }

    async getById(id) {
        return await this.db.getById(this.tableName, id);
    }

    async getAll() {
        return await this.db.getAll(this.tableName);
    }

    async update(id, category) {
        return await this.db.update(this.tableName, id, category);
    }

    async delete(id) {
        return await this.db.delete(this.tableName, id);
    }

    // Method to get item by any field and value
    async getAllByField(field, value) {
        const query = { [field]: value };
        return await this.db.getAll(this.tableName, query);
    }

    // Method to get all income related to categories
    async getFinancialsByCategories() {
        // Get all categories
        const categories = await this.getAll();
    
        // Define the order of category types
        const categoryOrder = ["INCOME", "EXPENSE", "SAVING", "INVESTMENT"];
    
        // Sort categories by type based on the defined order
        categories.sort((a, b) => {
            return categoryOrder.indexOf(a.type) - categoryOrder.indexOf(b.type);
        });
    
        // Get all financial entries related to each category using getAll with a query
        const financialPromises = categories.map(async (category) => {
            const categoryType = category.type;
    
            // Initialize the financial properties
            category.income = [];
            category.expenses = [];
            category.savings = [];
            category.investments = [];
    
            // Query the budgetsTable for the current category based on its type
            const financialEntries = await this.db.getAll(this.budgetsTable, {
                category_id: category.id,
                budget_type: categoryType,
            });
    
            console.log("financialEntries", financialEntries);
    
            // For each financial entry, fetch its related concept and subconcepts
            const financialEntriesWithConcepts = await Promise.all(
                financialEntries.map(async (financialEntry) => {
                    const concept = await this.db.getById(
                        this.conceptsTable,
                        financialEntry.concept_id
                    );
    
                    const subconcepts = await Promise.all(
                        financialEntry.subconcepts.map(async (subconceptData) => {
                            const subconcept = await this.db.getById(
                                this.subconceptsTable,
                                subconceptData.id
                            );
                            return {
                                name: subconcept.name,
                                ...subconceptData,
                            };
                        })
                    );
    
                    return {
                        ...financialEntry,
                        concept: concept.name, // Add the concept to the financial entry
                        subconcepts, // Add the subconcepts to the financial entry
                    };
                })
            );
    
            // Assign entries to the appropriate category field
            if (categoryType === "INCOME") {
                category.income = financialEntriesWithConcepts;
            } else if (categoryType === "EXPENSE") {
                category.expenses = financialEntriesWithConcepts;
            } else if (categoryType === "SAVING") {
                category.savings = financialEntriesWithConcepts;
            } else if (categoryType === "INVESTMENT") {
                category.investments = financialEntriesWithConcepts;
            }
    
            return {
                category,
            };
        });
    
        return Promise.all(financialPromises);
    }
    
}

module.exports = CategorytRepository;
