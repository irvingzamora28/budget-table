// services/ConceptService.js
const { conceptRepo, subconceptRepo } = require("../database/dbAccessLayer");

class ConceptService {
    // Create a new concept
    async createConcept(conceptData) {
        const { name, description, category_id, subconcepts } = conceptData;

        const addedConcept = await conceptRepo.add({
            name,
            description,
            category_id,
            subconcepts,
        });

        return await conceptRepo.getByIdWithSubconcepts(addedConcept.id);
    }

    // Update an existing concept
    async updateConcept(conceptId, conceptData) {
        const { name, category_id, subconcepts } = conceptData;

        await conceptRepo.update(conceptId, {
            name,
            category_id,
            subconcepts,
        });

        return await conceptRepo.getByIdWithSubconcepts(conceptId);
    }

    // Delete a concept and its associated subconcepts
    async deleteConcept(conceptId) {
        const concept = await conceptRepo.getByIdWithSubconcepts(conceptId);

        if (!concept) {
            throw new Error(`Concept with ID ${conceptId} not found.`);
        }

        // Delete all associated subconcepts
        for (const subconcept of concept.subconcepts) {
            await subconceptRepo.delete(subconcept.id)
        }

        // Delete the concept
        await conceptRepo.delete(conceptId);
    }
}

module.exports = new ConceptService();
