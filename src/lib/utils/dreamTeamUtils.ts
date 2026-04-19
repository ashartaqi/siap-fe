import {
  ATTACK_POSITIONS,
  MIDFIELD_POSITIONS,
  DEFENSE_POSITIONS,
} from "@/lib/constants";

export function categorizePosition(
  pos: string,
): "attack" | "midfield" | "defense" | "gk" {
  if (pos === "GK") return "gk";
  if (ATTACK_POSITIONS.includes(pos)) return "attack";
  if (MIDFIELD_POSITIONS.includes(pos)) return "midfield";
  if (DEFENSE_POSITIONS.includes(pos)) return "defense";
  return "midfield";
}
