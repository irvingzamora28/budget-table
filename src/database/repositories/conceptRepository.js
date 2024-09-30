// src/database/repositories/conceptRepository.js

class ConceptRepository {
    constructor(db) {
        this.db = db;
        this.tableName = "concepts";
        this.tableNameSubconcept = "subconcepts";
    }

    async add(concept) {
        // Extract subconcepts from concept
        const { subconcepts, ...conceptData } = concept;

        // Store the concept first and get its id
        const { id: conceptId } = await this.db.add(
            this.tableName,
            conceptData
        );

        // If there are subconcepts, store each with the concept_id link
        if (subconcepts && subconcepts.length > 0) {
            for (const subconcept of subconcepts) {
                // Directly insert into subconcepts table
                await this.db.add(this.tableNameSubconcept, {
                    ...subconcept,
                    concept_id: conceptId, // Link subconcept to concept
                });
            }
        }

        return { id: conceptId };
    }

    async getById(id) {
        return await this.db.getById(this.tableName, id);
    }

    async getAll() {
        return await this.db.getAll(this.tableName);
    }

    // Get all concepts with their subconcepts
    async getAllWithSubconcepts() {
        const concepts = await this.db.getAll(this.tableName);
        for (const concept of concepts) {
            const subconcepts = await this.db.getAll(this.tableNameSubconcept, {
                concept_id: concept.id,
            });
            concept.subconcepts = subconcepts;
        }
        return concepts;
    }

    // Update a concept and its subconcepts, take into account the subconcepts being added or removed
    async update(id, concept) {
        const { subconcepts, ...conceptData } = concept;
        await this.db.update(this.tableName, id, conceptData);
        if (subconcepts && subconcepts.length > 0) {
            // Remove existing subconcepts
            await this.db.deleteByQuery(this.tableNameSubconcept, { concept_id: id });
            // Add new subconcepts
            for (const subconcept of subconcepts) {
                await this.db.add(this.tableNameSubconcept, {
                    ...subconcept,
                    concept_id: id,
                });
            }
        }
    }

    async delete(id) {
        return await this.db.delete(this.tableName, id);
    }

    // Method to get items by any field and value
    async getAllByField(field, value) {
        const query = { [field]: value };
        return await this.db.getAll(this.tableName, query);
    }
}

module.exports = ConceptRepository;
