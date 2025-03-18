import { Sequelize } from 'sequelize';
import { ClubModel } from './club.db';
import dotenv from "dotenv";
dotenv.config({ path: './src/.env' });

export let conn: Sequelize;

if (process.env.NODE_ENV === "test") {
    conn = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
    });
} else { 
    const conn_string = process.env.CONNECTION_STRING;
    if(conn_string){
        conn = new Sequelize(conn_string);
    }
    
}

export async function initDB() {
    await conn.sync({ alter: true });
}; 

