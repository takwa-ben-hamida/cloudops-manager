
const { Client } = require("pg");

async function test() {
  const client = new Client({
    host: "127.0.0.1",
    port: 5433,
    user: "cloudops",
    password: "cloudops123",
    database: "cloudops_db"
  });

  try {
    await client.connect();
    const result = await client.query(
      "SELECT current_user, current_database()"
    );
    console.log("CONNECTION SUCCESS:", result.rows[0]);
  } catch (error) {
    console.error("CONNECTION ERROR:", error.message);
  } finally {
    await client.end().catch(() => {});
  }
}

test();
