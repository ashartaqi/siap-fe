"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { Flag, Hash, Star, Plus, RefreshCw } from "lucide-react";
import { useCreateDreamPlayer } from "@/features/main/dashboard/hooks/useCreateDreamPlayer";
import { useUpdateDreamPlayer } from "@/features/main/dashboard/hooks/useUpdateDreamPlayer";
import { useGetDreamPlayers } from "@/features/main/dashboard/hooks/useGetDreamPlayer";
import { useGetPlayerAttributes } from "@/features/main/football";
import { IDreamPlayerPayload } from "@/features/main/dashboard/types";
import { IPlayersResponse } from "@/features/main/dashboard";
import { PlayerPickerModal } from "@/components/common/PlayerPickerModal";
import { CountryPicker } from "@/components/ui/dream-player/CountryPicker";
import { EditableText } from "@/components/ui/dream-player/EditableText";
import { FootToggle } from "@/components/ui/dream-player/FootToggle";
import { PositionPicker } from "@/components/ui/dream-player/PositionPicker";
import { StatCard } from "@/components/ui/dream-player/StatCard";
import {
  getStatValue,
  buildPageStateFromSaved,
} from "@/lib/utils/dreamPlayerUtils";
import { extractErrorMessage } from "@/lib/utils/errorUtils";
import { CENTER_IMAGE, LEFT_STATS, RIGHT_STATS } from "@/lib/constants";
import type {
  StatKey,
  PlayerIdentity,
  SlotPlayers,
  PageState,
} from "@/types/dreamPlayer";

