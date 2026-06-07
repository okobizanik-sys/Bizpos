import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ganz-db",
});

interface SeedData {
  table: string;
  data: Record<string, any>[];
}

const seedData: SeedData[] = [
    {
        table: "branches",
        data: [
            { id: 1, name: "Motijheel", address: "Motijheel", phone: "01521747442", root: 0 },
            { id: 2, name: "Mohammadpur", address: "Krishi Market", phone: "01711000000", root: 0 },
            { id: 4, name: "Mirpur", address: "213/1, 60 Feet Road, Monipur, Mirpur, Dhaka", phone: "01973590937", root: 0 },
            { id: 5, name: "Gazipur", address: "Duet-Gazipur-Kashem_Villa", phone: "01747874773", root: 0 },
        ],
    },
    {
        table: "users",
        data: [
            {
                id: 8,
                name: "Abu Raihan",
                email: "raihan.okobiz@gmail.com",
                password: "admin",
                role: "ADMIN",
                phone: "01860574432",
            },
            {
                id: 9,
                name: "root",
                email: "root@root.com",
                password: "admin",
                role: "ADMIN",
                phone: "01744155760",
            },
            {
                id: 10,
                name: "shamee vai",
                email: "shameem.rml@gmail.com",
                password: "admin",
                role: "ADMIN",
                phone: "01744155762",
            },
        ],
    },
    {
        table: "payment_methods",
        data: [
            { id: 1, name: "bkash" },
            { id: 2, name: "Nagad" },
            { id: 3, name: "Bank Account" },
            { id: 4, name: "Cash On Delivery" },
            { id: 7, name: "Cash" },
        ],
    },
    {
        table: "categories",
        data: [
            { id: 1, name: "Tech Gadgets" },
            { id: 2, name: "Men outfit" },
            { id: 3, name: "Electronics" },
            { id: 4, name: "Clothing" },
            { id: 5, name: "Home & Garden" },
            { id: 6, name: "Sports & Outdoors" },
            { id: 7, name: "Books & Media" },
            { id: 8, name: "Food & Beverages" },
            { id: 9, name: "Health & Beauty" },
            { id: 10, name: "Toys & Games" },
        ],
    },
    {
        table: "brands",
        data: [
            { id: 1, name: "Honor" },
            { id: 2, name: "Lexor" },
            { id: 3, name: "TechCorp" },
            { id: 4, name: "StyleMax" },
            { id: 5, name: "HomeComfort" },
            { id: 6, name: "SportPro" },
            { id: 7, name: "MediaPub" },
            { id: 8, name: "FreshEats" },
            { id: 9, name: "BeautyPlus" },
            { id: 10, name: "PlayZone" },
            { id: 11, name: "Radhuni" },
        ],
    },
    {
        table: "colors",
        data: [
            { id: 1, name: "Black" },
            { id: 2, name: "Red" },
            { id: 3, name: "Blue" },
            { id: 4, name: "Green" },
            { id: 5, name: "Black" },
            { id: 6, name: "White" },
            { id: 7, name: "Yellow" },
            { id: 8, name: "Purple" },
            { id: 9, name: "Gray" },
        ],
    },
    {
        table: "sizes",
        data: [
            { id: 1, name: "LX" },
            { id: 2, name: "Small" },
            { id: 3, name: "Medium" },
            { id: 4, name: "Large" },
            { id: 5, name: "Extra Large" },
            { id: 6, name: "XXL" },
            { id: 7, name: "One Size" },
            { id: 8, name: "Litter" },
        ],
    },
    {
        table: "groups",
        data: [
            { id: 1, name: "A" },
            { id: 2, name: "A" },
        ],
    },
    {
        table: "products",
        data: [
            { id: 37, name: "Mustered Oil", sku: "MO1", selling_price: 300.00, description: "<p>Organic Mustered Oil</p>", category_id: 8 },
            { id: 38, name: "Shirt", sku: "ST1", selling_price: 1500.00, description: "", category_id: 4, brand_id: 1 },
            { id: 39, name: "product 4", sku: "WH-03", selling_price: 1200.00, description: "<p>dfgdfgdfgdfgdfgdfgdfgdfgdfg</p>", category_id: 3, brand_id: 5 },
            { id: 40, name: "test", sku: "WH-05", selling_price: 300.00, description: "", category_id: 4, brand_id: 8 },
        ],
    },
    {
        table: "stocks",
        data: [
            { id: 45, product_id: 37, branch_id: 2, barcode: "370008", size_id: 8, cost: 200.00, quantity: 981 },
            { id: 46, product_id: 38, branch_id: 2, barcode: "380103", color_id: 1, size_id: 3, cost: 1200.00, quantity: 84 },
            { id: 49, product_id: 40, branch_id: 2, barcode: "400803", color_id: 8, size_id: 3, cost: 400.00, quantity: 48 },
            { id: 50, product_id: 40, branch_id: 2, barcode: "400501", color_id: 5, size_id: 1, cost: 350.00, quantity: 16 },
        ],
    },
    {
        table: "customers",
        data: [
            { id: 16, customer: "Customer 1", address: "123 Customer Lane, Dhaka", phone: "+880-1700-0101", action: 1 },
            { id: 17, customer: "Customer 2", address: "456 Customer Avenue, Chittagong", phone: "+880-1800-0102", action: 1 },
            { id: 18, customer: "Customer 3", address: "789 Customer Road, Sylhet", phone: "+880-1900-0103", action: 0 },
            { id: 19, customer: "Customer 4", address: "321 Customer Street, Rajshahi", phone: "+880-1600-0104", action: 1 },
            { id: 20, customer: "Customer 5", address: "654 Customer Boulevard, Khulna", phone: "+880-1500-0105", action: 1 },
            { id: 21, customer: "Customer 6", address: "987 Customer Drive, Barisal", phone: "+880-1700-0106", action: 0 },
            { id: 22, customer: "Customer 7", address: "135 Customer Way, Rangpur", phone: "+880-1800-0107", action: 1 },
            { id: 23, customer: "Customer 8", address: "246 Customer Place, Mymensingh", phone: "+880-1900-0108", action: 1 },
            { id: 24, customer: "Abu Raihan", address: "60 FIT ROAD MONIPUR", phone: "01860574432" },
            { id: 25, customer: "Anik sarker", address: "MIRPUR DHAKA", phone: "01744155760" },
        ],
    },
    {
        table: "orders",
        data: [
            { id: 24, order_id: "ORD-001", total: 249.97, status: "COMPLETED", customer_id: 16, branch_id: 1, action: 1, sale_channel: "OFFLINE" },
            { id: 25, order_id: "ORD-002", total: 89.98, status: "COMPLETED", customer_id: 17, branch_id: 1, action: 1, sale_channel: "OFFLINE" },
            { id: 26, order_id: "ORD-003", total: 199.98, status: "RETURN", customer_id: 18, branch_id: 2, action: 0, sale_channel: "OFFLINE" },
            { id: 27, order_id: "ORD-004", total: 129.99, status: "COMPLETED", customer_id: 19, branch_id: 2, action: 1, sale_channel: "OFFLINE" },
            { id: 28, order_id: "ORD-005", total: 349.96, status: "COMPLETED", customer_id: 20, branch_id: 4, action: 1, sale_channel: "OFFLINE" },
            { id: 29, order_id: "ORD-006", total: 99.98, status: "EXCHANGED", customer_id: 21, branch_id: 4, action: 1, sale_channel: "OFFLINE" },
            { id: 30, order_id: "ORD-007", total: 179.97, status: "COMPLETED", customer_id: 22, branch_id: 1, action: 1, sale_channel: "OFFLINE" },
            { id: 31, order_id: "ORD-008", total: 299.97, status: "COMPLETED", customer_id: 23, branch_id: 2, action: 1, sale_channel: "OFFLINE" },
        ],
    },
    {
        table: "order_items",
        data: [
            { order_id: 24, product_id: 37, quantity: 1, price: 79.99 },
            { order_id: 24, product_id: 38, quantity: 2, price: 12.99 },
            { order_id: 25, product_id: 39, quantity: 1, price: 49.99 },
            { order_id: 26, product_id: 40, quantity: 1, price: 129.99 },
            { order_id: 27, product_id: 37, quantity: 1, price: 69.99 },
            { order_id: 28, product_id: 38, quantity: 1, price: 99.99 },
            { order_id: 29, product_id: 39, quantity: 2, price: 34.99 },
            { order_id: 30, product_id: 40, quantity: 1, price: 199.99 },
            { order_id: 30, product_id: 37, quantity: 1, price: 59.99 },
            { order_id: 31, product_id: 38, quantity: 1, price: 79.99 },
        ],
    },
    {
        table: "suppliers",
        data: [
            { id: 1, name: "Anik", phone: "01744155760", address: "Kazipara" },
            { id: 2, name: "Abu Raihan", phone: "01860574432", address: "60 fit road Monipur" },
            { id: 3, name: "Test Person2", phone: "017444555666", address: "Uttara-10, Dhaka" },
        ],
    },
];

