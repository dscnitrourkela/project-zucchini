"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export type NitrutsavRegistration = {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: "MALE" | "FEMALE";
  institute: string;
  university: string;
  rollNumber: string;
  referralCode: string | null;
  isNitrStudent: boolean;
  isVerified: boolean;
  isPaymentVerified: boolean;
  registeredAt: string;
};

export const nitrutsavColumns: ColumnDef<NitrutsavRegistration>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium text-zinc-100">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0 text-zinc-300 hover:text-white"
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="lowercase text-zinc-300">{row.getValue("email")}</span>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <span className="tabular-nums text-zinc-300">{row.getValue("phone")}</span>,
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.getValue("gender") as string;
      return (
        <span
          className={`text-xs font-medium px-2 py-1 rounded ${
            gender === "MALE" ? "bg-blue-500/20 text-blue-400" : "bg-pink-500/20 text-pink-400"
          }`}
        >
          {gender}
        </span>
      );
    },
  },
  {
    accessorKey: "institute",
    header: "Institute",
    cell: ({ row }) => (
      <span className="text-zinc-400 max-w-[200px] truncate block">
        {row.getValue("institute")}
      </span>
    ),
  },
  {
    accessorKey: "isNitrStudent",
    header: "NITR",
    cell: ({ row }) => {
      const isNitr = row.getValue("isNitrStudent") as boolean;
      return isNitr ? (
        <CheckCircle className="h-5 w-5 text-emerald-400" />
      ) : (
        <XCircle className="h-5 w-5 text-zinc-600" />
      );
    },
  },
  {
    accessorKey: "isPaymentVerified",
    header: "Payment",
    cell: ({ row }) => {
      const isVerified = row.getValue("isPaymentVerified") as boolean;
      const isNitr = row.original.isNitrStudent;

      if (isNitr) {
        return (
          <span className="text-xs font-medium px-2 py-1 rounded bg-zinc-700 text-zinc-300">
            N/A
          </span>
        );
      }

      return isVerified ? (
        <span className="text-xs font-medium px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Paid
        </span>
      ) : (
        <span className="text-xs font-medium px-2 py-1 rounded bg-amber-500/20 text-amber-400 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </span>
      );
    },
  },
  {
    accessorKey: "registeredAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0 text-zinc-300 hover:text-white"
      >
        Registered
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("registeredAt"));
      return (
        <span className="text-zinc-400">
          {date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      );
    },
  },
];
