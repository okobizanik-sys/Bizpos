"use client";

import Link from "next/link";
import ReportPage from "@/components/report-page/report-page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Branches, Customers, User } from "@/types/shared";
import { Label } from "@radix-ui/react-label";
import {
  Boxes,
  ClipboardCheck,
  Download,
  ScrollText,
  ShoppingBag,
  Users,
  UsersRound,
} from "lucide-react";
import React from "react";
import { useReactToPrint } from "react-to-print";
import { StockSummary } from "../../inventories/stock-list/page";
import { makeBDPrice } from "@/utils/helpers";
import { DashboardSummary } from "@/services/sales";

interface SalesDashboardProps {
  summary: DashboardSummary;
  branches: Branches[];
  customers: Customers[];
  users: User[];
  stockSummary: StockSummary;
  selectedFilter: "today" | "week" | "month" | "lifetime";
}

const menuList = [
  { title: "Today", type: "today" },
  { title: "Week", type: "week" },
  { title: "Month", type: "month" },
  { title: "Lifetime", type: "lifetime" },
] as const;

type FilterType = (typeof menuList)[number]["type"];

const getFilterHref = (filterType: FilterType) =>
  filterType === "lifetime"
    ? "/admin/dashboard"
    : `/admin/dashboard?show=${filterType}`;

