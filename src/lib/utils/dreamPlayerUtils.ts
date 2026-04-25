import type { IPlayersResponse } from "@/features/main/dashboard/types";
import type { StatKey, PageState, PlayerIdentity } from "@/types/dreamPlayer";
import type { IDreamPlayerResponse } from "@/features/main/dashboard/types";

// Fallback defaults (mirrors backend DEFAULT_IDENTITY / DEFAULT_STATS)
const DEFAULT_IDENTITY_FALLBACK: PlayerIdentity = {
  name: "Your Player",
  position: "ST",
  nationality: "---",
  shirt_number: 7,
  preferred_foot: "Right",
};

const DEFAULT_STAT_FIELD_MAP: Record<string, string> = {
  pace: "pace",
  shooting: "shooting",
  passing: "passing",
  dribbling: "dribbling",
  defending: "defending",
  physic: "physic",
};

/**
 * Return the numeric stat value for a player slot.
 * @param statFieldMap  From useGetPlayerAttributes().data.stat_field_map
 */
export function getStatValue(
  player: IPlayersResponse,
  stat: StatKey,
  statFieldMap?: Record<string, string>,
): number {
  const map = statFieldMap ?? DEFAULT_STAT_FIELD_MAP;
  const field = map[stat];
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

/**
 * Build the page edit-state from a saved dream player response.
 * @param defaultIdentity  From useGetPlayerAttributes().data.default_identity
 */
export function buildPageStateFromSaved(
  saved: IDreamPlayerResponse,
  defaultIdentity?: PlayerIdentity,
): PageState {
  const identity = defaultIdentity ?? DEFAULT_IDENTITY_FALLBACK;
  return {
    mode: "view",
    identity: {
      name: saved.name ?? identity.name,
      position: saved.position ?? identity.position,
      nationality: saved.nationality ?? identity.nationality,
      shirt_number: saved.shirt_number ?? identity.shirt_number,
      preferred_foot:
        (saved.preferred_foot as "Left" | "Right") ?? identity.preferred_foot,
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
