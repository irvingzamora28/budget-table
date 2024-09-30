// src/database/web/dbIndexedDB.js
import { openDB } from "idb";

class IndexedDBDatabase {
    constructor() {
        this.dbPromise = openDB("budget-table", 3, {
            upgrade(db) {
                // Create object stores if not exists
                if (!db.objectStoreNames.contains("users")) {
                    db.createObjectStore("users", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }
                if (!db.objectStoreNames.contains("categories")) {
                    db.createObjectStore("categories", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }
                if (!db.objectStoreNames.contains("concepts")) {
                    db.createObjectStore("concepts", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }
                if (!db.objectStoreNames.contains("subconcepts")) {
                    db.createObjectStore("subconcepts", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }
                if (!db.objectStoreNames.contains("budgets")) {
                    db.createObjectStore("budgets", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }
                if (!db.objectStoreNames.contains("income")) {
                    db.createObjectStore("income", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }
                if (!db.objectStoreNames.contains("expenses")) {
                    db.createObjectStore("expenses", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }
                if (!db.objectStoreNames.contains("savings")) {
                    db.createObjectStore("savings", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }
                if (!db.objectStoreNames.contains("investments")) {
                    db.createObjectStore("investments", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }
                if (!db.objectStoreNames.contains("loans")) {
                    db.createObjectStore("loans", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }
                if (!db.objectStoreNames.contains("goals")) {
                    db.createObjectStore("goals", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }
                if (!db.objectStoreNames.contains("assets")) {
                    db.createObjectStore("assets", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }
                if (!db.objectStoreNames.contains("liabilities")) {
                    db.createObjectStore("liabilities", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }
                if (!db.objectStoreNames.contains("reports")) {
                    db.createObjectStore("reports", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }
                if (!db.objectStoreNames.contains("tags")) {
                    db.createObjectStore("tags", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }
                if (!db.objectStoreNames.contains("notifications")) {
                    db.createObjectStore("notifications", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }
                if (!db.objectStoreNames.contains("settings")) {
                    db.createObjectStore("settings", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }
            },
        });
    }

    async add(storeName, item) {
        const db = await this.dbPromise;
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const id = await store.add(item);
        await tx.done;
        return { id };
    }

    async getById(storeName, id) {
        const db = await this.dbPromise;
        return db.get(storeName, id);
    }

    async get(storeName, query = {}) {
        const db = await this.dbPromise;
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        let results = await store.getAll();

        // Filter results based on query
        if (Object.keys(query).length > 0) {
            results = results.filter((item) =>
                Object.entries(query).every(
                    ([key, value]) => item[key] === value
                )
            );
        }
        return results.length > 0 ? results[0] : null;
    }

    async getAll(storeName, query = {}) {
        const db = await this.dbPromise;
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        let results = await store.getAll();

        // Filter results based on query
        if (Object.keys(query).length > 0) {
            results = results.filter((item) =>
                Object.entries(query).every(
                    ([key, value]) => item[key] === value
                )
            );
        }

        return results;
    }

    async update(storeName, id, item) {
        const db = await this.dbPromise;
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        await store.put({ ...item, id });
        await tx.done;
        return { id };
    }

    async delete(storeName, id) {
        const db = await this.dbPromise;
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        await store.delete(id);
        await tx.done;
        return { id };
    }

    // Delete by query
    async deleteByQuery(storeName, query) {
        const db = await this.dbPromise;
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const results = await store.getAll();
        const idsToDelete = results
            .filter((item) => {
                return Object.entries(query).every(
                    ([key, value]) => item[key] === value
                );
            })
            .map((item) => item.id);
        await Promise.all(idsToDelete.map((id) => store.delete(id)));
        await tx.done;
        return { ids: idsToDelete };
    }
}

const indexedDB = new IndexedDBDatabase();
export default indexedDB;
