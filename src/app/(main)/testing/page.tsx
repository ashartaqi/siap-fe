"use client";

import React, { useState } from "react";
import { DreamTeam } from "@/features/auth/apis/DreamTeam";
import { IPlayersPayload, IPlayersResponse } from "@/features/auth/types";

export default function TestPlayersPage() {
  const [players, setPlayers] = useState<IPlayersResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const fetchPlayers = async () => {
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

    setLoading(true);
    setError("");
    try {
      const data = await DreamTeam(payload);
      setPlayers(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message);
      } else {
        console.error("Unknown error", err);
        setError("Failed to fetch players");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2>Test Players API</h2>

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

      <button onClick={fetchPlayers} disabled={loading}>
        {loading ? "Fetching..." : "Fetch Players"}
      </button>

      {error && <div className="text-red-500 mt-2">{error}</div>}

      {/* PLAYER RESULTS */}
      {players.length > 0 && (
        <div className="mt-4 space-y-2">
          {players.map((p, idx) => (
            <div key={idx} className="border p-2 rounded">
              {p.name} — {p.position} — Overall: {p.overall} — Club: {p.club}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
