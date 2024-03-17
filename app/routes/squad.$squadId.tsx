import { useParams } from "@remix-run/react";
import { useState } from "react";
import invariant from "tiny-invariant";
import { type Player, useSquadBuilder } from "~/hooks/useSquadBuilder";

import nameList from "~/data.json";

export default function SquadBuilder() {
  const { squadId } = useParams();
  invariant(squadId, "Missing squadId param");

  const { players, addPlayer, getInitialSquads, getNextSquad } =
    useSquadBuilder(squadId);

  const [squadA, setSquadA] = useState<Player[]>([]);
  const [squadB, setSquadB] = useState<Player[]>([]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h2 className="text-xl font-medium text-black my-2">
        Players
        <Button
          type="button"
          onClick={() => {
            const name = nameList[Math.floor(Math.random() * nameList.length)];
            if (name) {
              addPlayer(name);
            }
          }}
        >
          Add player
        </Button>
        <Button
          type="button"
          onClick={() => {
            const name = nameList[Math.floor(Math.random() * nameList.length)];
            if (name) {
              addPlayer(name, true);
            }
          }}
        >
          Add visitor
        </Button>
      </h2>

      <table className="border-collapse table-auto w-full text-sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Arrived At</th>
            <th>Last Played At</th>
            <th>Visitor</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(players).map((player, index) => (
            <tr key={player.id}>
              <td>{index + 1}</td>
              <td>{player.name}</td>
              <td>{player.arrivedAt.toISOString()}</td>
              <td>{player.lastPlayedAt.toISOString() || "Never"}</td>
              <td>{player.isVisitor ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-medium text-black my-2">
            Squad A{" "}
            <Button
              type="button"
              onClick={() => {
                const newSquad = getNextSquad(squadB);
                setSquadA(newSquad);
              }}
            >
              New
            </Button>
          </h2>
          <ol>
            {squadA.map((player) => (
              <li key={player.id}>{player.name}{player.isVisitor ? ' (Visitor)' : ''}</li>
            ))}
          </ol>
        </div>
        <div>
          <h2 className="text-xl font-medium text-black my-2">
            Squad B{" "}
            <Button
              type="button"
              onClick={() => {
                const newSquad = getNextSquad(squadA);
                setSquadB(newSquad);
              }}
            >
              New
            </Button>
          </h2>
          <ol>
            {squadB.map((player) => (
              <li key={player.id}>{player.name}{player.isVisitor ? ' (Visitor)' : ''}</li>
            ))}
          </ol>
        </div>
      </div>
      <Button
        type="button"
        onClick={() => {
          const [newSquadA, newSquadB] = getInitialSquads();

          setSquadA(newSquadA);
          setSquadB(newSquadB);
        }}
      >
        Draft initial squads
      </Button>
    </div>
  );
}

function Button(props) {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      {...props}
    />
  );
}
