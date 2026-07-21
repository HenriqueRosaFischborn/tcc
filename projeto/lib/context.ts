import { createContext } from "react";
import { Player } from "./types";

type TournamentContextType = {
  id: number;
  inscricao?: Player;
};

export const TournamentContext = createContext<TournamentContextType>({
  id: 0,
});