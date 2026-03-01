import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { Navbar } from "@/components/admin-panel/navbar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileWarning } from "lucide-react";
import React from "react";

export default function UnAuthorizedPage() {
  return (
    <>
      <Navbar title="" />
      <div className="h-[700px] flex justify-center items-center">
        <Card className="p-6 flex justify-center items-center w-2/3 mx-auto">
          <FileWarning color="orange" size={60} />
          <CardHeader>
            <CardTitle>Upps!</CardTitle>
            <CardDescription>
              You are unauthorized in this route!
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
