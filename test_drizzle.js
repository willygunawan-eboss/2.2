import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

const employees = sqliteTable('employees', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
});

const db = drizzle(new Database(':memory:'));
const query = db.insert(employees).values({ id: '123' }).toSQL();
console.log(query);
