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

    async getByIdWithSubconcepts(id) {
        const concept = await this.db.getById(this.tableName, id);
        const subconcepts = await this.db.getAll(this.tableNameSubconcept, {
            concept_id: id,
        });
        concept.subconcepts = subconcepts;
        return concept;
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
            // Get the ids of the variable subconcepts
            const incomingSubconceptIds = subconcepts.filter(subconcept => subconcept.id).map(subconcept => subconcept.id);
            const beforeSubUpdateConcept = await this.getByIdWithSubconcepts(id);
            const beforeSubUpdateSubconceptIds = beforeSubUpdateConcept.subconcepts.map(subconcept => subconcept.id);
            

            for (const subconcept of subconcepts) {
                // If the subconcept has id, it's an update, otherwise it's an add
                if (subconcept.id) {
                    // Update the subconcept
                    await this.db.update(this.tableNameSubconcept, subconcept.id, {
                        ...subconcept,
                        concept_id: id,
                    });
                }
                else {
                    // Add the subconcept
                    await this.db.add(this.tableNameSubconcept, {
                        ...subconcept,
                        concept_id: id,
                    });
                }
            }
            // Remove the ids from afterSubUpdateSubconceptIds that are in the incomingSubconceptIds
            const subconceptsToRemove = beforeSubUpdateSubconceptIds.filter(subconceptId => !incomingSubconceptIds.includes(subconceptId));
            for (const subconceptId of subconceptsToRemove) {
                await this.db.delete(this.tableNameSubconcept, subconceptId);
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
