import { Navbar } from "@/components/admin-panel/navbar";
import Container from "./container";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div className="w-full">
      <Navbar title={title} />
      <div className="w-full p-3 sm:p-6">
        <Container>{children}</Container>
      </div>
    </div>
  );
}
