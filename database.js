import * as SQLite from "expo-sqlite";

// Open database asynchronously
let db;

export async function getDb() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("little_lemon.db");
  }
  return db;
}

export async function createTable() {
  const database = await getDb();
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS menuitems (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT,
      price TEXT,
      description TEXT,
      image TEXT,
      category TEXT
    );
  `);
}

export async function getMenuItems() {
  const database = await getDb();
  const allRows = await database.getAllAsync("SELECT * FROM menuitems");
  return allRows;
}

export async function saveMenuItems(menuItems) {
  const database = await getDb();
  const insertQuery = `
    INSERT OR REPLACE INTO menuitems (id, name, price, description, image, category)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
  for (const item of menuItems) {
    await database.runAsync(insertQuery, [
      item.id,
      item.name,
      item.price,
      item.description,
      item.image,
      item.category,
    ]);
  }
}

export async function filterByQueryAndCategories(query, activeCategories) {
  const database = await getDb();
  const placeholders = activeCategories.map(() => "?").join(",");
  const sql = `
    SELECT * FROM menuitems
    WHERE name LIKE ? AND category IN (${placeholders});
  `;
  const params = [`%${query}%`, ...activeCategories];
  const filteredRows = await database.getAllAsync(sql, params);
  return filteredRows;
}
