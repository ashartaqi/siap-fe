"use client";

import React from "react";
import { Carousel } from "@/components/common/Carousel";
import { PlayerDetailModal } from "@/components/common/modals/PlayerDetailModal";
import { FavoritePlayerItem } from "@/components/ui/dashboard/FavoritePlayerItem";
import {
  useGetFavoritePlayers,
  useAddFavoritePlayer,
  useRemoveFavoritePlayer,
  type IPlayersResponse,
} from "@/features/main/dashboard";

export function FavoritePlayers() {
  const [current, setCurrent] = React.useState(0);
  const [selectedPlayer, setSelectedPlayer] =
    React.useState<IPlayersResponse | null>(null);
  const { data, isLoading: loading } = useGetFavoritePlayers();
  const addFav = useAddFavoritePlayer();
  const removeFav = useRemoveFavoritePlayer();
  const favoritePlayers = data ?? [];
  const favIds = React.useMemo(
    () => new Set(favoritePlayers.map((p) => p.id)),
    [favoritePlayers],
  );

  if (loading) {
    return (
      <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/10 h-64 animate-pulse" />
    );
  }

  if (favoritePlayers.length === 0) {
    return (
      <section className="bg-surface-container-low rounded-lg border border-outline-variant/30 p-6 text-center text-base text-on-surface-variant">
        No favorite players selected.
      </section>
    );
  }

  const safeCurrent = Math.max(
    0,
    Math.min(current, favoritePlayers.length - 1),
  );

  const handleToggleFavorite = (player: IPlayersResponse) => {
    if (favIds.has(player.id)) {
      removeFav.mutate(player.id);
    } else {
      addFav.mutate(player.id);
    }
  };

  return (
    <>
      <section>
        <Carousel
          title={
            <h3 className="font-label text-[13px] uppercase tracking-widest text-on-surface-variant">
              Favorite Players
            </h3>
          }
          currentIndex={safeCurrent}
          totalItems={favoritePlayers.length}
          onIndexChange={setCurrent}
          headerClassName="mb-4"
          dotsContainerClassName="-mt-2 mb-4"
        >
          <FavoritePlayerItem
            key={favoritePlayers[safeCurrent].id}
            player={favoritePlayers[safeCurrent]}
            onOpen={setSelectedPlayer}
          />
        </Carousel>
      </section>

      {selectedPlayer && (
        <PlayerDetailModal
          player={selectedPlayer}
          isFavorite={favIds.has(selectedPlayer.id)}
          favLoading={addFav.isPending || removeFav.isPending}
          onClose={() => setSelectedPlayer(null)}
          onToggleFavorite={() => handleToggleFavorite(selectedPlayer)}
        />
      )}
    </>
  );
}
