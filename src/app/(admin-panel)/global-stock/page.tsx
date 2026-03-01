import { ContentLayout } from "@/components/admin-panel/content-layout";
import { GlobalStockView } from "./stocks";

export default async function GlobalStockPage() {
  return (
    <ContentLayout title="Global Stock">
      <GlobalStockView />
    </ContentLayout>
  );
}
