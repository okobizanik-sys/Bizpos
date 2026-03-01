# 🛍️ Bizpos - Modern Point of Sale System

A comprehensive, enterprise-grade Point of Sale (POS) system built with Next.js 14, React 18, and MySQL. Designed for retail businesses to manage sales, inventory, customers, and multi-branch operations with role-based access control.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2.24-black)
![React](https://img.shields.io/badge/React-18-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-3178c6)
![License](https://img.shields.io/badge/license-Private-red)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Database Setup](#-database-setup)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [User Roles](#-user-roles)
- [Project Structure](#-project-structure)
- [Key Modules](#-key-modules)
- [Recent Bug Fixes](#-recent-bug-fixes)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [Support](#-support)

---

## ✨ Features

### 🎯 Core Functionality

- **Real-time POS System** - Fast, responsive point of sale with barcode scanning
- **Multi-Branch Management** - Handle multiple store locations from single dashboard
- **Role-Based Access Control** - ADMIN and STAFF user roles with specific permissions
- **Inventory Management** - Track stock levels, transfers, and automated reordering
- **Sales Analytics** - Comprehensive reporting with daily, weekly, monthly, and lifetime views
- **Customer Management** - Track customer purchases, fraud detection, and loyalty programs
- **Order Management** - Create, track, and manage orders with returns and exchanges
- **Barcode Generation** - Auto-generate barcodes for products and stock items
- **Print Support** - Print invoices, delivery slips, labels, and reports

### 📊 Advanced Features

- **Stock Transfer System** - Inter-branch stock movement with challan generation
- **Damage Product Tracking** - Record and manage damaged inventory
- **Payment Methods** - Multiple payment method support with advanced tracking
- **Product Variants** - Manage colors, sizes, brands, and categories
- **Delivery Management** - Track deliveries with customizable charges
- **Fraud Customer Detection** - Flag and manage problematic customers
- **Auto-Generated Reports** - Export to CSV and print various business reports
- **Settings Management** - Customizable branding (logo, login images)
- **Dark Mode Support** - Theme switching for user preference

### 🔒 Security & Performance

- **NextAuth.js Integration** - Secure authentication with JWT tokens
- **Middleware Protection** - Route-level authorization
- **Optimized Database Queries** - Efficient data fetching with Knex.js
- **Server-Side Rendering** - Fast page loads with Next.js 14
- **Type Safety** - Full TypeScript implementation
- **Error Boundaries** - Graceful error handling

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 14.2.24 (App Router)
- **UI Library:** React 18
- **Language:** TypeScript 5.4.5
- **Styling:** Tailwind CSS 3.4.1
- **Component Library:** Radix UI
- **State Management:** Zustand 4.5.2
- **Form Handling:** React Hook Form 7.51.4
- **Validation:** Zod 3.23.8
- **Tables:** TanStack Table 8.17.3
- **Icons:** Lucide React 0.378.0

### Backend

- **Runtime:** Node.js
- **Database:** MySQL 2 (via mysql2 ^3.13.0)
- **Query Builder:** Knex.js 3.1.0
- **Authentication:** NextAuth.js 5.0.0-beta.19
- **Password Hashing:** bcryptjs 2.4.3
- **File Storage:** AWS S3 (via @aws-sdk/client-s3)

### Additional Libraries

- **Printing:** react-to-print 2.15.1
- **Barcodes:** react-barcode 1.5.3
- **Date Handling:** date-fns 3.6.0
- **File Upload:** react-dropzone 14.2.3
- **Rich Text Editor:** react-quill 2.0.0
- **Notifications:** Sonner 1.4.41
- **CSV Export:** tanstack-table-export-to-csv 1.0.3
- **Logging:** Winston 3.13.0

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Browser)                         │
│   ┌─────────────┐  ┌──────────────┐  ┌─────────────┐       │
│   │   Admin UI  │  │   Staff UI   │  │  Auth Pages │       │
│   └─────────────┘  └──────────────┘  └─────────────┘       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                Next.js 14 App Router                         │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              Middleware Layer                        │   │
│   │  • Authentication (NextAuth.js)                      │   │
│   │  • Authorization (Role-Based)                        │   │
│   │  • Route Protection                                  │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │            Server Components                         │   │
│   │  • Dashboard      • POS          • Inventory         │   │
│   │  • Sales          • Orders       • Customers         │   │
│   │  • Stock Transfer • Settings     • Reports           │   │
│   └─────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Service Layer                              │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│   │  Sales   │  │ Customer │  │  Stock   │  │   User   │  │
│   │ Service  │  │ Service  │  │ Service  │  │ Service  │  │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Database Layer (Knex.js)                        │
│   ┌─────────────────────────────────────────────────────┐   │
│   │               MySQL Database                         │   │
│   │  • Users          • Products      • Orders           │   │
│   │  • Customers      • Stock         • Sales            │   │
│   │  • Branches       • Challans      • Settings         │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recommended) or npm/yarn
- **MySQL** >= 8.0
- **Git**

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd biz_pos-main-akash
```

### 2. Install Dependencies

Using pnpm (recommended):

```bash
pnpm install
```

Or using npm:

```bash
npm install
```

---

## 💾 Database Setup

### 1. Create MySQL Database

```sql
CREATE DATABASE bizpos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure Database Connection

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=bizpos_db

# NextAuth Configuration
AUTH_SECRET=your_secret_key_here_minimum_32_characters
NEXTAUTH_URL=http://localhost:3000

# AWS S3 (Optional - for file uploads)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your_bucket_name

# Environment
NODE_ENV=development
```

### 3. Run Database Migrations

```bash
pnpm migrate
```

This will create all necessary tables:

- users, accounts, sessions, verification_tokens
- products, categories, brands, colors, sizes, images
- branches, stock, stock_history, challans
- customers, groups, memberships
- orders, order_items, sales
- settings, payment_methods
- And more...

### 4. Seed Database (Optional)

```bash
pnpm seed
```

---

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bizpos_db

# Authentication
AUTH_SECRET=generate_a_random_32_character_string
NEXTAUTH_URL=http://localhost:3000

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=

# Application
NODE_ENV=development
```

**Generate AUTH_SECRET:**

```bash
openssl rand -base64 32
```

---

## 🎬 Running the Application

### Development Mode

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
pnpm build
pnpm start
```

### Linting

```bash
pnpm lint
```

---

## 👥 User Roles

### ADMIN

**Full system access including:**

- Dashboard with all analytics
- User management (create staff, assign branches)
- Sales reports and analytics
- Settings configuration
- Multi-branch management
- All inventory operations
- Customer management
- Order management

**Admin Routes:**

- `/admin/dashboard`
- `/sales/*`
- `/staffs/*`
- `/settings/*`
- All other routes

### STAFF

**Limited access for daily operations:**

- Staff-specific dashboard
- POS operations
- Order creation
- Stock viewing
- Customer lookup
- Basic reporting

**Staff Routes:**

- `/staff/dashboard`
- `/pos/*`
- `/orders/*` (view/create only)
- `/customers/*` (view only)
- `/inventories/*` (view only)

---

## 📁 Project Structure

```
biz_pos-main-akash/
├── migrations/              # Database migrations (Knex.js)
│   ├── 20241009094332_user.ts
│   ├── 20241009110442_product.ts
│   ├── 20241009110810_order.ts
│   └── ... (47 migration files)
├── public/
│   └── images/             # Static assets
├── scripts/
│   └── seed.ts             # Database seeding
├── src/
│   ├── app/
│   │   ├── (admin-panel)/  # Protected admin routes
│   │   │   ├── admin/      # Admin dashboard & features
│   │   │   ├── staff/      # Staff dashboard
│   │   │   ├── pos/        # Point of Sale
│   │   │   ├── sales/      # Sales management
│   │   │   ├── orders/     # Order management
│   │   │   ├── customers/  # Customer management
│   │   │   ├── inventories/# Inventory management
│   │   │   ├── branches/   # Branch management
│   │   │   ├── staffs/     # Staff management
│   │   │   ├── settings/   # System settings
│   │   │   ├── stock-transfer/
│   │   │   ├── stock-receive/
│   │   │   ├── damage-products/
│   │   │   └── layout.tsx
│   │   ├── (auth)/         # Authentication pages
│   │   │   └── page.tsx    # Login page
│   │   ├── api/            # API routes
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/             # Reusable UI components (Radix UI)
│   │   ├── admin-panel/    # Admin-specific components
│   │   ├── tables/         # Data table components
│   │   ├── invoice/        # Invoice templates
│   │   ├── delivery-slip/  # Delivery slip templates
│   │   └── ...
│   ├── hooks/
│   │   └── store/          # Zustand stores
│   │       ├── use-pos-store.ts
│   │       └── use-branch.ts
│   ├── services/           # Business logic layer
│   │   ├── sales.ts
│   │   ├── order.ts
│   │   ├── customer.ts
│   │   ├── stock.ts
│   │   ├── product.ts
│   │   └── ...
│   ├── db/                 # Database configuration
│   ├── lib/                # Utility libraries
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Helper functions
│   └── middleware.ts       # Route protection & auth
├── components.json         # shadcn/ui configuration
├── knexfile.ts            # Knex database configuration
├── next.config.mjs        # Next.js configuration
├── package.json
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md
```

---

## 🔑 Key Modules

### 1. **Point of Sale (POS)**

- Real-time product search with barcode scanning
- Cart management with quantity updates
- Discount application (percentage and BDT)
- Delivery charge calculation
- Multiple payment methods
- Invoice and slip printing
- Exchange and return processing

### 2. **Inventory Management**

- Product catalog with variants (color, size)
- Stock level tracking by branch
- Auto-generated barcodes
- Stock history and audit trails
- Low stock alerts
- Damage product recording
- Label printing

### 3. **Stock Transfer**

- Inter-branch stock movement
- Challan generation and tracking
- Transfer approval workflow
- Stock receive confirmation
- Transfer history

### 4. **Sales & Orders**

- Order creation and tracking
- Sales reporting (daily/weekly/monthly/lifetime)
- Order returns and exchanges
- Sales analytics by branch
- COGS (Cost of Goods Sold) tracking
- Profit calculations

### 5. **Customer Management**

- Customer profiles with purchase history
- Fraud customer flagging
- Customer groups and memberships
- Contact information management
- Purchase analytics per customer

### 6. **Multi-Branch Operations**

- Branch creation and management
- Branch-specific dashboards
- User-branch assignments
- Branch-wise stock levels
- Branch performance reports

### 7. **User Management**

- Staff creation with role assignment
- Branch assignment for staff
- User profiles and updates
- Access control per role
- Activity logging

### 8. **Reporting & Analytics**

- Comprehensive dashboards
- Sales summaries
- Stock value reports
- Branch-wise performance
- Export to CSV
- Printable reports

### 9. **Settings**

- System configuration
- Payment method management
- Company branding (logo, login image)
- Application customization

---

## 🐛 Recent Bug Fixes

### Critical Chrome Crash Fix (December 2025)

**Issue:** Browser crash when clicking filter buttons on dashboard

**Root Cause:**

- MenubarTrigger component incorrectly used `value` attribute
- Event handler tried to access `e.currentTarget.value` which returned `undefined`
- Caused infinite navigation loop leading to browser crash

**Solution:**

- Removed event-based value extraction
- Implemented direct parameter passing: `onClick={() => handleFilter(menu.type)}`
- Fixed router navigation paths to use absolute URLs
- Updated filter logic to prevent undefined values

**Files Modified:**

- `src/app/(admin-panel)/admin/dashboard/dashboard.tsx`

**Impact:** ✅ System now stable, no browser crashes, improved performance

---

## 📚 API Documentation

### Authentication Endpoints

```typescript
POST / api / auth / signin;
POST / api / auth / signout;
GET / api / auth / session;
```

### Service Layer Functions

**Sales Service:**

```typescript
getSalesData(filter?: OrderFilter): Promise<SalesData[]>
getTotalSalesSummary(): Promise<SalesSummary>
```

**Stock Service:**

```typescript
getStocks(options): Promise<Stock[]>
getTotalStockSummary(): Promise<StockSummary>
```

**Customer Service:**

```typescript
getCustomers(options): Promise<Customer[]>
getUniqueCustomers(options): Promise<Customer[]>
```

**Order Service:**

```typescript
createOrder(data): Promise<Order>
updateOrder(id, data): Promise<Order>
getOrders(filter): Promise<Order[]>
```

---

## 🎨 UI Components

Built with **Radix UI** and **Tailwind CSS**:

- Alert Dialog
- Avatar
- Button
- Card
- Checkbox
- Dialog/Modal
- Dropdown Menu
- Form
- Input
- Label
- Menubar
- Popover
- Radio Group
- ScrollArea
- Select
- Separator
- Table
- Toast/Notifications
- Tooltip

---

## 🔧 Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow ESLint rules
- Use Prettier for formatting
- Component naming: PascalCase
- File naming: kebab-case

### State Management

- Use Zustand for global state
- Use React Hook Form for form state
- Server state handled by Next.js

### Database Operations

- All queries through Knex.js
- Use migrations for schema changes
- Never commit raw SQL in application code
- Always use parameterized queries

### Authentication

- All routes protected via middleware
- JWT tokens stored in HTTP-only cookies
- Role checks performed server-side
- Session validation on each request

---

## 🧪 Testing

```bash
# Run tests (when implemented)
pnpm test

# Type checking
pnpm tsc --noEmit

# Linting
pnpm lint
```

---

## 🚢 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Generate secure `AUTH_SECRET`
- [ ] Configure production database
- [ ] Set up AWS S3 (if using file uploads)
- [ ] Run migrations on production DB
- [ ] Build the application: `pnpm build`
- [ ] Configure reverse proxy (Nginx/Apache)
- [ ] Set up SSL certificate
- [ ] Configure environment variables
- [ ] Set up logging and monitoring
- [ ] Configure backups

### Build Commands

```bash
# Install dependencies
pnpm install --production

# Run migrations
pnpm migrate

# Build application
pnpm build

# Start production server
pnpm start
```

---

## 📊 Performance Optimization

- Server-side rendering with Next.js
- Automatic code splitting
- Image optimization with Next.js Image
- Database query optimization with Knex
- Efficient state management with Zustand
- Lazy loading of components
- Production bundle optimization

---

## 🔐 Security Features

- JWT-based authentication
- HTTP-only cookies
- Role-based access control (RBAC)
- SQL injection prevention (parameterized queries)
- XSS protection
- CSRF protection
- Secure password hashing (bcryptjs)
- Environment variable protection
- Middleware-level route protection

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is **private** and proprietary.

---

## 📞 Support

For issues and questions:

- Create an issue in the repository
- Contact the development team
- Check documentation

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Radix UI for accessible components
- Vercel for hosting solutions
- All open-source contributors

---

## 📈 Roadmap

- [ ] Mobile responsive improvements
- [ ] Advanced analytics dashboard
- [ ] Automated email notifications
- [ ] SMS integration for order updates
- [ ] Advanced inventory forecasting
- [ ] Multi-currency support
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Performance monitoring
- [ ] Cloud deployment guide

---

**Built with ❤️ using Next.js, React, and TypeScript**