export default function AdminDashboard({
  summary,
  branches,
  customers,
  users,
  stockSummary,
  selectedFilter,
}: SalesDashboardProps) {
  const activeFilter = selectedFilter;
  const show = React.useMemo(
    () =>
      menuList.find((item) => item.type === activeFilter)?.title ?? "Lifetime",
    [activeFilter],
  );

  const {
    totalCOGS,
    totalOrders,
    totalSales,
    totalDueAmount,
    totalPaidAmount,
    branchWiseTotals,
  } = summary;

  const printerRef = React.useRef(null);
  const handlePrinter = useReactToPrint({
    content: () => printerRef.current,
  });

  return (
    <div>
      <div className="mx-4 my-1 flex flex-wrap items-center justify-between gap-2">
        <div className="flex h-8 items-center space-x-1 rounded-md border bg-background p-1">
          {menuList.map((menu) => (
            <Link
              key={menu.type}
              href={getFilterHref(menu.type)}
              prefetch={false}
              className={`rounded-sm px-3 py-1.5 text-sm font-medium outline-none hover:bg-black/70 hover:text-white ${
                activeFilter === menu.type ? "bg-black text-white" : ""
              }`}
            >
              {menu.title}
            </Link>
          ))}
        </div>

        <Button onClick={handlePrinter} className="h-8 text-xs">
          <Download size={12} className="mr-2" /> Export
        </Button>
      </div>

      <div className="m-4 mt-1 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="bg-gradient-to-tr from-[#654EDA] via-[#7B61FF] to-[#654EDA] flex items-end justify-between">
          <div className="flex items-center justify-start pl-6 ">
            <div className="bg-white rounded-sm h-8 w-8 flex justify-center items-center">
              <ScrollText size={20} />
            </div>
            <CardHeader className="">
              <CardDescription className="text-white">
                Total Sales
              </CardDescription>
              <CardTitle className="text-white">
                {makeBDPrice(totalSales)}
              </CardTitle>
            </CardHeader>
          </div>
          <CardHeader className="text-white">{show}</CardHeader>
        </Card>

        <Card className="flex items-end justify-between">
          <div className="flex items-center justify-start pl-6 ">
            <div className="bg-[#FFF3DBEE] rounded-sm h-8 w-8 flex justify-center items-center">
              <ClipboardCheck size={20} color="#FFAA00" />
            </div>
            <CardHeader className="">
              <CardDescription className="">Total COGS</CardDescription>
              <CardTitle className="">{makeBDPrice(totalCOGS)}</CardTitle>
            </CardHeader>
          </div>
          <CardHeader className="">{show}</CardHeader>
        </Card>

        <Card className="flex items-end justify-between">
          <div className="flex items-center justify-start pl-6 ">
            <div className="bg-[#FFF3DBEE] rounded-sm h-8 w-8 flex justify-center items-center">
              <ClipboardCheck size={20} color="#FFAA00" />
            </div>
            <CardHeader className="">
              <CardDescription className="">Profit</CardDescription>
              <CardTitle className="">
                {makeBDPrice(totalSales - totalCOGS)}
              </CardTitle>
            </CardHeader>
          </div>
          <CardHeader className="">{show}</CardHeader>
        </Card>

        <Card className="flex items-end justify-between">
          <div className="flex items-center justify-start pl-6 ">
            <div className="bg-[#FFF3DBEE] rounded-sm h-8 w-8 flex justify-center items-center">
              <ClipboardCheck size={20} color="#FFAA00" />
            </div>
            <CardHeader className="">
              <CardDescription className="">Total Due Amount</CardDescription>
              <CardTitle className="">{makeBDPrice(totalDueAmount)}</CardTitle>
            </CardHeader>
          </div>
          <CardHeader className="">{show}</CardHeader>
        </Card>

        <Card className="flex items-end justify-between">
          <div className="flex items-center justify-start pl-6 ">
            <div className="bg-[#FFF3DBEE] rounded-sm h-8 w-8 flex justify-center items-center">
              <ClipboardCheck size={20} color="#FFAA00" />
            </div>
            <CardHeader className="">
              <CardDescription className="">Total Paid Amount</CardDescription>
              <CardTitle className="">{makeBDPrice(totalPaidAmount)}</CardTitle>
            </CardHeader>
          </div>
          <CardHeader className="">{show}</CardHeader>
        </Card>

        <Card className="flex items-center justify-start pl-6">
          <div className="bg-[#FFDCF7] rounded-sm h-8 w-8 flex justify-center items-center">
            <Boxes size={20} color="#FF1BCD" />
          </div>
          <CardHeader>
            <CardDescription>Stock Value</CardDescription>
            <CardTitle>
              {makeBDPrice(String(stockSummary.totalStockValue))}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="flex items-end justify-between">
          <div className="flex items-center justify-start pl-6 ">
            <div className="bg-[#DDFFE2] rounded-sm h-8 w-8 flex justify-center items-center">
              <ShoppingBag size={20} color="#29CC6A" />
            </div>
            <CardHeader className="">
              <CardDescription className="">Total Orders</CardDescription>
              <CardTitle className="">{totalOrders}</CardTitle>
            </CardHeader>
          </div>
          <CardHeader className="">{show}</CardHeader>
        </Card>

        <Card className="flex items-center justify-start pl-6">
          <div className="bg-blue-200 rounded-sm h-8 w-8 flex justify-center items-center">
            <Users size={20} color="blue" />
          </div>
          <CardHeader>
            <CardDescription>Total Customer</CardDescription>
            <CardTitle>{customers.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="flex items-center justify-start pl-6">
          <div className="bg-[#EDEAFF] rounded-sm h-8 w-8 flex justify-center items-center">
            <UsersRound size={20} color="#7B61FF" />
          </div>
          <CardHeader>
            <CardDescription>Total Staff</CardDescription>
            <CardTitle>{users.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="m-4 mt-1 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Sales Report</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {branches.map((branch) => (
              <Card key={branch.id} className="bg-black">
                <CardHeader>
                  <CardDescription className="text-white flex justify-between items-end">
                    <div>
                      <h1>{branch.name}</h1>
                      <Label className="text-lg">
                        {makeBDPrice(
                          branchWiseTotals[String(branch.id)]?.totalSales || 0,
                        )}
                      </Label>
                    </div>
                    <div className="text-white">{show}</div>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>COGS Report</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {branches.map((branch) => (
              <Card key={branch.id} className="bg-black">
                <CardHeader>
                  <CardDescription className="text-white flex justify-between items-end">
                    <div>
                      <h1>{branch.name}</h1>
                      <Label className="text-lg">
                        {makeBDPrice(
                          branchWiseTotals[String(branch.id)]?.totalCOGS || 0,
                        )}
                      </Label>
                    </div>
                    <div className="text-white">{show}</div>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders Report</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {branches.map((branch) => (
              <Card key={branch.id} className="bg-black">
                <CardHeader className="">
                  <CardDescription className="text-white flex justify-between items-end">
                    <div>
                      <h1>{branch.name}</h1>
                      <Label className="text-lg">
                        {branchWiseTotals[String(branch.id)]?.totalOrders || 0}
                      </Label>
                    </div>
                    <p className="text-white">{show}</p>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="hidden">
        <ReportPage
          ref={printerRef}
          customers={customers}
          users={users}
          totalCOGS={totalCOGS}
          totalOrders={totalOrders}
          totalSales={totalSales}
          totalDueAmount={totalDueAmount}
          totalPaidAmount={totalPaidAmount}
          totalStockValue={Number(stockSummary.totalStockValue)}
          branches={branches}
          branchWiseTotals={branchWiseTotals}
        />
      </div>
    </div>
  );
}
