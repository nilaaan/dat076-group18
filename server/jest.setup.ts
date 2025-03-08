import { conn } from "./src/db/conn";

beforeAll(async () => {
    await conn.sync({alter: true})
});
