import NextAuth from "next-auth"
import type { NextApiRequest, NextApiResponse } from "next"
import LineProvider from "next-auth/providers/line"
import signup from "app/auth/mutations/signup"
import { invokeWithMiddleware, execute } from "@blitzjs/rpc"
import { Ctx } from "blitz"

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const clientId = "1657800743"
  const clientSecret = "332bc105c2846dc44b72761dce01165d"

  const providers = [
    LineProvider({
      clientId,
      clientSecret,
    }),
  ]

  return await NextAuth(req, res, {
    providers,
    // Enable debug messages in the console if you are having problems
    debug: true,
    pages: {
      signIn: "/auth/login",
      // erro r: "/404",
      // newUser: "/auth/login",
    },

    callbacks: {
      async session({ session, token }) {
        // Send properties to the client, like an access_token from a provider.
        session.accessToken = token.accessToken
        session.refreshToken = token.refreshToken
        session.idToken = token.idToken
        session.provider = token.provider
        session.id = token.id
        return session
      },
      async jwt({ token, user, account, profile }) {
        // Persist the OAuth access_token to the token right after signin
        if (account) {
          token.accessToken = account.access_token
          token.refreshToken = account.refresh_token
          token.idToken = account.id_token
          token.provider = account.provider
        }
        if (user) {
          token.id = user.id.toString()
          // await signup({ name: user?.name, lineId: user?.id }, Ctx)
        }
        return token
      },
    },
  })
}
