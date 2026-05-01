"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { Flag, Hash, Star, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useCreateDreamPlayer } from "@/features/main/dashboard/hooks/useCreateDreamPlayer";
import { useUpdateDreamPlayer } from "@/features/main/dashboard/hooks/useUpdateDreamPlayer";
import { useDeleteDreamPlayer } from "@/features/main/dashboard/hooks/useDeleteDreamPlayer";
import { useGetDreamPlayer } from "@/features/main/dashboard/hooks/useGetDreamPlayer";
import { useGetPlayerAttributes } from "@/features/main/football";
import { IDreamPlayerPayload } from "@/features/main/dashboard/types";
import { IPlayersResponse } from "@/features/main/dashboard";
import { PlayerPickerModal } from "@/components/common/modals/PlayerPickerModal";
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
} from "@/features/main/dashboard/types";

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
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: savedPlayer, isLoading: isFetching } = useGetDreamPlayer();
  const { mutate: createDreamPlayer, isPending: isCreating } =
    useCreateDreamPlayer();
  const { mutate: updateDreamPlayer, isPending: isUpdating } =
    useUpdateDreamPlayer();
  const { mutate: deleteDreamPlayer, isPending: isDeleting } =
    useDeleteDreamPlayer();
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
    if (isReadOnly && savedPlayer?.overall != null) return savedPlayer.overall;
    const values = Object.values(stats).filter((v) => v > 0);
    return values.length === 0
      ? 0
      : Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }, [isReadOnly, savedPlayer?.overall, stats]);

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
      stats: {
        ...pageState.stats,
        [activeSlot]: getStatValue(
          p,
          activeSlot,
          playerAttributes?.stat_field_map,
        ),
      },
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

  const handleDelete = () => {
    setErrorMsg(null);
    deleteDreamPlayer(undefined, {
      onSuccess: () => {
        setConfirmDelete(false);
        setEditState(null);
        setSlotPlayers(defaultSlotPlayers);
      },
      onError: (err) => {
        setConfirmDelete(false);
        setErrorMsg(extractErrorMessage(err));
        setTimeout(() => setErrorMsg(null), 4000);
      },
    });
  };

  const handleCreate = () => {
    setCreated(false);
    setErrorMsg(null);
    const payload: IDreamPlayerPayload = {
      name: identity.name,
      nationality: identity.nationality,
      shirt_number: identity.shirt_number,
      preferred_foot: identity.preferred_foot,
      ...stats,
    };
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
            {(
              [
                "[animation-delay:0ms]",
                "[animation-delay:150ms]",
                "[animation-delay:300ms]",
              ] as const
            ).map((delayClass) => (
              <div
                key={delayClass}
                className={`w-2 h-2 rounded-full bg-[#00fe66] animate-bounce ${delayClass}`}
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
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0d0f0c] text-[#fcfcf8] font-[Oxanium,sans-serif] bg-[linear-gradient(to_right,rgba(71,72,69,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(71,72,69,0.1)_1px,transparent_1px)] [background-size:40px_40px]">
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

        <div className="absolute top-4 left-4 md:top-8 md:left-8 pointer-events-none select-none z-0">
          <h1 className="font-[Bebas_Neue,sans-serif] leading-[0.95] tracking-[-0.01em] text-[clamp(32px,8vw,80px)] text-[rgba(252,252,248,0.06)]">
            DREAM
            <br />
            PLAYER
          </h1>
        </div>

        {isReadOnly && (
          <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-[rgba(0,254,102,0.08)] border border-[rgba(0,254,102,0.2)] backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00fe66] animate-pulse" />
            <span className="text-[8px] md:text-[9px] font-bold tracking-[0.2em] uppercase text-[#00fe66] font-[Oxanium,sans-serif]">
              Your Dream Player
            </span>
          </div>
        )}

        <main className="relative w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-8 px-4 md:px-6 py-6 md:py-8 pt-20 md:pt-16 z-10">
          {/* Left stats */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-4 md:gap-6 z-20 w-full lg:w-auto order-2 lg:order-1 items-center">
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
          <div className="relative flex-1 flex flex-col items-center justify-center order-1 lg:order-2 h-[400px] md:h-[520px] w-full">
            <div className="absolute w-[280px] h-[280px] md:w-[380px] md:h-[380px] rounded-full border border-[rgba(0,254,102,0.05)] animate-spin-slow" />
            <div className="absolute w-[360px] h-[360px] md:w-[480px] md:h-[480px] rounded-full border border-[rgba(0,254,102,0.08)] animate-spin-slow-reverse" />
            <div className="relative z-10 h-full flex items-end justify-center pb-20 md:pb-24 pointer-events-none w-full">
              <Image
                src={CENTER_IMAGE}
                alt="Player"
                width={320}
                height={320}
                className="player-glow mix-blend-screen brightness-125 saturate-50 select-none scale-75 md:scale-100 h-auto max-w-full object-contain"
                unoptimized
              />
            </div>
            <div className="absolute top-1/4    left-1/2 -translate-x-1/2 w-2 md:w-3 h-2 md:h-3 rounded-full border border-[#00fe66] animate-pulse shadow-[0_0_10px_rgba(0,255,102,0.8)]" />
            <div className="absolute top-1/2    left-1/2 -translate-x-1/2 w-2 md:w-3 h-2 md:h-3 rounded-full border border-[#00fe66] animate-pulse animate-delay-700 shadow-[0_0_10px_rgba(0,255,102,0.8)]" />
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-2 md:w-3 h-2 md:h-3 rounded-full border border-[#00fe66] animate-pulse animate-delay-1000 shadow-[0_0_10px_rgba(0,255,102,0.8)]" />

            {/* Player card */}
            <div className="absolute bottom-0 md:bottom-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-[340px] px-4 md:px-0">
              <div className="rounded-2xl px-4 py-3 md:px-5 md:py-4 flex flex-col gap-2 md:gap-3 bg-[rgba(18,20,17,0.85)] backdrop-blur-xl border border-[rgba(169,255,172,0.15)] shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="px-2 md:px-3 py-0.5 md:py-1 rounded-2xl bg-gradient-to-br from-[rgba(0,254,102,0.18)] to-[rgba(0,254,102,0.04)] border border-[rgba(0,254,102,0.3)] shrink-0">
                    <span
                      className={[
                        "text-[20px] md:text-[26px] leading-none font-[Bebas_Neue,sans-serif]",
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
                      className="text-[18px] md:text-[20px] leading-none uppercase tracking-wide text-[#fcfcf8] font-[Bebas_Neue,sans-serif] block w-full truncate"
                      inputClassName="text-[18px] md:text-[20px] leading-none uppercase tracking-wide w-full font-[Bebas_Neue,sans-serif]"
                      readOnly={isReadOnly}
                    />
                    {isReadOnly && (
                      <PositionPicker
                        value={identity.position}
                        onChange={(v) => patchIdentity("position", v)}
                        readOnly
                        positions={playerAttributes?.all_positions}
                      />
                    )}
                  </div>
                </div>

                <div className="w-full h-px bg-[rgba(0,254,102,0.1)]" />

                <div className="grid grid-cols-3 gap-x-2 md:gap-x-3">
                  <div className="flex flex-col items-center gap-[3px]">
                    <div className="flex items-center gap-1">
                      <Flag className="w-2.5 md:w-3 h-2.5 md:h-3 text-[#00fe66] opacity-70" />
                      <span className="text-[7px] md:text-[8px] font-bold tracking-widest text-white/35 uppercase font-[Oxanium,sans-serif]">
                        Nat
                      </span>
                    </div>
                    {isReadOnly ? (
                      <span className="font-[Bebas_Neue,sans-serif] text-[12px] md:text-[14px] text-[#fcfcf8] truncate max-w-[60px] md:max-w-[72px] block text-center">
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
                      <Hash className="w-2.5 md:w-3 h-2.5 md:h-3 text-[#00fe66] opacity-70" />
                      <span className="text-[7px] md:text-[8px] font-bold tracking-widest text-white/35 uppercase font-[Oxanium,sans-serif]">
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
                      className="font-[Bebas_Neue,sans-serif] text-[12px] md:text-[14px] text-[#fcfcf8] text-center block w-full"
                      inputClassName="font-[Bebas_Neue,sans-serif] text-[12px] md:text-[14px] text-center w-[30px] md:w-[40px]"
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-[3px]">
                    <div className="flex items-center gap-1">
                      <Star className="w-2.5 md:w-3 h-2.5 md:h-3 text-[#00fe66] opacity-70" />
                      <span className="text-[7px] md:text-[8px] font-bold tracking-widest text-white/35 uppercase font-[Oxanium,sans-serif]">
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
                  <p className="text-[7px] md:text-[8px] text-white/20 tracking-[0.12em] uppercase text-center -mb-1">
                    Click fields to edit
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right stats */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-4 md:gap-6 z-20 w-full lg:w-auto order-3 items-center">
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

        <div className="relative z-30 flex flex-col items-center gap-3 pb-8 md:pb-10 px-6">
          {isReadOnly ? (
            <div className="flex flex-col items-center gap-2 w-full max-w-xs">
              <button
                onClick={handleChangePlayer}
                className="w-full flex items-center justify-center gap-3 px-8 md:px-10 py-[11px] md:py-[13px] rounded-xl border border-[rgba(0,254,102,0.25)] cursor-pointer uppercase font-bold tracking-[0.1em] text-[0.75rem] md:text-[0.85rem] transition-all duration-150 font-[Oxanium,sans-serif] text-[rgba(0,254,102,0.7)] bg-[rgba(0,254,102,0.05)] hover:border-[rgba(0,254,102,0.5)] hover:text-[#00fe66] hover:-translate-y-0.5"
              >
                <RefreshCw className="w-4 h-4" />
                Change Dream Player
              </button>
              {confirmDelete ? (
                <div className="flex items-center gap-2 w-full">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-[10px] rounded-xl border border-[rgba(255,60,60,0.5)] cursor-pointer uppercase font-bold tracking-[0.1em] text-[0.7rem] transition-all duration-150 font-[Oxanium,sans-serif] text-[rgba(255,90,90,0.9)] bg-[rgba(255,50,50,0.1)] hover:bg-[rgba(255,50,50,0.18)] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? "Deleting..." : "Confirm Delete"}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    disabled={isDeleting}
                    className="px-4 py-[10px] rounded-xl border border-[rgba(71,72,69,0.3)] cursor-pointer uppercase font-bold tracking-[0.1em] text-[0.7rem] transition-all duration-150 font-[Oxanium,sans-serif] text-white/40 hover:text-white/70 hover:border-[rgba(71,72,69,0.6)] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-[10px] rounded-xl border border-[rgba(255,60,60,0.2)] cursor-pointer uppercase font-bold tracking-[0.1em] text-[0.7rem] transition-all duration-150 font-[Oxanium,sans-serif] text-[rgba(255,90,90,0.5)] bg-transparent hover:border-[rgba(255,60,60,0.45)] hover:text-[rgba(255,90,90,0.85)]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Dream Player
                </button>
              )}
            </div>
          ) : (
            <>
              {isPending && (
                <div className="flex items-center gap-2 mb-1">
                  {(
                    [
                      "[animation-delay:0ms]",
                      "[animation-delay:150ms]",
                      "[animation-delay:300ms]",
                    ] as const
                  ).map((delayClass) => (
                    <div
                      key={delayClass}
                      className={`w-1.5 h-1.5 rounded-full bg-[#00fe66] animate-bounce ${delayClass}`}
                    />
                  ))}
                </div>
              )}
              <button
                onClick={handleCreate}
                disabled={(!isExisting && !hasAnyPlayer) || isPending}
                className={[
                  "relative overflow-hidden flex items-center gap-3 px-8 md:px-12 py-[12px] md:py-[14px] rounded-xl border-none cursor-pointer uppercase font-bold tracking-[0.1em] text-[0.75rem] md:text-[0.85rem] transition-all duration-150 font-[Oxanium,sans-serif] w-full md:w-auto",
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
          <p className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-white/30 font-[Oxanium,sans-serif] text-center">
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
          ratingPosition={identity.position}
          statKey={activeSlot}
          statFieldMap={playerAttributes?.stat_field_map}
        />
      )}
    </>
  );
}
