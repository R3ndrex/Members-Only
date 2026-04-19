require("dotenv").config();
const { Client } = require("pg");
const sql = `
DROP TABLE IF EXISTS "session";
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS posts;
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

CREATE TABLE users(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    email VARCHAR(255),
    password TEXT,
    status VARCHAR(255)
);

CREATE TABLE posts(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(255),
    description TEXT,
    createdAt TIMESTAMP,
    authorId INTEGER REFERENCES users(id)
);
`;
async function main() {
    const client = new Client({
        connectionString: process.env.CONNECTION_STRING,
    });
    await client.connect();
    console.log("started populating...");
    await client.query(sql);
    console.log("populated");
    await client.end();
}
main();
