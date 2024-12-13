const { categoryRepo, conceptRepo, budgetRepo, subconceptRepo } = require("../database/dbAccessLayer");
const ConceptService = require("./ConceptService");
const BudgetService = require("./BudgetService");

class CategoryService {
    async updateCategoryTitle(categoryId, newTitle) {
        try {
            const updatedCategory = await categoryRepo.update(categoryId, { name: newTitle });
            return updatedCategory;
        } catch (error) {
            console.error("Error updating category title:", error);
            throw error;
        }
    }

    async addConceptToCategory(categoryId, conceptName, budgetType, subconcepts = []) {
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        
        try {
            const newConcept = await ConceptService.createConcept({
                name: conceptName,
                description: "",
                category_id: categoryId,
                subconcepts: subconcepts,
            });

            // Ensure subconcepts have all necessary properties
            const formattedSubconcepts = subconcepts.map(subconcept => ({
                ...subconcept,
                concept_id: newConcept.id,
                Jan: "0",
                Feb: "0",
                Mar: "0",
                Apr: "0",
                May: "0",
                Jun: "0",
                Jul: "0",
                Aug: "0",
                Sep: "0",
                Oct: "0",
                Nov: "0",
                Dec: "0",
            }));

            // Create the budget
            const newBudget = await BudgetService.createBudget(
                {
                    concept_id: newConcept.id,
                    category_id: newConcept.category_id,
                    concept: newConcept.name,
                    budget_type: budgetType,
                    Jan: "0",
                    Feb: "0",
                    Mar: "0",
                    Apr: "0",
                    May: "0",
                    Jun: "0",
                    Jul: "0",
                    Aug: "0",
                    Sep: "0",
                    Oct: "0",
                    Nov: "0",
                    Dec: "0",
                    subconcepts: formattedSubconcepts,
                },
                months
            );

            return { newConcept, newBudget };
        } catch (error) {
            console.error("Error adding concept to category:", error);
            throw error;
        }
    }

    async deleteConceptFromCategory(conceptId) {
        try {
            // Delete the associated budget
            await BudgetService.deleteBudgetByConceptId(conceptId);
            // Delete the concept
            await ConceptService.deleteConcept(conceptId);
        } catch (error) {
            console.error("Error deleting concept from category:", error);
            throw error;
        }
    }

    async addSubconceptToConcept(conceptId, subconceptName) {
        try {
            const newSubconcept = await subconceptRepo.add({ name: subconceptName, concept_id: conceptId });
            const updatedConcept = await conceptRepo.getByIdWithSubconcepts(conceptId);

            // Ensure the new subconcept has all necessary properties
            const formattedSubconcept = {
                ...newSubconcept,
                concept_id: conceptId,
                name: subconceptName,
                Jan: "0",
                Feb: "0",
                Mar: "0",
                Apr: "0",
                May: "0",
                Jun: "0",
                Jul: "0",
                Aug: "0",
                Sep: "0",
                Oct: "0",
                Nov: "0",
                Dec: "0",
            };

            // Update the budget with the new subconcept
            const budget = await budgetRepo.getByConceptAndCategoryId(conceptId, updatedConcept.category_id);
            budget.subconcepts.push(formattedSubconcept);
            await budgetRepo.update(budget.id, budget);

            return updatedConcept;
        } catch (error) {
            console.error("Error adding subconcept to concept:", error);
            throw error;
        }
    }

    async deleteSubconceptFromConcept(conceptId, subconceptId) {
        try {
            await subconceptRepo.delete(subconceptId);
            const updatedConcept = await conceptRepo.getByIdWithSubconcepts(conceptId);

            // Update the budget by removing the deleted subconcept
            const budget = await budgetRepo.getByConceptAndCategoryId(conceptId, updatedConcept.category_id);
            budget.subconcepts = budget.subconcepts.filter(sub => sub.id !== subconceptId);
            await budgetRepo.update(budget.id, budget);

            return updatedConcept;
        } catch (error) {
            console.error("Error deleting subconcept from concept:", error);
            throw error;
        }
    }
}

module.exports = new CategoryService();