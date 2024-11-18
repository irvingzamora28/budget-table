// services/BudgetService.js
const { budgetRepo } = require("../database/dbAccessLayer");

class BudgetService {
    prepareSubconcepts(
        updatedSubconcepts,
        existingSubconcepts = [],
        months,
        quantity = 0
    ) {
        const emptyMonthData = months.reduce((acc, month) => {
            acc[month] = quantity; // Apply the quantity to all months for new subconcepts
            return acc;
        }, {});

        return updatedSubconcepts.map((updatedSubconcept) => {
            const existingSubconcept = existingSubconcepts.find(
                (sub) => sub.id === updatedSubconcept.id
            );

            if (existingSubconcept) {
                return {
                    ...updatedSubconcept,
                    concept_id: existingSubconcept.concept_id, // Ensure concept_id is retained
                    id: existingSubconcept.id, // Ensure id is retained
                    ...months.reduce((acc, month) => {
                        acc[month] = existingSubconcept[month] || 0;
                        return acc;
                    }, {}),
                };
            } else {
                return {
                    ...updatedSubconcept,
                    concept_id: updatedSubconcept.concept_id, // Set concept_id for new subconcepts
                    id: updatedSubconcept.id || null, // Set id to null for new subconcepts
                    ...emptyMonthData,
                };
            }
        });
    }

    async createBudget(budgetData, months, quantity = 0) {
        const { concept_id, category_id, concept, budget_type, subconcepts } =
            budgetData;

        const budget = {
            concept_id,
            category_id,
            concept,
            budget_type,
            ...months.reduce((acc, month) => {
                acc[month] = quantity; // Apply quantity to all months for the budget
                return acc;
            }, {}),
            subconcepts: this.prepareSubconcepts(
                subconcepts,
                [],
                months,
                quantity
            ),
        };

        const budgetId = await budgetRepo.add(budget);
        budget.id = budgetId.id;
        return budget;
    }

    async updateBudget(budgetId, budgetData, months) {
        const { concept_id, category_id, concept, budget_type, subconcepts } =
            budgetData;

        const existingBudget = await budgetRepo.getById(budgetId);

        const updatedBudget = {
            ...existingBudget,
            concept_id,
            category_id,
            concept,
            budget_type,
            ...months.reduce((acc, month) => {
                acc[month] = budgetData[month] || existingBudget[month] || 0;
                return acc;
            }, {}),
            subconcepts: this.prepareSubconcepts(
                subconcepts,
                existingBudget.subconcepts || [],
                months
            ),
        };

        await budgetRepo.update(budgetId, updatedBudget);

        return updatedBudget;
    }
}

module.exports = new BudgetService();
