import { orderBy } from "lodash-es";
import { useCallback, useMemo } from "react";
import { useStorageState } from "./useStorageState";

export type Player = {
  id: string;
  name: string;
  arrivedAt: Date;
  lastPlayedAt: Date;
  isVisitor: boolean;
};

export function useSquadBuilder(key: string) {
  const [players, setPlayers] = useStorageState<Record<string, Player>>(
    key,
    {}
  );

  const addPlayer = useCallback(
    (name: string, isVisitor: boolean = false) => {
      const newPlayer = {
        id: new Date().getTime().toString(16),
        name,
        isVisitor,
        arrivedAt: new Date(),
        lastPlayedAt: new Date(0),
      };

      setPlayers((prev) => {
        return {
          ...prev,
          [newPlayer.id]: newPlayer,
        };
      });
    },
    [setPlayers]
  );

  const removePlayer = useCallback(
    (id: string) => {
      setPlayers((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    },
    [setPlayers]
  );

  const setLastPlayedAt = useCallback(
    (players: Player[]) => {
      setPlayers((prev) => {
        const now = new Date();
        return {
          ...prev,
          ...players.reduce((acc, player) => {
            acc[player.id] = {
              ...player,
              lastPlayedAt: now,
            };
            return acc;
          }, {} as Record<string, Player>),
        };
      });
    },
    [setPlayers]
  );

  const getNextSquad = useCallback(
    (playingPlayers: Player[], squadSize: number = 6) => {
      const pickedPlayers = orderBy(
        Object.values(players).filter(x => !playingPlayers.some(y => x.id === y.id)),
        ["lastPlayedAt", "isVisitor", "arrivedAt"],
        ["asc", "asc", "asc"]
      ).slice(0, squadSize);
      setLastPlayedAt(playingPlayers.concat(pickedPlayers));
      return pickedPlayers;
    },
    [players, setLastPlayedAt]
  );

  const getInitialSquads = useCallback(
    (squadSize: number = 6) => {
      const orderedPlayers = orderBy(Object.values(players), ["isVisitor", "arrivedAt"], ["asc", "asc"]).slice(
        0,
        squadSize * 2
      );

      setLastPlayedAt(orderedPlayers);

      const squadA: Player[] = [];
      const squadB: Player[] = [];

      orderedPlayers.forEach((player, index) => {
        if (index % 2 === 0) {
          squadA.push(player);
        } else {
          squadB.push(player);
        }
      });

      return [squadA, squadB];
    },
    [players, setLastPlayedAt]
  );

  return {
    players: useMemo(() => orderBy(Object.values(players),  ["arrivedAt"], ["asc"]), [players]),
    addPlayer,
    removePlayer,
    getNextSquad,
    getInitialSquads,
  };
}
