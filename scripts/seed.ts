import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables
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
        table: "categories",
        data: [
            { name: "Electronics" },
            { name: "Clothing" },
            { name: "Home & Garden" },
            { name: "Sports & Outdoors" },
            { name: "Books & Media" },
            { name: "Food & Beverages" },
            { name: "Health & Beauty" },
            { name: "Toys & Games" },
        ],
    },
    {
        table: "brands",
        data: [
            { name: "TechCorp" },
            { name: "StyleMax" },
            { name: "HomeComfort" },
            { name: "SportPro" },
            { name: "MediaPub" },
            { name: "FreshEats" },
            { name: "BeautyPlus" },
            { name: "PlayZone" },
        ],
    },
    {
        table: "colors",
        data: [
            { name: "Red" },
            { name: "Blue" },
            { name: "Green" },
            { name: "Black" },
            { name: "White" },
            { name: "Yellow" },
            { name: "Purple" },
            { name: "Gray" },
        ],
    },
    {
        table: "sizes",
        data: [
            { name: "Small" },
            { name: "Medium" },
            { name: "Large" },
            { name: "Extra Large" },
            { name: "XXL" },
            { name: "One Size" },
        ],
    },
    {
        table: "products",
        data: [
            {
                name: "Wireless Headphones",
                sku: "WH-001",
                selling_price: 79.99,
                description: "Premium wireless headphones with noise cancellation",
            },
            {
                name: "USB-C Cable",
                sku: "USB-002",
                selling_price: 12.99,
                description: "High-speed USB-C charging cable",
            },
            {
                name: "Laptop Stand",
                sku: "LS-003",
                selling_price: 49.99,
                description: "Adjustable aluminum laptop stand",
            },
            {
                name: "Mechanical Keyboard",
                sku: "KB-004",
                selling_price: 129.99,
                description: "RGB mechanical gaming keyboard",
            },
            {
                name: "Mouse Pad",
                sku: "MP-005",
                selling_price: 19.99,
                description: "Large extended gaming mouse pad",
            },
            {
                name: "Monitor Light Bar",
                sku: "MLB-006",
                selling_price: 69.99,
                description: "LED monitor light bar for eye comfort",
            },
            {
                name: "Docking Station",
                sku: "DS-007",
                selling_price: 99.99,
                description: "USB-C universal docking station",
            },
            {
                name: "Desktop Organizer",
                sku: "DO-008",
                selling_price: 34.99,
                description: "Wooden desk organizer with drawers",
            },
            {
                name: "Desk Chair",
                sku: "CHAIR-009",
                selling_price: 199.99,
                description: "Ergonomic mesh office chair",
            },
            {
                name: "Monitor Stand",
                sku: "MS-010",
                selling_price: 59.99,
                description: "Dual monitor stand with storage",
            },
        ],
    },
    {
        table: "stocks",
        data: [
            {
                product_id: 1,
                branch_id: 1,
                barcode: "WH-001-BRK1",
                color_id: 1,
                size_id: 6,
                cost: 45.0,
            },
            {
                product_id: 2,
                branch_id: 1,
                barcode: "USB-002-BRK1",
                color_id: 4,
                size_id: 6,
                cost: 6.5,
            },
            {
                product_id: 3,
                branch_id: 1,
                barcode: "LS-003-BRK1",
                color_id: 4,
                size_id: 1,
                cost: 25.0,
            },
            {
                product_id: 4,
                branch_id: 2,
                barcode: "KB-004-BRK2",
                color_id: 1,
                size_id: 6,
                cost: 70.0,
            },
            {
                product_id: 5,
                branch_id: 2,
                barcode: "MP-005-BRK2",
                color_id: 2,
                size_id: 3,
                cost: 10.0,
            },
            {
                product_id: 6,
                branch_id: 2,
                barcode: "MLB-006-BRK2",
                color_id: 5,
                size_id: 6,
                cost: 40.0,
            },
            {
                product_id: 7,
                branch_id: 3,
                barcode: "DS-007-BRK3",
                color_id: 5,
                size_id: 6,
                cost: 55.0,
            },
            {
                product_id: 8,
                branch_id: 3,
                barcode: "DO-008-BRK3",
                color_id: 3,
                size_id: 2,
                cost: 18.0,
            },
            {
                product_id: 9,
                branch_id: 3,
                barcode: "CHAIR-009-BRK3",
                color_id: 4,
                size_id: 3,
                cost: 120.0,
            },
            {
                product_id: 10,
                branch_id: 1,
                barcode: "MS-010-BRK1",
                color_id: 5,
                size_id: 2,
                cost: 35.0,
            },
        ],
    },
    {
        table: "customers",
        data: [
            {
                product_id: "1",
                address: "123 Customer Lane, Dhaka",
                phone: "+880-1700-0101",
                issue_date: new Date(),
                expire_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                action: true,
            },
            {
                product_id: "2",
                address: "456 Customer Avenue, Chittagong",
                phone: "+880-1800-0102",
                issue_date: new Date(),
                expire_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                action: true,
            },
            {
                product_id: "3",
                address: "789 Customer Road, Sylhet",
                phone: "+880-1900-0103",
                issue_date: new Date(),
                expire_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                action: false,
            },
            {
                product_id: "4",
                address: "321 Customer Street, Rajshahi",
                phone: "+880-1600-0104",
                issue_date: new Date(),
                expire_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                action: true,
            },
            {
                product_id: "5",
                address: "654 Customer Boulevard, Khulna",
                phone: "+880-1500-0105",
                issue_date: new Date(),
                expire_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                action: true,
            },
            {
                product_id: "6",
                address: "987 Customer Drive, Barisal",
                phone: "+880-1700-0106",
                issue_date: new Date(),
                expire_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                action: false,
            },
            {
                product_id: "7",
                address: "135 Customer Way, Rangpur",
                phone: "+880-1800-0107",
                issue_date: new Date(),
                expire_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                action: true,
            },
            {
                product_id: "8",
                address: "246 Customer Place, Mymensingh",
                phone: "+880-1900-0108",
                issue_date: new Date(),
                expire_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                action: true,
            },
        ],
    },
    {
        table: "orders",
        data: [
            {
                order_id: "ORD-001",
                date: new Date(),
                total: 249.97,
                status: "COMPLETED",
                customer_id: 1,
                branch_id: 1,
                action: true,
            },
            {
                order_id: "ORD-002",
                date: new Date(),
                total: 89.98,
                status: "COMPLETED",
                customer_id: 2,
                branch_id: 1,
                action: true,
            },
            {
                order_id: "ORD-003",
                date: new Date(),
                total: 199.98,
                status: "RETURN",
                customer_id: 3,
                branch_id: 2,
                action: false,
            },
            {
                order_id: "ORD-004",
                date: new Date(),
                total: 129.99,
                status: "COMPLETED",
                customer_id: 4,
                branch_id: 2,
                action: true,
            },
            {
                order_id: "ORD-005",
                date: new Date(),
                total: 349.96,
                status: "COMPLETED",
                customer_id: 5,
                branch_id: 3,
                action: true,
            },
            {
                order_id: "ORD-006",
                date: new Date(),
                total: 99.98,
                status: "EXCHANGED",
                customer_id: 6,
                branch_id: 3,
                action: true,
            },
            {
                order_id: "ORD-007",
                date: new Date(),
                total: 179.97,
                status: "COMPLETED",
                customer_id: 7,
                branch_id: 1,
                action: true,
            },
            {
                order_id: "ORD-008",
                date: new Date(),
                total: 299.97,
                status: "COMPLETED",
                customer_id: 8,
                branch_id: 2,
                action: true,
            },
        ],
    },
    {
        table: "order_items",
        data: [
            { order_id: 1, product_id: 1, quantity: 1, price: 79.99 },
            { order_id: 1, product_id: 2, quantity: 2, price: 12.99 },
            { order_id: 1, product_id: 3, quantity: 1, price: 49.99 },
            { order_id: 2, product_id: 4, quantity: 1, price: 129.99 },
            { order_id: 2, product_id: 5, quantity: 3, price: 19.99 },
            { order_id: 3, product_id: 6, quantity: 1, price: 69.99 },
            { order_id: 3, product_id: 7, quantity: 1, price: 99.99 },
            { order_id: 4, product_id: 8, quantity: 2, price: 34.99 },
            { order_id: 5, product_id: 9, quantity: 1, price: 199.99 },
            { order_id: 5, product_id: 10, quantity: 1, price: 59.99 },
            { order_id: 6, product_id: 1, quantity: 1, price: 79.99 },
            { order_id: 7, product_id: 2, quantity: 2, price: 12.99 },
            { order_id: 8, product_id: 3, quantity: 1, price: 49.99 },
            { order_id: 8, product_id: 4, quantity: 1, price: 129.99 },
        ],
    },
    {
        table: "payment_methods",
        data: [
            { name: "Cash", type: "text" },
            { name: "bKash", type: "number" },
            { name: "Nagad", type: "number" },
            { name: "Rocket", type: "number" },
            { name: "Bank Transfer", type: "text" },
            { name: "Card", type: "text" },
        ],
    },
];

async function seed() {
  const connection = await pool.getConnection();

  try {
    console.log("Starting database seeding...\n");

    for (const { table, data } of seedData) {
      // Clear existing data
      await connection.execute(`TRUNCATE TABLE \`${table}\``);
      console.log(`Cleared table: ${table}`);

      if (data.length === 0) {
        console.log(`Skipped seeding empty table: ${table}\n`);
        continue;
      }

      // Get column names from the first record
      const columns = Object.keys(data[0]);
      const placeholders = columns.map(() => "?").join(", ");
      const columnNames = columns.map((col) => `\`${col}\``).join(", ");

      const query = `INSERT INTO \`${table}\` (${columnNames}) VALUES (${placeholders})`;

      // Insert data using prepared statements
      for (const record of data) {
        const values = columns.map((col) => record[col]);
        await connection.execute(query, values);
      }

      console.log(`✓ Seeded ${data.length} rows into ${table}`);
    }

    console.log("\n✓ Database seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  } finally {
    await connection.release();
    await pool.end();
  }
}

seed();
