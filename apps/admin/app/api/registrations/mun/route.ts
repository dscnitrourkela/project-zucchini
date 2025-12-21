import { NextResponse } from "next/server";
import { getPaginatedMunRegistrations, getMunStatistics, getMunTeamsGrouped } from "@repo/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0");
    const pageSize = parseInt(searchParams.get("pageSize") || "50");
    const includeStats = searchParams.get("stats") === "true";
    const groupByTeam = searchParams.get("groupByTeam") === "true";

    let registrations;

    if (groupByTeam) {
      const teams = await getMunTeamsGrouped();
      registrations = {
        teams: teams.map((team) => ({
          teamId: team.teamId,
          committeeChoice: team.committeeChoice,
          studentType: team.studentType,
          isPaymentVerified: team.isPaymentVerified,
          paymentAmount: team.paymentAmount,
          members: team.members.map((m) => ({
            id: m.registration.id,
            name: m.registration.name,
            email: m.registration.email,
            phone: m.registration.phone,
            gender: m.registration.gender,
            institute: m.registration.institute,
            city: m.registration.city,
            state: m.registration.state,
            isTeamLeader: m.registration.isTeamLeader,
            studentType: m.registration.studentType,
            committeeChoice: m.registration.committeeChoice,
            isNitrStudent: m.registration.isNitrStudent,
            registeredAt: m.registration.registeredAt,
          })),
        })),
      };
    } else {
      const data = await getPaginatedMunRegistrations(pageSize, page);
      registrations = {
        registrations: data.registrations.map((r) => ({
          id: r.id,
          teamId: r.teamId,
          isTeamLeader: r.isTeamLeader,
          name: r.name,
          email: r.email,
          phone: r.phone,
          gender: r.gender,
          studentType: r.studentType,
          institute: r.institute,
          city: r.city,
          state: r.state,
          committeeChoice: r.committeeChoice,
          isNitrStudent: r.isNitrStudent,
          isVerified: r.isVerified,
          isPaymentVerified: r.isPaymentVerified,
          registeredAt: r.registeredAt,
        })),
        pagination: {
          hasMore: data.hasMore,
          total: data.total,
          page: data.page,
          pageSize: data.pageSize,
        },
      };
    }

    let stats = null;
    if (includeStats) {
      stats = await getMunStatistics();
    }

    return NextResponse.json({
      success: true,
      data: {
        ...registrations,
        stats,
      },
    });
  } catch (error) {
    console.error("Error fetching MUN registrations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}