async function seed() {
  const connection = await pool.getConnection();

  try {
    console.log("Starting database seeding...\n");

        await connection.execute("SET FOREIGN_KEY_CHECKS = 0");

    for (const { table, data } of seedData) {
      // Hash passwords for users table
      if (table === "users") {
        for (const user of data) {
          if (user.password) {
            user.password = await bcryptjs.hash(user.password, 10);
          }
        }
      }

      await connection.execute(`TRUNCATE TABLE \`${table}\``)
      console.log(`Cleared table: ${table}`);

      if (data.length === 0) {
        console.log(`Skipped seeding empty table: ${table}\n`);
        continue;
      }

      const columns = Object.keys(data[0]);
      const placeholders = columns.map(() => "?").join(", ");
      const columnNames = columns.map((col) => `\`${col}\``).join(", ");

      const query = `INSERT INTO \`${table}\` (${columnNames}) VALUES (${placeholders})`;

      for (const record of data) {
        const values = columns.map((col) => record[col] !== undefined ? record[col] : null);
        await connection.execute(query, values);
      }

      console.log(`✓ Seeded ${data.length} rows into ${table}`);
    }

    console.log("\n✓ Database seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
        process.exitCode = 1;
  } finally {
        await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
    await connection.release();
    await pool.end();
  }
}

seed();
