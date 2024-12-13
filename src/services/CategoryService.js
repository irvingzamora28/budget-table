
const { categoryRepo } = require("../database/dbAccessLayer");

class CategoryService {
    static async updateCategoryTitle(categoryId, newTitle) {
        try {
            const updatedCategory = await categoryRepo.update(categoryId, { name: newTitle });
            return updatedCategory;
        } catch (error) {
            console.error("Error updating category title:", error);
            throw error;
        }
    }
}

module.exports = CategoryService;