import { Branches } from "@/types/shared";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface useBranchStore {
  branch: Branches;
  setBranch: (branch: Branches) => void;
  clearBranch: () => void;
}

const undefinedBranch = {
  id: 0,
  name: "",
  address: "",
  phone: "",
  root: false,
}

export const useBranch = create(
  persist<useBranchStore>(
    (set) => ({
      branch: undefinedBranch,
      setBranch: (branch: Branches) => {
        set({ branch });
      },
      clearBranch: () => {
        set({
          branch: undefinedBranch,
        });
      },
    }),
    {
      name: "branch",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
