import { POSItem } from "@/app/(admin-panel)/pos/item-selector";
import { StockPayload } from "@/app/(admin-panel)/stock-transfer/transfer-products/transfer-layout";
import { Branches, ChallanItems, OrderItems, SalesData } from "@/types/shared";
import { createBarcode } from "@/utils/barcode";
import { createOrderId } from "@/utils/order_id";
import { create } from "zustand";

type BranchWiseTotals = {
  totalOrders: number;
  totalSales: number;
  totalCOGS: number;
};

type POSStore = {
  itemList: POSItem[];
  exchangeItemList: OrderItems[];
  returnItemList: OrderItems[];
  addExchangeItemList: OrderItems[];
  challanItemList: ChallanItems[];
  addItem: (item: POSItem) => void;
  updateItemQty: (barcode: string, quantity: number) => void;
  removeItem: (barcode: string) => void;
  addExchangeItem: (item: OrderItems) => void;
  moveToReturn: (barcode: string) => void;
  updateExchangeItemQty: (barcode: string, quantity: number) => void;
  removeExchangeItem: (barcode: string) => void;
  addItemToExchange: (item: OrderItems) => void;
  addChallanItem: (item: ChallanItems[]) => void;
  discount: number;
  discountBdt: number;
  deliveryCharge: number;
  vatRate: number;
  lastSerialNumber: number;
  subtotal: number;
  subExgTotal: number;
  totalQty: number;
  totalExgQty: number;
  total: number;
  exgTotal: number;
  customerName: string;
  customerPhone: string;
  lastOrderDate: string;
  customerAddress: string;
  orderId: string;
  generatedBarcode: string;
  challanNo: string;
  calculateTotals: () => void;
  calculateExgTotals: () => void;
  setCustomerDetails: (name: string, phone: string, address: string) => void;
  setOrderId: () => void;
  setBarcode: () => void;
  setChallanNo: () => void;
  setDeliveryCharge: (charge: number) => void;
  setDiscountAmount: (amount: number) => void;
  setBdtDiscountAmount: (amount: number) => void;
  totalOrders: number;
  totalSales: number;
  totalCOGS: number;
  totalVAT: number;
  totalStockQty: number;
  totalStockValue: number;
  totalSellValue: number;
  calculateSalesTotals: (salesData: SalesData[]) => void;
  calculateStockValue: (stocks: StockPayload[]) => void;
  calculateTotalStockQty: (value: number) => void;
  calculateTotalStockValue: (value: number) => void;
  calculateTotalSellValue: (value: number) => void;
  resetItemList: () => void;
  resetExchangeItemList: () => void;
  resetAddExchangeItemList: () => void;
  resetReturnItemList: () => void;
  branchWiseTotals: Record<string, BranchWiseTotals>;
  calculateBranchWiseTotals: (
    salesData: SalesData[],
    branches: Branches[]
  ) => void;
};

