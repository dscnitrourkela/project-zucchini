"use client";

import { useEffect, useState } from "react";
import { Users, CheckCircle, Clock, School } from "lucide-react";
import Header from "@/components/header";
import { DataTable } from "@/components/ui/data-table/data-table";
import {
  nitrutsavColumns,
  NitrutsavRegistration,
} from "@/components/ui/data-table/nitrutsav-columns";

type Stats = {
  total: number;
  male: number;
  female: number;
  verified: number;
  pending: number;
  nitrStudents: number;
};

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400">{title}</p>
          <p className="mt-1 text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`rounded-full p-3 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function NitrutsavPage() {
  const [data, setData] = useState<NitrutsavRegistration[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/registrations/nitrutsav?stats=true&pageSize=1000");
        const json = await res.json();
        if (json.success) {
          setData(json.data.registrations);
          setStats(json.data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch registrations:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="NITRUTSAV Registrations"
        subtitle={
          stats
            ? `Total: ${stats.total} | Male: ${stats.male} | Female: ${stats.female}`
            : undefined
        }
        Icon={Users}
      />

      <main className="mx-auto px-6 py-8">
        {stats && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Registrations"
              value={stats.total}
              icon={Users}
              color="bg-blue-500/20 text-blue-400"
            />
            <StatCard
              title="Payment Verified"
              value={stats.verified}
              icon={CheckCircle}
              color="bg-emerald-500/20 text-emerald-400"
            />
            <StatCard
              title="Payment Pending"
              value={stats.pending}
              icon={Clock}
              color="bg-amber-500/20 text-amber-400"
            />
            <StatCard
              title="NITR Students"
              value={stats.nitrStudents}
              icon={School}
              color="bg-purple-500/20 text-purple-400"
            />
          </div>
        )}

        <DataTable columns={nitrutsavColumns} data={data} />
      </main>
    </div>
  );
}
