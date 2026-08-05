import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { auth } from './auth'

export const config = {
  matcher: [
    '/gerenciamento/:path*',
    '/api/:path*',
    '/entrar/:path*',
    '/cadastro/:path*',
    '/esqueci-minha-senha/:path*',
    '/redefinir-senha/:path*',
    '/minhas-inscricoes/:path*',
    '/torneios-abertos/:path*',
  ],
}

export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  console.log('cookies: ', req.cookies.getAll())

  const token = await auth()

  console.log('token: ', token)

  const authRoutes = [
    '/entrar',
    '/cadastro',
    '/esqueci-minha-senha',
    '/redefinir-senha',
  ]

  const isAuth = authRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (token && isAuth) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (pathname.startsWith('/minhas-inscricoes') && !token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // if (pathname.startsWith('/api')) {
  //   return NextResponse.redirect(new URL('/', req.url))
  // }

  if (pathname.startsWith('/gerenciamento')) {
    if (!token || !token.user.admin) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  if (pathname.startsWith('/torneios-abertos') && !token) {
    return NextResponse.redirect(
      new URL(`/entrar?urlBack=${pathname}`, req.url)
    )
  }

  return NextResponse.next()
}
