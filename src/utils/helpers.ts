import { ProductWithStockPayload } from "@/app/(admin-panel)/inventories/stock-list/page";
import { Table } from "@tanstack/react-table";

export function makeInitials(name: string) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return initials.toUpperCase();
}

export function makeFormData(data: Record<string, any>) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v: any) => {
        formData.append(key, v);
      });
    } else {
      formData.append(key, value);
    }
  });

  return formData;
}

export function humanFileSize(bytes: number, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

export function filenameGenerator(filename: string, key: string, dir: string) {
  const randomString = Math.random().toString(36).substring(2, 7);
  const extension = filename.split(".").pop();
  const currentTimestampString = new Date().getTime().toString();
  return `${dir}/${key}-${randomString}-${currentTimestampString}.${extension}`;
}

export function fileUrlGenerator(filename: string) {
  if (!filename) return "";

  const sanitized = String(filename).trim();
  if (!sanitized || sanitized === "null" || sanitized === "undefined") {
    return "";
  }

  if (isValidUrl(sanitized)) {
    return sanitized;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  if (!baseUrl) {
    return sanitized.startsWith("/") ? sanitized : `/${sanitized}`;
  }

  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = sanitized.startsWith("/") ? sanitized : `/${sanitized}`;
  return `${normalizedBase}${normalizedPath}`;
}

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function makeProductCode(id: number) {
  return id.toString().padStart(4, "0");
}

export function makePrice(price: string | number) {
  const amount = typeof price === "string" ? parseFloat(price) : price;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
  }).format(amount);

  return formatted;
}

export function makeBDPrice(price: string | number) {
  const amount = typeof price === "string" ? parseFloat(price) : price;

  // Format according to the Bangladeshi numbering system
  const formatted = amount.toLocaleString("en-IN", {
    // style: "currency",
    // currency: "BDT",
    minimumFractionDigits: 0,
  });

  return `৳ ${formatted}`;
}

// export function getTotalFromTable<T>(table: Table<T>, index: number) {
//   return table
//     .getRowModel()
//     .rows.map(
//       (row) => row.getAllCells().map((cell) => Number(cell.getValue()))[index]
//     )
//     .reduce((acc, cur) => acc + cur, 0);
// }

export function getTotalFromTable<T>(table: Table<T>, index: number) {
  return table
    .getRowModel()
    .rows.map((row) => {
      const product = row.original as ProductWithStockPayload;

      // Ensure the correct index is used for calculations
      if (index === 6) {
        return product.cost * product.quantity; // Stock Value
      } else if (index === 7) {
        return product.selling_price * product.quantity; // Sell Value
      } else if (index === 5) {
        return product.quantity; // Stock Quantity
      }

      return 0;
    })
    .reduce((acc, cur) => acc + cur, 0);
}

export function toUpperCaseWords(str: string) {
  return str
    .split(" ")
    .map((word) => word.toUpperCase())
    .join(" ");
}

export function getFirst50Characters(input: string) {
  if (typeof input !== "string") {
    throw new Error("Input must be a string");
  }
  return input.length > 50 ? input.slice(0, 50) + " ..." : input;
}
