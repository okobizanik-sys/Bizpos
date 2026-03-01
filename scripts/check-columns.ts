import knex from "knex";
import dotenv from "dotenv";
dotenv.config();
const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
  },
});
db.raw(
  "SHOW COLUMNS FROM products WHERE Field IN ('barcode', 'barcode_serial_id')",
)
  .then((r: any) => {
    console.log(JSON.stringify(r[0], null, 2));
    db.destroy();
    process.exit(0);
  })
  .catch((e: any) => {
    console.error(e.message);
    process.exit(1);
  });
