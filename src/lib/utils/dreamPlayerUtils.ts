import type { IPlayersResponse } from "@/features/main/dashboard/types";
import type { StatKey, PageState } from "@/types/dreamPlayer";
import type { IDreamPlayerResponse } from "@/features/main/dashboard/types";
import { STAT_FIELD_MAP, DEFAULT_IDENTITY } from "@/lib/constants";

export function getStatValue(player: IPlayersResponse, stat: StatKey): number {
  const field = STAT_FIELD_MAP[stat];
  const raw = (player as unknown as Record<string, unknown>)[field];
  const coerced =
    typeof raw === "number"
      ? raw
      : typeof raw === "string"
        ? parseFloat(raw)
        : NaN;
  if (!isNaN(coerced) && coerced > 0) return Math.round(coerced);
  // Fallback: use overall when the specific stat is missing/null
  return player.overall ?? 0;
}

export function buildPageStateFromSaved(
  saved: IDreamPlayerResponse,
): PageState {
  return {
    mode: "view",
    identity: {
      name: saved.name ?? DEFAULT_IDENTITY.name,
      position: saved.position ?? DEFAULT_IDENTITY.position,
      nationality: saved.nationality ?? DEFAULT_IDENTITY.nationality,
      shirt_number: saved.shirt_number ?? DEFAULT_IDENTITY.shirt_number,
      preferred_foot:
        (saved.preferred_foot as "Left" | "Right") ??
        DEFAULT_IDENTITY.preferred_foot,
    },
    stats: {
      pace: saved.pace ?? 0,
      shooting: saved.shooting ?? 0,
      passing: saved.passing ?? 0,
      dribbling: saved.dribbling ?? 0,
      defending: saved.defending ?? 0,
      physic: saved.physic ?? 0,
    },
  };
}
