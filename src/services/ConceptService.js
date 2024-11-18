// services/ConceptService.js
const { conceptRepo } = require("../database/dbAccessLayer");

class ConceptService {
    // Create a new concept
    async createConcept(conceptData) {
        const { name, description, category_id, subconcepts } = conceptData;

        // Add the concept
        const addedConcept = await conceptRepo.add({
            name,
            description,
            category_id,
            subconcepts,
        });

        // Fetch the created concept with subconcepts
        return await conceptRepo.getByIdWithSubconcepts(addedConcept.id);
    }

    // Update an existing concept
    async updateConcept(conceptId, conceptData) {
        const { name, category_id, subconcepts } = conceptData;

        // Update the concept
        await conceptRepo.update(conceptId, {
            name,
            category_id,
            subconcepts,
        });

        // Fetch the updated concept with subconcepts
        return await conceptRepo.getByIdWithSubconcepts(conceptId);
    }
}

module.exports = new ConceptService();
