import { NextResponse } from "next/server";
import { getPaginatedUsers, getNitrutsavStatistics } from "@repo/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0");
    const pageSize = parseInt(searchParams.get("pageSize") || "50");
    const includeStats = searchParams.get("stats") === "true";

    const data = await getPaginatedUsers(pageSize, page);

    let stats = null;
    if (includeStats) {
      stats = await getNitrutsavStatistics();
    }

    return NextResponse.json({
      success: true,
      data: {
        registrations: data.users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          gender: u.gender,
          institute: u.institute,
          university: u.university,
          rollNumber: u.rollNumber,
          referralCode: u.referralCode,
          isNitrStudent: u.isNitrStudent,
          isVerified: u.isVerified,
          isPaymentVerified: u.transaction?.isVerified || false,
          registeredAt: u.registeredAt,
        })),
        pagination: {
          hasMore: data.hasMore,
          total: data.total,
          page: data.page,
          pageSize: data.pageSize,
        },
        stats,
      },
    });
  } catch (error) {
    console.error("Error fetching NITRUTSAV registrations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}
