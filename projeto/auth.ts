import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import db from "./lib/db"
import findUserByCredentials from "./lib/user"
 

declare module "next-auth" {
  interface User {
    admin?: boolean
  }

  interface Session {
    user: {
      email?: string
      admin?: boolean
    }
  }

  interface JWT {
    admin?: boolean
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async session({token, session}) { 
      session.user.admin = Boolean(token.admin)
      
      return session
    },

    async jwt({token, user}) {     
      if (user) {
        token.admin = user.admin
      }
      return token
    }
  },
  providers: [Credentials({
    credentials: {
        email: {},
        password: {}
    },
    authorize: async (credentials) => {
        const user = await findUserByCredentials(credentials.email as string, credentials.password as string)
        return user
    }
  })],
})