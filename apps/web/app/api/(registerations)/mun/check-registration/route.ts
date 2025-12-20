import { NextRequest } from "next/server";
import { getMunUserByFirebaseUid, getTeamMembers, updateTeammateFirebaseUid } from "@repo/database";
import { handleResponse, handleApiError, requireAuth } from "@repo/shared-utils/server";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    let munUser = await getMunUserByFirebaseUid(auth.uid);

    if (!munUser && auth.email) {
      const updated = await updateTeammateFirebaseUid(auth.email, auth.uid);
      if (updated) {
        munUser = await getMunUserByFirebaseUid(auth.uid);
      }
    }

    if (!munUser) {
      return handleResponse({ isRegistered: false });
    }

    let teamLeaderName: string | undefined;
    if (munUser.teamId && !munUser.isTeamLeader) {
      const teamMembers = await getTeamMembers(munUser.teamId);
      const leader = teamMembers.find((m) => m.isTeamLeader);
      teamLeaderName = leader?.name;
    }

    return handleResponse({
      isRegistered: true,
      userId: munUser.id,
      name: munUser.name,
      email: munUser.email,
      isPaymentVerified: munUser.isVerified,
      isTeamMember: !!munUser.teamId,
      isTeamLeader: munUser.isTeamLeader || false,
      teamId: munUser.teamId,
      teamLeaderName,
    });
  } catch (error) {
    return handleApiError(error, "Failed to check MUN registration status");
  }
}
