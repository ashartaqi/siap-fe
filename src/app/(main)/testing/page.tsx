"use client";

import React, { useState } from "react";
import {
  useGetPlayers,
  IPlayersPayload,
  IPlayersResponse,
} from "@/features/main/dashboard";

export default function TestPlayersPage() {
  // FILTER STATES
  const [name, setName] = useState("");
  const [teamId, setTeamId] = useState<number | undefined>();
  const [minOverall, setMinOverall] = useState<number | undefined>();
  const [maxOverall, setMaxOverall] = useState<number | undefined>();
  const [position, setPosition] = useState("");
  const [nationalityName, setNationalityName] = useState("");
  const [minAge, setMinAge] = useState<number | undefined>();
  const [maxAge, setMaxAge] = useState<number | undefined>();
  const [preferredFoot, setPreferredFoot] = useState("");

  const payload: IPlayersPayload = {
    limit: 10,
    name: name || undefined,
    teamId,
    minOverall,
    maxOverall,
    position: position || undefined,
    nationalityName: nationalityName || undefined,
    minAge,
    maxAge,
    preferredFoot: preferredFoot || undefined,
  };

  const {
    data: players = [],
    isLoading,
    isError,
    error,
  } = useGetPlayers(payload);

  return (
    <div className="p-6">
      <h2>Test Players API (Auto-fetch with useQuery)</h2>

      {/* FILTER INPUTS */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
        <input
          placeholder="Team ID"
          type="number"
          value={teamId ?? ""}
          onChange={(e) => setTeamId(Number(e.target.value))}
          className="input"
        />
        <input
          placeholder="Min Overall"
          type="number"
          value={minOverall ?? ""}
          onChange={(e) => setMinOverall(Number(e.target.value))}
          className="input"
        />
        <input
          placeholder="Max Overall"
          type="number"
          value={maxOverall ?? ""}
          onChange={(e) => setMaxOverall(Number(e.target.value))}
          className="input"
        />
        <input
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="input"
        />
        <input
          placeholder="Nationality"
          value={nationalityName}
          onChange={(e) => setNationalityName(e.target.value)}
          className="input"
        />
        <input
          placeholder="Min Age"
          type="number"
          value={minAge ?? ""}
          onChange={(e) => setMinAge(Number(e.target.value))}
          className="input"
        />
        <input
          placeholder="Max Age"
          type="number"
          value={maxAge ?? ""}
          onChange={(e) => setMaxAge(Number(e.target.value))}
          className="input"
        />
        <input
          placeholder="Preferred Foot"
          value={preferredFoot}
          onChange={(e) => setPreferredFoot(e.target.value)}
          className="input"
        />
      </div>

      {isLoading && <div>Loading players...</div>}
      {isError && (
        <div className="text-red-500 mt-2">
          {error instanceof Error ? error.message : "Failed to fetch players"}
        </div>
      )}

      {/* PLAYER RESULTS */}
      {!isLoading && players.length > 0 && (
        <div className="mt-4 space-y-2">
          {players.map((p, idx) => (
            <div key={idx} className="border p-2 rounded">
              {p.short_name} — {p.player_positions} — Overall: {p.overall} —
              Club: {p.club_name}
            </div>
          ))}
        </div>
      )}
      {!isLoading && players.length === 0 && !isError && (
        <div>No players found.</div>
      )}
    </div>
  );
}
