require('dotenv').config();

module.exports = {
    dialect: "postgresql",
    schema: "./src/data/drizzle/schema.ts",
    out: "./src/data/drizzle/migrations",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
};