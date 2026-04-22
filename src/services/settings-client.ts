import { Settings } from "@/types/shared";

export async function fetchSetting(): Promise<Settings | undefined> {
  try {
    const response = await fetch("/api/settings", { cache: "no-store" });

    if (!response.ok) {
      return undefined;
    }

    return (await response.json()) as Settings;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return undefined;
  }
}
