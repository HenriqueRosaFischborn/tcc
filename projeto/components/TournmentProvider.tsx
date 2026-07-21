'use client';

import { TournamentContext } from '@/lib/context';

export default function TournamentProvider({
  children,
  id,
}: {
  children: React.ReactNode;
  id: number;
}) {
  return (
    <TournamentContext.Provider value={id}>
      {children}
    </TournamentContext.Provider>
  );
}