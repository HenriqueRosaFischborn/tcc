import { NextRequest, NextResponse } from "next/server"
import { auth } from "./auth"
import { getToken } from "next-auth/jwt"



export const config = {
    matcher: ['/gerenciamento/:path*', '/api/:path*', '/entrar/:path*', '/cadastro/:path*', '/esqueci-minha-senha/:path*', '/redefinir-senha/:path*', '/minhas-inscricoes/:path*', '/torneios-abertos/:path*'],
}

export async function middleware(req: NextRequest) {
   
    
    const pathname = req.nextUrl.pathname
    
    const token = await getToken({
        req,
        secret: process.env.AUTH_SECRET, // ou NEXTAUTH_SECRET
    })
    
    const authRoutes = ['/entrar', '/cadastro', '/esqueci-minha-senha', '/redefinir-senha']
    const isAuth = authRoutes.some((el) => {
        if (pathname.startsWith(el)) {
            return true
        }
    })
    if (token && isAuth) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    const isMyInscription = pathname.startsWith('/minhas-inscricoes')
    if (isMyInscription && !token) {
        return NextResponse.redirect(new URL('/', req.url))
    }


    const isApi = pathname.startsWith('/api')
    if (isApi) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    const isAdmin = pathname.startsWith('/gerenciamento')
    
    if (isAdmin) {
        if (!(token && token.admin)) {
            return NextResponse.redirect(new URL('/', req.url))
        }
    }


    const isTournment = pathname.startsWith('/torneios-abertos/')
    
    //const paramPath = pathname.replaceAll('/', '%')
    console.log(pathname)
    if (isTournment && !token) {
        
        return NextResponse.redirect(new URL(`/entrar?urlBack=${pathname}`, req.url)) 
    }
}