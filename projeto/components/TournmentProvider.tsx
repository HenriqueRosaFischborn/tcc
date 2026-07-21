'use client';

import { TournamentContext } from '@/lib/context';
import { Player } from '@/lib/types';

export default function TournamentProvider({
  children,
  id,
 inscricao
}: {
  children: React.ReactNode;
  id: number;
  inscricao?: Player;
}) {
  return (
    <TournamentContext.Provider value={{ id, inscricao }}>
      {children}
    </TournamentContext.Provider>
  );
}