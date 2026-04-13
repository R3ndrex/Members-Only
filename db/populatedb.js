require("dotenv").config();
const { Client } = require("pg");
const sql = `CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

`;
async function main() {
    const client = new Client({
        connectionString: process.env.CONNECTION_STRING,
    });
    await client.connect();
    console.log("started populating...");
    client.query(sql);
    console.log("populated");
    client.end();
}
main();
