import type {
  IDreamPlayerResponse,
  IDreamTeamResponse,
} from "@/features/main/dashboard/types";
import type { SelectedPlayers } from "@/features/main/dashboard/types";

const BATTLE_STATS = [
  "pace",
  "shooting",
  "passing",
  "dribbling",
  "defending",
  "physic",
  "overall",
] as const;

export function comparePlayerStats(
  myPlayer: IDreamPlayerResponse,
  opponentPlayer: IDreamPlayerResponse,
): {
  winner: "me" | "opponent" | "draw";
  myScore: number;
  opponentScore: number;
} {
  let myScore = 0;
  let oppScore = 0;
  BATTLE_STATS.forEach((stat) => {
    const myStat = myPlayer[stat];
    const oppStat = opponentPlayer[stat];
    if (typeof myStat === "number" && typeof oppStat === "number") {
      if (myStat > oppStat) myScore++;
      else if (myStat < oppStat) oppScore++;
    }
  });
  const winner =
    myScore > oppScore ? "me" : oppScore > myScore ? "opponent" : "draw";
  return { winner, myScore, opponentScore: oppScore };
}

export function slotsToPlayers(
  slots: IDreamTeamResponse["slots"],
): SelectedPlayers {
  const players: SelectedPlayers = {};
  slots.forEach((slot) => {
    if (slot.player) {
      const slotId =
        slot.position === "GK"
          ? "GK"
          : `r${slot.row}-c${slot.col}-${slot.position}`;
      players[slotId] = slot.player;
    }
  });
  return players;
}
