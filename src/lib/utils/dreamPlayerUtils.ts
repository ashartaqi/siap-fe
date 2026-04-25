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
  // 1. Try to find the stat in player_stats (outfield players)
  if (player.player_stats) {
    const stats = player.player_stats as unknown as Record<string, unknown>;
    // Map internal StatKey to IPlayerStats keys
    const keyMap: Record<StatKey, string> = {
      pace: "pace",
      shooting: "shooting",
      passing: "passing",
      dribbling: "dribbling",
      defending: "defending",
      physic: "physic",
    };
    const val = stats[keyMap[stat]];
    if (typeof val === "number" && val > 0) return val;
  }

  // 2. Try to find the stat in goalkeeper_stats (GK)
  // For GK, we might want to map some stats if possible, but usually Dream Player uses outfield stats.
  // If it's a GK, we can try to use their speed for pace, etc. but it's cleaner to fallback to overall if it's a mismatch.
  if (player.goalkeeper_stats) {
    const gk = player.goalkeeper_stats as unknown as Record<string, unknown>;
    if (stat === "pace") return Number(gk.speed) || player.overall;
  }

  // 3. Fallback to Overall rating if specific stat is missing or 0
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
