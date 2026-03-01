import { Group } from "@/types/shared";
import {
  Tag,
  Users,
  LayoutGrid,
  Printer,
  ShoppingBag,
  BadgeDollarSign,
  Globe,
  FileUp,
  FileDown,
  FolderTree,
  PackageX,
  UserCog,
  Settings,
} from "lucide-react";

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Management",
      menus: [
        {
          href: "/pos",
          label: "POS",
          active: pathname.includes("/pos"),
          icon: Printer,
          submenus: [],
        },
        {
          href: "",
          label: "Orders",
          active: pathname.includes("/sales"),
          icon: ShoppingBag,
          submenus: [
            {
              href: "/orders/orders-list",
              label: "Orders List",
              active: pathname === "/orders/orders-list",
            },
            {
              href: "/orders/return-orders",
              label: "Return Orders",
              active: pathname === "/orders/return-orders",
            },
          ],
        },
        {
          href: "",
          label: "Sales",
          active: pathname.includes("/sales"),
          icon: BadgeDollarSign,
          submenus: [
            {
              href: "/sales/sales-list",
              label: "Sales List",
              active: pathname === "/sales/sales-list",
            },
            {
              href: "/sales/discounted-sales",
              label: "Discounted Sales",
              active: pathname === "/sales/discounted-sales",
            },
          ],
        },
        {
          href: "",
          label: "Inventory",
          active: pathname.includes("/inventories"),
          icon: Tag,
          submenus: [
            {
              href: "/inventories/add-product",
              label: "Add Product",
              active: pathname === "/inventories/add-product",
            },
            {
              href: "/inventories/products",
              label: "Product List",
              active: pathname === "/inventories/products",
            },
            // {
            //   href: "/inventories/add-stock",
            //   label: "Add Stock",
            //   active: pathname === "/inventories/add-stock",
            // },
            {
              href: "/inventories/auto-generated-stock",
              label: "Add Stock",
              active: pathname === "/inventories/auto-generated-stock",
            },
            {
              href: "/inventories/stock-list",
              label: "Stock List",
              active: pathname === "/inventories/stock-list",
            },
            {
              href: "/inventories/stock-history",
              label: "Stock History",
              active: pathname === "/inventories/stock-history",
            },
            {
              href: "/inventories/variants",
              label: "Variants",
              active: pathname === "/inventories/variants",
            },
            {
              href: "/inventories/print-label",
              label: "Print Label",
              active: pathname === "/inventories/print-label",
            },
          ],
        },
        {
          href: "/global-stock",
          label: "Global Stock",
          active: pathname === "/global-stock",
          icon: Globe,
          submenus: [],
        },
        {
          href: "/damage-products",
          label: "Damage Products",
          active: pathname === "/damage-products",
          icon: PackageX,
          submenus: [],
        },
        {
          href: "",
          label: "Stock Transfer",
          active: pathname.includes("/stock-transfer"),
          icon: FileUp,
          submenus: [
            {
              href: "/stock-transfer/transfer-products",
              label: "Transfer Products",
              active: pathname === "/stock-transfer/transfer-products",
            },
            {
              href: "/stock-transfer/transfer-list",
              label: "Transfer List",
              active: pathname === "/stock-transfer/transfer-list",
            },
          ],
        },
        {
          href: "/stock-receive",
          label: "Stock Receive",
          active: pathname.includes("/stock-receive"),
          icon: FileDown,
          submenus: [],
        },
        {
          href: "",
          label: "Customers",
          active: pathname.includes("/customers"),
          icon: Users,
          submenus: [
            {
              href: "/customers/customers-list",
              label: "Customer List",
              active: pathname === "/customers/customers-list",
            },
            {
              href: "/customers/fraud-customers",
              label: "Fraud Customers",
              active: pathname === "/customers/fraud-customers",
            },
            {
              href: "/customers/customers-data",
              label: "Customers Data",
              active: pathname === "/customers/customers-data",
            },
          ],
        },
        {
          href: "/branches",
          label: "Branches",
          active: pathname.includes("/branches"),
          icon: FolderTree,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Configuration",
      menus: [
        {
          href: "/staffs",
          label: "Staffs",
          active: pathname.includes("/staffs"),
          icon: UserCog,
          submenus: [],
        },
        {
          href: "/settings",
          label: "Settings",
          active: pathname.includes("/settings"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
