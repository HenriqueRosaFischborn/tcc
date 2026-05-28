import { Player } from '@/lib/types'
import { utils } from 'xlsx'

type Inscricoes = {
  [key: string]: Player
}

export async function POST(req: Request) {
  function formatDate(date: Date) {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }
  
  const players = (await req.json()) as Inscricoes

  // Cabeçalhos do Swiss Manager
  const rows = [
    [
      'ID_No',
      'Name',
      'Sex',
      'Fed',
      'ClubName',
      'Birthday',
      'Rtg_Nat',
      'Fide_No',
      'Rtg_Int' 
    ]
  ]

  for (const player of Object.values(players)) {
    rows.push([
      String(player.id_cbx ? player.id_cbx : 0),
      player.name,
      player.genre ? '' : 'f',
      'BRA',
      player.club ? player.club : player.city,
      formatDate(new Date(player.data_nasc)),
      String(player.rtg_cbx ? player.rtg_cbx : 0),
      String(player.id_fide ? player.id_fide : 0),
      String(player.rtg_fide ? player.rtg_fide : 0),
    ])
  }

  // Cria worksheet
  const worksheet = utils.aoa_to_sheet(rows)

  // Converte para CSV
  const csv = utils.sheet_to_csv(worksheet, {
    FS: ';', // separador (;)
  })

  // BOM UTF-8 para Excel abrir acentos certo
  const csvWithBom = '\uFEFF' + csv

  return new Response(csvWithBom, {
    headers: {
      'Content-Type':
        'text/csv; charset=utf-8',
      'Content-Disposition':
        'attachment; filename="NationalRatings.csv"',
    },
  })
}