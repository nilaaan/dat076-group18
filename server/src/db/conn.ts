import { Sequelize } from 'sequelize';
import { ClubModel } from './club.db';

export let conn: Sequelize;

if (process.env.NODE_ENV === "test") {
    conn = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
    });
} else { 
    conn = new Sequelize('postgres://postgres@localhost:5432');
}

export async function initDB() {
    await conn.sync({ alter: true });
}; 

