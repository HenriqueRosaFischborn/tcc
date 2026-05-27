import generateXLStable from '@/app/gerenciamento/torneios/[torneio]/analisar-jogadores/client/tables/createXLS'
import { Player } from '@/lib/types'

type Inscricoes = {
    [key: string]: Player
}

export async function POST(req: Request) {
  const players = await req.json() as Inscricoes

  const fileBuffer = await generateXLStable(players)

//   return new NextResponse(fileBuffer, {
//     headers: {
//       'Content-Type':
//         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

//       'Content-Disposition':
//         'attachment; filename="NationalRatings.xlsx"',
//     },
//   })
}