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
            // Create the budget
            const newBudget = await BudgetService.createBudget(
                {
                    concept_id: newConcept.id,
                    category_id: newConcept.category_id,
                    concept: newConcept.name,
                    budget_type: budgetType,
                    subconcepts: newConcept.subconcepts,
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
            return updatedConcept;
        } catch (error) {
            console.error("Error deleting subconcept from concept:", error);
            throw error;
        }
    }
}

module.exports = new CategoryService();