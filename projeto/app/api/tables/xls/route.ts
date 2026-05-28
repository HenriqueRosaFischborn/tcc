import { Player } from '@/lib/types'
import fs from 'fs'
import path from 'path'
import { read, write } from 'xlsx'

type Inscricoes = {
  [key: string]: Player
}

export async function POST(req: Request) {
  const players = (await req.json()) as Inscricoes
  
  function formatDate(date: Date) {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  const templatePath = path.join(
    process.cwd(),
    'public',
    'templateXLS.xlsx'
  )

  // lê com fs
  const fileBuffer = fs.readFileSync(templatePath)

  // parseia com read
  const workbook = read(fileBuffer, {
    type: 'buffer',
    cellStyles: true,
    cellDates: true,
  })

  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]

  let rowIndex = 2
  
  for (const player of Object.values(players)) {
    worksheet[`A${rowIndex}`] = {
      t: 'n',
      v: player.id_cbx ? player.id_cbx : 0,
    }

    worksheet[`B${rowIndex}`] = {
      t: 's',
      v: player.name,
    }

    worksheet[`C${rowIndex}`] = {
      t: 's',
      v: player.genre ? '' : 'f',
    }

    worksheet[`D${rowIndex}`] = {
      t: 's',
      v: 'BRA',
    }

    worksheet[`E${rowIndex}`] = {
      t: 's',
      v: player.club ? player.club : player.city
    }

    worksheet[`F${rowIndex}`] = {
      t: 's',
      v: formatDate(new Date(player.data_nasc)),
    }

    worksheet[`G${rowIndex}`] = {
      t: 'n',
      v: player.rtg_cbx ? player.rtg_cbx : 0,
    }

    worksheet[`H${rowIndex}`] = {
      t: 'n',
      v: player.id_fide ? player.id_fide : 0,
    }

    worksheet[`I${rowIndex}`] = {
      t: 'n',
      v: player.rtg_fide ? player.rtg_fide : 0,
    }

    rowIndex++
  }

  const file = write(workbook, {
    type: 'array',
    bookType: 'xlsx',
  })

  return new Response(file, {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition':
        'attachment; filename="NationalRatings.xlsx"',
    },
  })
}