"use server";

import { redirect } from "next/navigation";

export const handleSearch = async (formData: FormData) => {
  "use server";

  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;

  const searchParams = new URLSearchParams();
  searchParams.set("start_date", start_date);
  searchParams.set("end_date", end_date);

  const search = searchParams.toString();

  redirect(`/inventories/stock-history${search ? `?${search}` : ""}`);
};
