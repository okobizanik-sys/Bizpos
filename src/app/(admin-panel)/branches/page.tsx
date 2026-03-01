import { ContentLayout } from "@/components/admin-panel/content-layout";
import { getBranches } from "@/services/branch";
import { BranchesTable } from "./table";
import { CreateBranchForm } from "./form";

export const revalidate = 0;

export default async function BranchesPage() {
  const branches = await getBranches();

  return (
    <ContentLayout title="Branches">
      <CreateBranchForm />
      <BranchesTable data={branches} />
    </ContentLayout>
  );
}
