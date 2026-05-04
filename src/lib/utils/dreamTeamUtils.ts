import {
  ATTACK_POSITIONS,
  MIDFIELD_POSITIONS,
  DEFENSE_POSITIONS,
} from "@/lib/constants";

export function categorizePosition(
  pos: string,
  validPlayerPositions?: Record<string, string[]>,
): "attack" | "midfield" | "defense" | "gk" {
  if (pos === "GK") return "gk";

  if (validPlayerPositions) {
    if (validPlayerPositions.attacking?.includes(pos)) return "attack";
    if (validPlayerPositions.midfield?.includes(pos)) return "midfield";
    if (validPlayerPositions.defense?.includes(pos)) return "defense";
    return "midfield";
  }

  // Fallback to locally mirrored constants
  if (ATTACK_POSITIONS.includes(pos)) return "attack";
  if (MIDFIELD_POSITIONS.includes(pos)) return "midfield";
  if (DEFENSE_POSITIONS.includes(pos)) return "defense";
  return "midfield";
}