export const usePOSStore = create<POSStore>((set, get) => ({
  itemList: [],
  exchangeItemList: [],
  returnItemList: [],
  addExchangeItemList: [],
  challanItemList: [],
  discount: 0,
  discountBdt: 0,
  lastSerialNumber: 0,
  deliveryCharge: 0,
  vatRate: 0,
  subtotal: 0,
  subExgTotal: 0,
  totalQty: 0,
  totalExgQty: 0,
  total: 0,
  exgTotal: 0,
  customerName: "",
  customerPhone: "",
  customerAddress: "",
  lastOrderDate: "",
  orderId: "",
  generatedBarcode: "",
  challanNo: "",
  totalOrders: 0,
  totalSales: 0,
  totalCOGS: 0,
  totalVAT: 0,
  totalStockQty: 0,
  totalStockValue: 0,
  totalSellValue: 0,
  branchWiseTotals: {},

  calculateTotals: () => {
    const state = get();
    const subtotal = state.itemList.reduce(
      (sum, item) => sum + item.quantity * item.selling_price,
      0
    );
    const totalQty = state.itemList.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const total =
      Math.round(subtotal * (1 + state.vatRate / 100)) -
      Math.round((subtotal * state.discount) / 100) -
      Math.round(state.discountBdt) +
      state.deliveryCharge;

    set({
      subtotal,
      totalQty,
      total,
    });
  },

  calculateExgTotals: () => {
    const state = get();
    const subExgTotal = state.exchangeItemList.reduce(
      (sum, item) => sum + item.quantity * item.sellingPrice,
      0
    );
    const totalExgQty = state.exchangeItemList.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const exgTotal =
      subExgTotal * (1 + state.vatRate / 100) -
      state.discount / 100 -
      state.discountBdt +
      state.deliveryCharge;

    set({
      subExgTotal,
      totalExgQty,
      exgTotal,
    });
  },

  calculateSalesTotals: (salesData) => {
    const state = get();
    const totalOrders = salesData.length;
    const totalSales = salesData.reduce((acc, order) => acc + order.total, 0);
    const totalCOGS = salesData.reduce(
      (acc, order) => acc + order.cost_of_goods_sold,
      0
    );
    const totalVAT = salesData.reduce(
      (acc, order) => acc + (order.vat || 0),
      0
    );

    set({
      totalOrders,
      totalSales,
      totalCOGS,
      totalVAT,
    });
  },

  calculateStockValue: (stocks) => {
    const totalStockValue = stocks.reduce((acc, stock) => acc + stock.cost, 0);

    set({ totalStockValue });
  },

  calculateTotalStockQty: (value) => {
    set({ totalStockQty: value });
  },

  calculateTotalStockValue: (value) => {
    set({ totalStockValue: value });
  },

  calculateTotalSellValue: (value) => {
    set({ totalSellValue: value });
  },

  calculateBranchWiseTotals: (salesData, branches) => {
    const branchWiseTotals = branches.reduce<Record<string, BranchWiseTotals>>(
      (acc, branch) => {
        const branchSales = salesData.filter(
          (order) => order.branchId === branch.id
        );
        acc[String(branch.id)] = {
          totalOrders: branchSales.length,
          totalSales: branchSales.reduce((sum, order) => sum + order.total, 0),
          totalCOGS: branchSales.reduce(
            (sum, order) => sum + order.cost_of_goods_sold,
            0
          ),
        };
        return acc;
      },
      {}
    );

    set({ branchWiseTotals });
  },

  addItem: (item) => {
    const state = get();
    const existingItem = state.itemList.find((i) => i.barcode === item.barcode);

    let updatedItemList;
    // if (state.itemList.length === 0) {
    //   state.setOrderId();
    // }
    if (existingItem) {
      updatedItemList = state.itemList.map((i) =>
        i.barcode === item.barcode
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    } else {
      updatedItemList = [...state.itemList, item];
    }

    set({
      itemList: updatedItemList,
    });

    state.calculateTotals(); // Recalculate totals
  },

  resetItemList: () => {
    const state = get();
    set({
      itemList: [],
      orderId: "",
    });

    state.calculateTotals();
  },

  resetExchangeItemList: () => {
    const state = get();
    set({
      exchangeItemList: [],
      orderId: "",
    });

    state.calculateTotals();
  },

  resetAddExchangeItemList: () => {
    const state = get();
    set({
      addExchangeItemList: [],
      orderId: "",
    });

    state.calculateTotals();
  },
  resetReturnItemList: () => {
    const state = get();
    set({
      returnItemList: [],
      orderId: "",
    });

    state.calculateTotals();
  },

  updateItemQty: (barcode, quantity) => {
    const state = get();
    const updatedItemList = state.itemList.map((item) =>
      item.barcode === barcode ? { ...item, quantity } : item
    );
    set({ itemList: updatedItemList });
    state.calculateTotals();
  },

  removeItem: (barcode) => {
    const state = get();
    const updatedItemList = state.itemList.filter(
      (item) => item.barcode !== barcode
    );
    set({ itemList: updatedItemList });
    state.calculateTotals();
  },

  addExchangeItem: (item) => {
    const state = get();
    const existingItem = state.exchangeItemList.find(
      (i) => i.barcode === item.barcode
    );

    let updatedExchangeItemList;
    if (existingItem) {
      updatedExchangeItemList = state.exchangeItemList.map((i) =>
        i.barcode === item.barcode
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    } else {
      updatedExchangeItemList = [...state.exchangeItemList, item];
    }

    set({
      exchangeItemList: updatedExchangeItemList,
    });

    state.calculateExgTotals(); // Recalculate totals
  },

  addChallanItem: (item) => {
    const state = get();
    // const existingChallanItem = state.challanItemList.find(
    //   (i) => i.challan_no === item.challan_no
    // );

    // let updatedItemChallanList;
    // if (existingChallanItem) {
    //   updatedItemChallanList = state.challanItemList.map((i) =>
    //     i.challan_no === item.challan_no
    //       ? { ...i, quantity: i.quantity + item.quantity }
    //       : i
    //   );
    // } else {
    //   updatedItemChallanList = [...state.challanItemList, item];
    // }

    set({
      challanItemList: item,
    });
  },

  updateExchangeItemQty: (barcode, quantity) => {
    const state = get();
    const updatedItemList = state.itemList.map((item) =>
      item.barcode === barcode ? { ...item, quantity } : item
    );
    set({ itemList: updatedItemList });
    state.calculateExgTotals();
  },

  moveToReturn: (barcode: string | undefined) => {
    const state = get();
    const itemToReturn = state.exchangeItemList.find(
      (item) => item.barcode === barcode
    );
    if (itemToReturn) {
      const updatedExchangeItemList = state.exchangeItemList.filter(
        (item) => item.barcode !== barcode
      );
      set({
        exchangeItemList: updatedExchangeItemList,
        returnItemList: [...state.returnItemList, itemToReturn],
      });
      state.calculateExgTotals(); // Recalculate totals after update
    }
  },

  addItemToExchange: (item) => {
    const state = get();
    const existingItem = state.exchangeItemList.find(
      (i) => i.barcode === item.barcode
    );

    let updatedExchangeItemList;
    if (existingItem) {
      updatedExchangeItemList = state.exchangeItemList.map((i) =>
        i.barcode === item.barcode
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    } else {
      updatedExchangeItemList = [...state.exchangeItemList, item];
    }

    set({
      exchangeItemList: updatedExchangeItemList,
      addExchangeItemList: [...state.addExchangeItemList, item],
    });

    state.calculateExgTotals();
  },

  removeExchangeItem: (barcode) => {
    const state = get();
    const updatedItemList = state.exchangeItemList.filter(
      (item) => item.barcode !== barcode
    );
    set({ exchangeItemList: updatedItemList });
    state.calculateExgTotals();
  },

  setCustomerDetails: (name, phone, address) =>
    set({ customerName: name, customerPhone: phone, customerAddress: address }),

  setOrderId: async () => {
    const newOrderId = await createOrderId();
    set({ orderId: newOrderId });
  },

  setBarcode: async () => {
    // const newBarcode = await createBarcode();
    // set({ generatedBarcode: newBarcode });
  },

  setChallanNo: () => {
    const date = new Date();
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}${String(
      date.getMonth() + 1
    ).padStart(2, "0")}${String(date.getFullYear()).slice(2)}`;
    const time = date.toTimeString().split(" ")[0].replace(/:/g, "");
    const serialNumber = String(Math.floor(Math.random() * 1000)).padStart(
      3,
      "0"
    );

    const newChallanNo = `${formattedDate}-${serialNumber}`;
    set({ challanNo: newChallanNo });
  },

  setDeliveryCharge: (charge) => {
    set({ deliveryCharge: charge });
    get().calculateTotals();
  },

  // setDiscountAmount: (amount) => {
  //   set({ discount: amount });
  //   get().calculateTotals();
  // },
  setDiscountAmount: (amount) => {
    set((state) => ({
      discount: state.discount === amount ? 0 : amount,
    }));
    get().calculateTotals();
  },

  setBdtDiscountAmount: (amount) => {
    set({ discountBdt: amount });
    get().calculateTotals();
  },
}));