export default function DreamPlayerPage() {
  const { data: playerAttributes } = useGetPlayerAttributes();

  const defaultIdentity: PlayerIdentity = {
    name: playerAttributes?.default_identity?.name ?? "Your Player",
    position: playerAttributes?.default_identity?.position ?? "ST",
    nationality: playerAttributes?.default_identity?.nationality ?? "---",
    shirt_number: playerAttributes?.default_identity?.shirt_number ?? 7,
    preferred_foot: (playerAttributes?.default_identity?.preferred_foot ??
      "Right") as "Left" | "Right",
  };
  const defaultStats: Record<StatKey, number> = playerAttributes?.default_stats
    ? (playerAttributes.default_stats as Record<StatKey, number>)
    : {
        pace: 0,
        shooting: 0,
        passing: 0,
        dribbling: 0,
        defending: 0,
        physic: 0,
      };
  const defaultSlotPlayers: SlotPlayers = {
    pace: undefined,
    shooting: undefined,
    passing: undefined,
    dribbling: undefined,
    defending: undefined,
    physic: undefined,
  };
  const defaultPageState: PageState = {
    identity: defaultIdentity,
    stats: defaultStats,
    mode: "edit" as const,
  };

  // editState is null until the user makes a change — derived state reads from savedPlayer first
  const [editState, setEditState] = useState<PageState | null>(null);
  const [slotPlayers, setSlotPlayers] =
    useState<SlotPlayers>(defaultSlotPlayers);
  const [activeSlot, setActiveSlot] = useState<StatKey | null>(null);
  const [created, setCreated] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: savedPlayer, isLoading: isFetching } = useGetDreamPlayers();
  const { mutate: createDreamPlayer, isPending: isCreating } =
    useCreateDreamPlayer();
  const { mutate: updateDreamPlayer, isPending: isUpdating } =
    useUpdateDreamPlayer();
  const isPending = isCreating || isUpdating;
  const isExisting = !!savedPlayer;

  // Derive displayed state: user edits take priority; fall back to saved server data
  const pageState: PageState =
    editState ??
    (savedPlayer
      ? buildPageStateFromSaved(savedPlayer, defaultIdentity)
      : defaultPageState);

  const { identity, stats, mode } = pageState;
  const isReadOnly = mode === "view";

  const overall = useMemo(() => {
    const values = Object.values(stats).filter((v) => v > 0);
    return values.length === 0
      ? 0
      : Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }, [stats]);

  const usedPlayerIds = useMemo<Set<number>>(() => {
    const ids = new Set<number>();
    (
      Object.entries(slotPlayers) as [StatKey, IPlayersResponse | undefined][]
    ).forEach(([key, p]) => {
      if (p && key !== activeSlot) ids.add(p.id);
    });
    return ids;
  }, [slotPlayers, activeSlot]);

  const hasAnyPlayer = Object.values(slotPlayers).some(Boolean);
  const allSlotsFilled = (Object.keys(defaultSlotPlayers) as StatKey[]).every(
    (k) => slotPlayers[k],
  );

  const patchIdentity = <K extends keyof PlayerIdentity>(
    key: K,
    value: PlayerIdentity[K],
  ) =>
    setEditState({
      ...pageState,
      identity: { ...pageState.identity, [key]: value },
    });

  const handlePlayerSelect = (p: IPlayersResponse) => {
    if (!activeSlot) return;
    setSlotPlayers((prev) => ({ ...prev, [activeSlot]: p }));
    setEditState({
      ...pageState,
      stats: { ...pageState.stats, [activeSlot]: getStatValue(p, activeSlot) },
    });
    setActiveSlot(null);
  };

  const handleChangePlayer = () => {
    setSlotPlayers(defaultSlotPlayers);
    setEditState(
      savedPlayer
        ? {
            ...buildPageStateFromSaved(savedPlayer, defaultIdentity),
            mode: "edit",
          }
        : defaultPageState,
    );
  };

  const handleCreate = () => {
    setCreated(false);
    setErrorMsg(null);
    const payload: IDreamPlayerPayload = { ...identity, ...stats };
    const mutate = isExisting ? updateDreamPlayer : createDreamPlayer;
    mutate(payload, {
      onSuccess: () => {
        setCreated(true);
        setEditState(null); // clear edits — savedPlayer refetch will show view mode
        setTimeout(() => setCreated(false), 2500);
      },
      onError: (err) => {
        setErrorMsg(extractErrorMessage(err));
        setTimeout(() => setErrorMsg(null), 4000);
      },
    });
  };

  if (isFetching) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0f0c]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            {[0, 150, 300].map((delay) => (
              <div
                key={delay}
                className="w-2 h-2 rounded-full bg-[#00fe66] animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 font-[Oxanium,sans-serif]">
            Loading your dream player...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0d0f0c] text-[#fcfcf8] font-[Oxanium,sans-serif]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(71,72,69,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(71,72,69,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      >
        {created && (
          <div className="animate-toast-success fixed top-8 left-1/2 z-50 px-7 py-3 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase text-[#00fe66] bg-[rgba(0,254,102,0.12)] border border-[rgba(0,254,102,0.4)] backdrop-blur-md font-[Oxanium,sans-serif]">
            {isExisting
              ? "PLAYER UPDATED SUCCESSFULLY"
              : "PLAYER CREATED SUCCESSFULLY"}
          </div>
        )}
        {errorMsg && (
          <div className="animate-toast-error fixed top-8 left-1/2 z-50 px-7 py-3 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase text-[rgba(255,90,90,0.95)] bg-[rgba(255,50,50,0.1)] border border-[rgba(255,60,60,0.4)] backdrop-blur-md font-[Oxanium,sans-serif] max-w-[80vw] text-center">
            {errorMsg}
          </div>
        )}

        <div className="absolute top-8 left-8 pointer-events-none select-none z-0">
          <h1
            className="font-[Bebas_Neue,sans-serif] leading-[0.95] tracking-[-0.01em]"
            style={{
              fontSize: "clamp(48px,10vw,80px)",
              color: "rgba(252,252,248,0.06)",
            }}
          >
            DREAM
            <br />
            PLAYER
          </h1>
        </div>

        {isReadOnly && (
          <div className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,254,102,0.08)] border border-[rgba(0,254,102,0.2)] backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00fe66] animate-pulse" />
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#00fe66] font-[Oxanium,sans-serif]">
              Your Dream Player
            </span>
          </div>
        )}

        <main className="relative w-full max-w-7xl flex flex-col md:flex-row items-center justify-center gap-8 px-6 py-8 pt-16 z-10">
          {/* Left stats */}
          <div className="flex flex-col gap-6 z-20 w-full md:w-auto order-2 md:order-1">
            {LEFT_STATS.map(({ key, label, Icon, connectorWidth }) => (
              <StatCard
                key={key}
                label={label}
                value={stats[key as StatKey]}
                icon={<Icon className="w-4 h-4" />}
                connectorWidth={connectorWidth}
                side="left"
                filled={
                  !!slotPlayers[key as StatKey] || stats[key as StatKey] > 0
                }
                active={activeSlot === key}
                onClick={() => !isReadOnly && setActiveSlot(key as StatKey)}
                readOnly={isReadOnly}
                playerName={slotPlayers[key as StatKey]?.short_name}
                playerFaceUrl={slotPlayers[key as StatKey]?.player_face_url}
              />
            ))}
          </div>

          {/* Center */}
          <div
            className="relative flex-1 flex flex-col items-center justify-center order-1 md:order-2"
            style={{ height: "520px" }}
          >
            <div className="absolute w-[380px] h-[380px] rounded-full border border-[rgba(0,254,102,0.05)] animate-spin-slow" />
            <div className="absolute w-[480px] h-[480px] rounded-full border border-[rgba(0,254,102,0.08)] animate-spin-slow-reverse" />
            <div className="relative z-10 h-full flex items-end justify-center pb-24 pointer-events-none">
              <Image
                src={CENTER_IMAGE}
                alt="Player"
                width={320}
                height={320}
                className="player-glow mix-blend-screen brightness-125 saturate-50 select-none"
                style={{ height: 320, objectFit: "contain" }}
                unoptimized
              />
            </div>
            <div className="absolute top-1/4    left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-[#00fe66] animate-pulse shadow-[0_0_10px_rgba(0,255,102,0.8)]" />
            <div className="absolute top-1/2    left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-[#00fe66] animate-pulse animate-delay-700 shadow-[0_0_10px_rgba(0,255,102,0.8)]" />
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-[#00fe66] animate-pulse animate-delay-1000 shadow-[0_0_10px_rgba(0,255,102,0.8)]" />

            {/* Player card */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[min(340px,90vw)]">
              <div className="rounded-2xl px-5 py-4 flex flex-col gap-3 bg-[rgba(18,20,17,0.85)] backdrop-blur-xl border border-[rgba(169,255,172,0.15)]">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-2xl bg-gradient-to-br from-[rgba(0,254,102,0.18)] to-[rgba(0,254,102,0.04)] border border-[rgba(0,254,102,0.3)] shrink-0">
                    <span
                      className={[
                        "text-[26px] leading-none font-[Bebas_Neue,sans-serif]",
                        overall > 0
                          ? "text-[#00fe66]"
                          : "text-[rgba(0,254,102,0.3)]",
                      ].join(" ")}
                    >
                      {overall > 0 ? overall : "–"}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <EditableText
                      value={identity.name}
                      onChange={(v) => patchIdentity("name", v)}
                      placeholder="Player Name"
                      maxLength={22}
                      className="text-[20px] leading-none uppercase tracking-wide text-[#fcfcf8] font-[Bebas_Neue,sans-serif] block w-full"
                      inputClassName="text-[20px] leading-none uppercase tracking-wide w-full font-[Bebas_Neue,sans-serif]"
                      readOnly={isReadOnly}
                    />
                    <PositionPicker
                      value={identity.position}
                      onChange={(v) => patchIdentity("position", v)}
                      readOnly={isReadOnly}
                      positions={playerAttributes?.all_positions}
                    />
                  </div>
                </div>

                <div className="w-full h-px bg-[rgba(0,254,102,0.1)]" />

                <div className="grid grid-cols-3 gap-x-3">
                  <div className="flex flex-col items-center gap-[3px]">
                    <div className="flex items-center gap-1">
                      <Flag className="w-3 h-3 text-[#00fe66] opacity-70" />
                      <span className="text-[8px] font-bold tracking-widest text-white/35 uppercase font-[Oxanium,sans-serif]">
                        Nat
                      </span>
                    </div>
                    {isReadOnly ? (
                      <span className="font-[Bebas_Neue,sans-serif] text-[14px] text-[#fcfcf8] truncate max-w-[72px] block text-center">
                        {identity.nationality}
                      </span>
                    ) : (
                      <CountryPicker
                        value={identity.nationality}
                        onChange={(v) => patchIdentity("nationality", v)}
                      />
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-[3px]">
                    <div className="flex items-center gap-1">
                      <Hash className="w-3 h-3 text-[#00fe66] opacity-70" />
                      <span className="text-[8px] font-bold tracking-widest text-white/35 uppercase font-[Oxanium,sans-serif]">
                        Shirt
                      </span>
                    </div>
                    <EditableText
                      value={String(identity.shirt_number)}
                      onChange={(v) => {
                        const n = parseInt(v, 10);
                        if (!isNaN(n) && n >= 1 && n <= 99)
                          patchIdentity("shirt_number", n);
                      }}
                      placeholder="7"
                      maxLength={2}
                      min={1}
                      max={99}
                      type="number"
                      className="font-[Bebas_Neue,sans-serif] text-[14px] text-[#fcfcf8] text-center block w-full"
                      inputClassName="font-[Bebas_Neue,sans-serif] text-[14px] text-center w-[40px]"
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-[3px]">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#00fe66] opacity-70" />
                      <span className="text-[8px] font-bold tracking-widest text-white/35 uppercase font-[Oxanium,sans-serif]">
                        Foot
                      </span>
                    </div>
                    <FootToggle
                      value={identity.preferred_foot}
                      onChange={(v) => patchIdentity("preferred_foot", v)}
                      readOnly={isReadOnly}
                    />
                  </div>
                </div>

                {!isReadOnly && (
                  <p className="text-[8px] text-white/20 tracking-[0.12em] uppercase text-center -mb-1">
                    Click any field to edit · Click foot to toggle
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right stats */}
          <div className="flex flex-col gap-6 z-20 w-full md:w-auto order-3">
            {RIGHT_STATS.map(({ key, label, Icon, connectorWidth }) => (
              <StatCard
                key={key}
                label={label}
                value={stats[key as StatKey]}
                icon={<Icon className="w-4 h-4" />}
                connectorWidth={connectorWidth}
                side="right"
                filled={
                  !!slotPlayers[key as StatKey] || stats[key as StatKey] > 0
                }
                active={activeSlot === key}
                onClick={() => !isReadOnly && setActiveSlot(key as StatKey)}
                readOnly={isReadOnly}
                playerName={slotPlayers[key as StatKey]?.short_name}
                playerFaceUrl={slotPlayers[key as StatKey]?.player_face_url}
              />
            ))}
          </div>
        </main>

        <div className="relative z-30 flex flex-col items-center gap-3 pb-10">
          {isReadOnly ? (
            <button
              onClick={handleChangePlayer}
              className="flex items-center gap-3 px-10 py-[13px] rounded-xl border border-[rgba(0,254,102,0.25)] cursor-pointer uppercase font-bold tracking-[0.1em] text-[0.85rem] transition-[transform,box-shadow,border-color] duration-150 font-[Oxanium,sans-serif] text-[rgba(0,254,102,0.7)] bg-[rgba(0,254,102,0.05)] hover:border-[rgba(0,254,102,0.5)] hover:text-[#00fe66] hover:-translate-y-0.5"
            >
              <RefreshCw className="w-4 h-4" />
              Change Dream Player
            </button>
          ) : (
            <>
              {isPending && (
                <div className="flex items-center gap-2 mb-1">
                  {[0, 150, 300].map((delay) => (
                    <div
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full bg-[#00fe66] animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              )}
              <button
                onClick={handleCreate}
                disabled={(!isExisting && !hasAnyPlayer) || isPending}
                className={[
                  "relative overflow-hidden flex items-center gap-3 px-12 py-[14px] rounded-xl border-none cursor-pointer uppercase font-bold tracking-[0.1em] text-[0.85rem] transition-[transform,box-shadow,opacity] duration-150 font-[Oxanium,sans-serif]",
                  (isExisting || hasAnyPlayer) && !isPending
                    ? "text-[#0d0f0c] bg-gradient-to-br from-[#00fe66] to-[#00c44f] shadow-[0_0_24px_rgba(0,254,102,0.25),0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_0_40px_rgba(0,254,102,0.4),0_8px_24px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 hover:scale-[1.03] active:scale-[0.97]"
                    : "text-[rgba(0,254,102,0.3)] bg-[rgba(0,254,102,0.05)] border border-[rgba(0,254,102,0.12)] cursor-not-allowed",
                ].join(" ")}
              >
                <span className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent pointer-events-none" />
                <Plus className="w-4 h-4" strokeWidth={3} />
                {isPending
                  ? isExisting
                    ? "Updating..."
                    : "Creating..."
                  : isExisting
                    ? "Update Player"
                    : "Create Player"}
              </button>
            </>
          )}
          <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 font-[Oxanium,sans-serif]">
            {isReadOnly
              ? "Your dream player is saved"
              : allSlotsFilled
                ? "All attributes assigned — ready to create"
                : "Click any attribute card to assign a player"}
          </p>
        </div>
      </div>

      {activeSlot !== null && (
        <PlayerPickerModal
          label={activeSlot.toUpperCase()}
          isGK={identity.position === "GK"}
          onClose={() => setActiveSlot(null)}
          onSelect={handlePlayerSelect}
          usedPlayerIds={usedPlayerIds}
        />
      )}
    </>
  );
}
