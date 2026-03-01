export type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
};

export type Categories = {
  id: number;
  name: string;
};

export type Brands = {
  id: number;
  name: string;
};

export type Colors = {
  id: number;
  name: string;
  product_id?: bigint;
  color_id?: number;
};

export type Sizes = {
  id: number;
  name: string;
  product_id?: bigint;
  size_id?: number;
};

export type Images = {
  id: number;
  url: string;
};

export type Stocks = {
  id: bigint;
  product_id: bigint;
  branch_id: number;
  barcode: string;
  color_id: number;
  size_id: number;
  cost: number;
  quantity: number;
};

export type StockHistory = {
  id: number;
  product_id: bigint;
  barcode: string;
  variant: string;
  quantity: number;
  cost_per_item: number;
  created_at: Date;
  productName: string;
  productSku: string;
  categoryName: string;
};

export type Branches = {
  id?: number;
  name: string;
  address: string;
  phone: string;
  root?: boolean;
};

export type Customers = {
  id?: number;
  address: string;
  phone: string;
  issue_date?: Date;
  expire_date?: Date;
  customer: string;
  group_id?: number;
  membership_id?: number;
  groupName?: string;
  membershipType?: string;
  fraud?: string;
  remarks?: string;
};

export type Orders = {
  id?: number;
  order_id: string;
  date?: Date;
  total: number;
  status?: any;
  customer_id: number;
  branch_id: number;
  customer?: string;
  phone?: string;
  address?: string;
  comment?: string;
  discount?: number;
  vat?: number;
  delivery_charge?: number;
  paid_amount?: number;
  due_amount?: number;
  sub_total?: number;
  payment_method?: string;
};

export type OrderItem = {
  id?: number;
  order_id?: bigint;
  product_id?: number;
  quantity?: number;
  price?: number;
  cogs?: number;
  barcode: string;
};

export type OrderItems = {
  id?: number;
  order_id?: bigint;
  product_id?: number;
  quantity: number;
  price?: number;
  cogs?: number;
  barcode: string;
  productName?: string;
  colorName?: string;
  sizeName?: string;
  sellingPrice: number;
  orderId?: string;
  branchId?: number;
  productId?: number;
  colorId?: number;
  sizeId?: number;
  cost?: number;
  productImageUrl?: string;
  discount?: number;
  vat?: number;
  delivery_charge?: number;
  paid_amount?: number;
  due_amount?: number;
  payment_method?: string;
  sub_total?: number;
};

export type SalesData = {
  date: Date;
  branchId: number;
  branchName: string;
  order_id: string;
  customer: string;
  phone: string;
  address?: string;
  total: number;
  cost_of_goods_sold: number;
  discount?: number;
  vat?: number;
  delivery_charge?: number;
  paid_amount?: number;
  due_amount?: number;
  payment_method?: string;
  sub_total?: number;
};

export type DashboardSalesData = {
  date: Date;
  branchId: number;
  total: number;
  cost_of_goods_sold: number;
  due_amount?: number;
  paid_amount?: number;
};

export type Groups = {
  id: number;
  name: string;
};

export type Memberships = {
  id: number;
  type: string;
};

export type Products = {
  id?: number;
  name: string;
  sku: string;
  selling_price: number;
  description: string;
  category_id?: number;
  brand_id?: number;
  image_id?: number;
};

export type Challans = {
  id: bigint;
  from_branch_id: number;
  from_branch_name: string;
  to_branch_id: number;
  to_branch_name: string;
  status: string;
  quantity: number;
  challan_no: string;
};

export type ChallanItem = {
  id?: bigint;
  challan_id: bigint;
  product_id: bigint;
  barcode: string;
  quantity: number;
  variant: string;
  created_at?: Date;
  updated_at?: Date;
  challanId?: bigint;
  challan_no?: string;
  from_branch_id?: number;
  to_branch_id?: number;
  status?: string;
  name?: string;
  sku?: string;
  selling_price?: number;
  description?: string;
  category_id?: number;
  brand_id?: number;
  image_id?: number;
  categoryName?: string;
};

export type ChallanItems = {
  id: bigint;
  challan_id: bigint;
  product_id: bigint;
  barcode: string;
  quantity: number;
  variant: string;
  created_at?: Date;
  updated_at?: Date;
  challanId: bigint;
  challan_no: string;
  from_branch_id: number;
  to_branch_id: number;
  status: string;
  name: string;
  sku: string;
  selling_price: number;
  description?: string;
  category_id: number;
  brand_id: number;
  image_id?: number;
  categoryName: string;
};

export type ChallanList = {
  id?: number;
  from_branch_id?: number;
  to_branch_id?: number;
  status: string;
  quantity: number;
  created_at: Date;
  updated_at?: Date;
  from_branch_name: string;
  to_branch_name: string;
  name?: string;
  product_id?: number;
  barcode?: string;
  variant?: string;
};

export type ChallanGetPayload = {
  id?: number;
  from_branch_id?: number;
  to_branch_id?: number;
  status: string;
  quantity: number;
  created_at: Date;
  updated_at?: Date;
  from_branch_name: string;
  to_branch_name: string;
  name?: string;
  barcode?: string;
  variant?: string;
  product_id?: number;
  challan_no?: string;
  items?: ChallanGetPayload[];
};

export type User = {
  id: number;
  name?: string;
  email: string;
  password: string;
  email_verified?: boolean;
  role: string;
  phone?: string;
  branchName?: string;
  branchId: number;
};

export type OrderSerials = {
  id?: number;
  serial: bigint;
  created_at?: Date;
  updated_at?: Date;
};

export type BarcodeSerials = {
  id?: number;
  serial: bigint;
  created_at?: Date;
  updated_at?: Date;
};

export type CustomerWithOrders = {
  groupName: string;
  customerName: string;
  phone: string;
  orders: number;
  return: number;
  amount: number;
  remarks?: string;
};

export type ProductColors = {
  id?: number;
  name: string;
  product_id: bigint;
  color_id: number;
};

export type ProductSizes = {
  id?: number;
  name: string;
  product_id: bigint;
  size_id: number;
};

export type Settings = {
  id?: number;
  return_privacy_policy?: string;
  logo_image_url?: string;
  login_image_url?: string;
  vat_rate?: number;
  created_at?: Date;
  updated_at?: Date;
};

export type PaymentMethods = {
  id?: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
};

export type SalesSummary = {
  totalCOGS: number;
  totalSale: number;
};
