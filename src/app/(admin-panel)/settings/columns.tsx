"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Settings } from "@/types/shared";
import { formatDate } from "date-fns";
import React from "react";
import Image from "next/image";
import { SettingDetailSheet } from "./details";
import { fileUrlGenerator } from "@/utils/helpers";

export const columns: ColumnDef<Settings>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Date",
    accessorKey: "created_at",
    cell: ({ row }) =>
      formatDate(String(row.original.created_at), "dd/MM/yyyy"),
  },
  {
    header: "Return & Privacy Policy",
    accessorKey: "return_privacy_policy",
    cell: ({ row }) => (
      <div
        dangerouslySetInnerHTML={{
          __html: String(row.original.return_privacy_policy),
        }}
      />
    ),
  },
  // {
  //   header: "VAT Rate",
  //   accessorKey: "vat_rate",
  // },
  {
    header: "Login Image",
    accessorKey: "login_image_url",
    cell: ({ row }) => {
      return row.original.login_image_url ? (
        <Image
          src={fileUrlGenerator(row.original.login_image_url)}
          alt="Login Image"
          width={100}
          height={100}
        />
      ) : (
        <p>No Image</p>
      );
    },
  },
  {
    header: "Brand Logo",
    accessorKey: "logo_image_url",
    cell: ({ row }) => {
      return row.original.logo_image_url ? (
        <Image
          src={fileUrlGenerator(row.original.logo_image_url)}
          alt="Logo"
          width={100}
          height={100}
        />
      ) : (
        <p>No Image</p>
      );
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return <SettingDetailSheet setting={row.original} />;
    },
  },
];
