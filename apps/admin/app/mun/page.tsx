"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Users,
  CheckCircle,
  Clock,
  Gavel,
  Crown,
  ChevronDown,
  ChevronRight,
  User,
  Search,
  Table,
  LayoutGrid,
} from "lucide-react";
import Header from "@/components/header";
import { DataTable } from "@/components/ui/data-table/data-table";
import { munColumns, MunRegistration } from "@/components/ui/data-table/mun-columns";
import { useMunTeams, useMunRegistrations } from "@/lib/queries";
import { useDebouncedSearch } from "@/lib/hooks/use-debounced-search";
import { searchMunUsers } from "@/lib/api";
import type { Team, TeamMember } from "@/lib/api";

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

function TeamCard({
  team,
  isExpanded,
  onToggle,
}: {
  team: Team;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const leader = team.members.find((m) => m.isTeamLeader);
  const allNitrStudents = team.members.every((m) => m.isNitrStudent);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-zinc-400" />
          ) : (
            <ChevronRight className="h-5 w-5 text-zinc-400" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{leader?.name || "Team"}</span>
              <span className="text-xs font-mono bg-zinc-800 px-2 py-1 rounded text-zinc-400">
                {team.teamId.slice(0, 8)}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">
                Moot Court
              </span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded ${
                  team.studentType === "COLLEGE"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-green-500/20 text-green-400"
                }`}
              >
                {team.studentType}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400">{team.members.length} members</span>
          {allNitrStudents ? (
            <span className="text-xs font-medium px-2 py-1 rounded bg-zinc-700 text-zinc-300">
              N/A
            </span>
          ) : team.isPaymentVerified ? (
            <span className="text-xs font-medium px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Paid
            </span>
          ) : (
            <span className="text-xs font-medium px-2 py-1 rounded bg-amber-500/20 text-amber-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Pending
            </span>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-zinc-800 divide-y divide-zinc-800">
          {team.members.map((member) => (
            <div key={member.id} className="p-4 bg-zinc-950/50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {member.isTeamLeader && <Crown className="h-4 w-4 text-amber-400" />}
                    <span className="font-medium text-zinc-100">{member.name}</span>
                    {member.isTeamLeader && (
                      <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                        Leader
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400 mt-1">{member.email}</p>
                  <p className="text-sm text-zinc-500">{member.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-400">{member.institute}</p>
                  <p className="text-sm text-zinc-500">
                    {member.city}, {member.state}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function IndividualCard({ member }: { member: TeamMember }) {
  const committeeLabels: Record<string, string> = {
    UNHRC: "UNHRC",
    UNGA_DISEC: "UNGA DISEC",
    ECOSOC: "ECOSOC",
    AIPPM: "AIPPM",
    IP_PHOTOGRAPHER: "IP - Photo",
    IP_JOURNALIST: "IP - Journal",
    UNSC_OVERNIGHT_CRISIS: "UNSC Crisis",
    AIPPM_OVERNIGHT_CRISIS: "AIPPM Crisis",
  };
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-full p-2 bg-orange-500/20 text-orange-400">
            <User className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{member.name}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-orange-500/20 text-orange-400">
                {committeeLabels[member.committeeChoice] || member.committeeChoice}
              </span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded ${
                  member.studentType === "COLLEGE"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-green-500/20 text-green-400"
                }`}
              >
                {member.studentType}
              </span>
            </div>
            <p className="text-sm text-zinc-400 mt-1">{member.email}</p>
            <p className="text-sm text-zinc-500">{member.phone}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-zinc-400">{member.institute}</p>
          <p className="text-sm text-zinc-500">
            {member.city}, {member.state}
          </p>
          {member.isNitrStudent ? (
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-zinc-700 text-zinc-300 inline-block mt-2">
              NITR - N/A
            </span>
          ) : (
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 inline-block mt-2">
              Payment Required
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ViewToggle({
  view,
  onViewChange,
}: {
  view: "cards" | "table";
  onViewChange: (view: "cards" | "table") => void;
}) {
  return (
    <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
      <button
        onClick={() => onViewChange("cards")}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          view === "cards" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-zinc-200"
        }`}
      >
        <LayoutGrid className="h-4 w-4" />
        Cards
      </button>
      <button
        onClick={() => onViewChange("table")}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          view === "table" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-zinc-200"
        }`}
      >
        <Table className="h-4 w-4" />
        Table
      </button>
    </div>
  );
}

export default function MunPage() {
  const { data: teamsData, isLoading: teamsLoading } = useMunTeams();
  const { data: registrationsData, isLoading: registrationsLoading } = useMunRegistrations();
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"cards" | "table">("table");
  const [searchQuery, setSearchQuery] = useState("");

  const loading = teamsLoading || registrationsLoading;

  const allRegistrations = useMemo(
    () => (registrationsData?.registrations || []) as unknown as MunRegistration[],
    [registrationsData?.registrations]
  );

  const searchFields = useMemo(() => ["email", "name", "phone"] as (keyof MunRegistration)[], []);

  const handleDatabaseSearch = useCallback(async (query: string) => {
    const results = await searchMunUsers(query);
    return results as unknown as MunRegistration[];
  }, []);

  const {
    results: searchResults,
    isSearching,
    isFromDatabase,
  } = useDebouncedSearch({
    data: allRegistrations,
    searchQuery,
    searchFields,
    debounceMs: 400,
    minQueryLength: 2,
    onDatabaseSearch: handleDatabaseSearch,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  const stats = teamsData?.stats;
  const teams = (teamsData?.teams || []).filter(
    (t: Team) => t.teamId && t.committeeChoice === "MOOT_COURT"
  );
  const individuals = (registrationsData?.registrations || []).filter(
    (r: TeamMember) => !r.isTeamLeader || r.committeeChoice !== "MOOT_COURT"
  );

  const toggleTeam = (teamId: string) => {
    setExpandedTeams((prev) => {
      const next = new Set(prev);
      if (next.has(teamId)) {
        next.delete(teamId);
      } else {
        next.add(teamId);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen">
      <Header
        title="MUN Registrations"
        subtitle={
          stats
            ? `Total: ${stats.total} | Teams: ${teams.length} | Individuals: ${individuals.length}`
            : undefined
        }
        Icon={Gavel}
      />

      <main className="mx-auto px-6 py-8">
        {stats && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Participants"
              value={stats.total}
              icon={Users}
              color="bg-blue-500/20 text-blue-400"
            />
            <StatCard
              title="Moot Court Teams"
              value={teams.length}
              icon={Users}
              color="bg-purple-500/20 text-purple-400"
            />
            <StatCard
              title="Solo Registrations"
              value={individuals.length}
              icon={User}
              color="bg-orange-500/20 text-orange-400"
            />
            <StatCard
              title="Payment Pending"
              value={stats.pending}
              icon={Clock}
              color="bg-amber-500/20 text-amber-400"
            />
          </div>
        )}

        {/* View Toggle and Search */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <ViewToggle view={view} onViewChange={setView} />

          {view === "table" && (
            <div className="relative max-w-md w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-zinc-400"></div>
                </div>
              )}
            </div>
          )}
        </div>

        {view === "table" ? (
          <DataTable columns={munColumns} data={searchResults} />
        ) : (
          <>
            {/* Moot Court Teams Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                Moot Court Teams
              </h2>
              <div className="space-y-4">
                {teams.map((team) => (
                  <TeamCard
                    key={team.teamId}
                    team={team}
                    isExpanded={expandedTeams.has(team.teamId)}
                    onToggle={() => toggleTeam(team.teamId)}
                  />
                ))}
                {teams.length === 0 && (
                  <div className="text-center py-8 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                    No Moot Court teams registered yet.
                  </div>
                )}
              </div>
            </div>

            {/* Solo Registrations Section */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                Solo Registrations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {individuals.map((member) => (
                  <IndividualCard key={member.id} member={member} />
                ))}
                {individuals.length === 0 && (
                  <div className="text-center py-8 text-zinc-500 border border-dashed border-zinc-800 rounded-xl col-span-2">
                    No solo registrations yet.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
